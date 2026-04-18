import { useRef, useState, useEffect, useCallback } from 'react'
import { Zap, X, CheckCircle2, ImageIcon, Loader2, Code2 } from 'lucide-react'
import { uploadCardImage } from '../lib/uploadImage'
import toast from 'react-hot-toast'

/**
 * QuickAddPanel — optimised for rapid card entry.
 * Tab: front → back
 * Enter on back (or Cmd+Enter anywhere): save card, refocus front
 * Escape: close panel
 * Paste / drag-drop image: attaches to whichever side is focused
 */
export default function QuickAddPanel({ onSave, onClose }) {
  const frontRef = useRef(null)
  const backRef = useRef(null)
  const panelRef = useRef(null)

  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [tags, setTags] = useState('')
  const [frontImage, setFrontImage] = useState(null)
  const [backImage, setBackImage] = useState(null)
  const [frontCode, setFrontCode] = useState(false)
  const [backCode, setBackCode] = useState(false)
  const [count, setCount] = useState(0)
  const [flash, setFlash] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingFor, setUploadingFor] = useState(null) // 'front' | 'back'
  const [dragging, setDragging] = useState(false)
  const [focused, setFocused] = useState('front') // track which side is active

  useEffect(() => { frontRef.current?.focus() }, [])

  const buildHtml = (text, image, isCode) => {
    let textPart = ''
    if (text.trim()) {
      textPart = isCode
        ? `<pre><code>${text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</code></pre>`
        : `<p>${text.trim().replace(/\n/g, '<br>')}</p>`
    }
    const imgPart = image ? `<img src="${image}" alt="" />` : ''
    return textPart + imgPart
  }

  const canSave = (front.trim() || frontImage) && (back.trim() || backImage)

  const save = useCallback(async () => {
    if (!canSave || saving) return
    setSaving(true)
    const tagArr = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []
    await onSave({
      front: buildHtml(front, frontImage, frontCode),
      back: buildHtml(back, backImage, backCode),
      tags: tagArr,
    })
    setSaving(false)
    setCount(c => c + 1)
    setFront(''); setBack('')
    setFrontImage(null); setBackImage(null)
    setFrontCode(false); setBackCode(false)
    setFlash(true)
    setTimeout(() => setFlash(false), 600)
    frontRef.current?.focus()
    setFocused('front')
  }, [front, back, frontImage, backImage, tags, saving, canSave, onSave])

  const attachImage = useCallback(async (file, side) => {
    if (!file?.type.startsWith('image/')) return
    const target = side || focused
    setUploadingFor(target)
    try {
      const url = await uploadCardImage(file)
      if (target === 'front') setFrontImage(url)
      else setBackImage(url)
    } catch {
      toast.error('Could not process image.')
    } finally {
      setUploadingFor(null)
    }
  }, [focused])

  // Paste handler — works anywhere inside the panel
  const handlePaste = useCallback((e) => {
    const items = Array.from(e.clipboardData?.items || [])
    const imageItem = items.find(i => i.type.startsWith('image/'))
    if (!imageItem) return
    e.preventDefault()
    attachImage(imageItem.getAsFile())
  }, [attachImage])

  // Drag-drop on the whole panel
  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file?.type.startsWith('image/')) attachImage(file)
  }, [attachImage])

  const handleFrontKey = (e) => {
    if (e.key === 'Tab') { e.preventDefault(); backRef.current?.focus() }
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') save()
    if (e.key === 'Escape') onClose()
  }

  const handleBackKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); save() }
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') save()
    if (e.key === 'Tab') { e.preventDefault(); frontRef.current?.focus() }
    if (e.key === 'Escape') onClose()
  }

  const autoResize = (el) => {
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }

  return (
    <div
      ref={panelRef}
      className="card-base mb-6 overflow-hidden pop-in"
      onPaste={handlePaste}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={(e) => { if (!panelRef.current?.contains(e.relatedTarget)) setDragging(false) }}
      style={{
        background: flash
          ? 'linear-gradient(135deg, rgba(134,239,172,0.12), rgba(134,239,172,0.06))'
          : 'var(--color-surface)',
        border: dragging
          ? '1.5px dashed #ff9f7a'
          : flash
          ? '1.5px solid rgba(134,239,172,0.5)'
          : '1.5px solid var(--color-border)',
        boxShadow: dragging ? '0 0 0 3px rgba(255,184,153,0.2)' : undefined,
        transition: 'background 0.3s, border-color 0.3s',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b"
        style={{ borderColor: 'var(--color-border)', background: 'rgba(255,184,153,0.08)' }}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <Zap size={14} style={{ color: '#ff9f7a' }} />
          <span className="text-sm font-bold" style={{ color: '#ff9f7a' }}>Quick Add</span>
          <span className="text-xs opacity-40 font-semibold">
            Tab · Enter to save · paste/drop image
          </span>
        </div>
        <div className="flex items-center gap-2">
          {count > 0 && (
            <span className="flex items-center gap-1 text-xs font-bold" style={{ color: '#86efac' }}>
              <CheckCircle2 size={13} />
              {count} added
            </span>
          )}
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/5 opacity-50 hover:opacity-100 transition-opacity"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Drag overlay hint */}
      {dragging && (
        <div className="px-4 py-2 text-xs font-bold text-center" style={{ color: '#ff9f7a', background: 'rgba(255,184,153,0.08)' }}>
          Drop image → goes to {focused === 'front' ? 'Question' : 'Answer'} side ✨
        </div>
      )}

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x"
        style={{ borderColor: 'var(--color-border)' }}>

        {/* Front */}
        <div
          className="p-4"
          style={focused === 'front'
            ? { background: frontCode ? 'rgba(28,25,23,0.03)' : 'rgba(255,184,153,0.04)' }
            : {}}
        >
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider opacity-40">
              Front — Question
            </label>
            <div className="flex items-center gap-2">
              <CodeToggle active={frontCode} onToggle={() => setFrontCode(v => !v)} />
              <ImageAttachBtn
                side="front"
                image={frontImage}
              uploading={uploadingFor === 'front'}
              onAttach={(file) => attachImage(file, 'front')}
              onClear={() => setFrontImage(null)}
            />
            </div>
          </div>
          <textarea
            ref={frontRef}
            value={front}
            onChange={e => { setFront(e.target.value); autoResize(e.target) }}
            onKeyDown={handleFrontKey}
            onFocus={() => setFocused('front')}
            placeholder={frontCode ? '// write your code here' : 'What do you want to remember?'}
            rows={3}
            className="w-full resize-none outline-none leading-relaxed"
            style={{
              fontFamily: frontCode ? "'Fira Code', 'Courier New', monospace" : 'var(--font-card)',
              fontSize: frontCode ? '0.85rem' : '1rem',
              background: frontCode ? 'rgba(28,25,23,0.04)' : 'transparent',
              color: 'var(--color-text)',
              minHeight: '72px',
              borderRadius: frontCode ? '8px' : 0,
              padding: frontCode ? '0.5rem' : 0,
            }}
          />
          {frontImage && (
            <ImagePreview src={frontImage} onClear={() => setFrontImage(null)} />
          )}
        </div>

        {/* Back */}
        <div
          className="p-4"
          style={focused === 'back'
            ? { background: backCode ? 'rgba(28,25,23,0.03)' : 'rgba(196,181,253,0.04)' }
            : {}}
        >
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider opacity-40">
              Back — Answer
            </label>
            <div className="flex items-center gap-2">
              <CodeToggle active={backCode} onToggle={() => setBackCode(v => !v)} />
              <ImageAttachBtn
                side="back"
                image={backImage}
                uploading={uploadingFor === 'back'}
                onAttach={(file) => attachImage(file, 'back')}
                onClear={() => setBackImage(null)}
              />
            </div>
          </div>
          <textarea
            ref={backRef}
            value={back}
            onChange={e => { setBack(e.target.value); autoResize(e.target) }}
            onKeyDown={handleBackKey}
            onFocus={() => setFocused('back')}
            placeholder={backCode ? '// write your code here' : 'The answer... (Enter to save)'}
            rows={3}
            className="w-full resize-none outline-none leading-relaxed"
            style={{
              fontFamily: backCode ? "'Fira Code', 'Courier New', monospace" : 'var(--font-card)',
              fontSize: backCode ? '0.85rem' : '1rem',
              background: backCode ? 'rgba(28,25,23,0.04)' : 'transparent',
              color: 'var(--color-text)',
              minHeight: '72px',
              borderRadius: backCode ? '8px' : 0,
              padding: backCode ? '0.5rem' : 0,
            }}
          />
          {backImage && (
            <ImagePreview src={backImage} onClear={() => setBackImage(null)} />
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-t gap-3"
        style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-warm)' }}
      >
        <div className="flex items-center gap-2 flex-1">
          <span className="text-xs opacity-40 font-semibold whitespace-nowrap">Tags</span>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); save() } }}
            placeholder="biology, chapter1  (sticky)"
            className="flex-1 outline-none text-sm"
            style={{ background: 'transparent', color: 'var(--color-text)' }}
          />
        </div>
        <button
          onClick={save}
          disabled={!canSave || saving}
          className="btn-primary text-sm py-1.5 px-4 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
        >
          {saving ? '...' : 'Save ↵'}
        </button>
      </div>
    </div>
  )
}

function CodeToggle({ active, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={active ? 'Switch to text' : 'Switch to code mode'}
      className="flex items-center gap-1 text-xs transition-opacity"
      style={{
        opacity: active ? 1 : 0.4,
        color: active ? '#a78bfa' : 'inherit',
        fontFamily: 'monospace',
        fontWeight: 700,
      }}
    >
      <Code2 size={12} />
      <span>code</span>
    </button>
  )
}

function ImageAttachBtn({ onAttach, onClear, image, uploading }) {
  const ref = useRef(null)
  if (image) return null // preview handles clear
  return (
    <label className="cursor-pointer" title="Attach image (or paste / drag-drop)">
      <div className="flex items-center gap-1 text-xs opacity-40 hover:opacity-80 transition-opacity">
        {uploading
          ? <Loader2 size={12} className="animate-spin" />
          : <ImageIcon size={12} />}
        <span>image</span>
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) onAttach(f); e.target.value = '' }}
      />
    </label>
  )
}

function ImagePreview({ src, onClear }) {
  return (
    <div className="relative mt-2 inline-block">
      <img
        src={src}
        alt=""
        className="max-w-full rounded-xl"
        style={{ maxHeight: '160px', objectFit: 'contain', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
      />
      <button
        onClick={onClear}
        className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-white"
        style={{ background: '#f87171', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
        title="Remove image"
      >
        <X size={10} />
      </button>
    </div>
  )
}
