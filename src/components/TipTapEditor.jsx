import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Image from '@tiptap/extension-image'
import { createLowlight } from 'lowlight'
import { Bold, Italic, Code, List, ImageIcon, Loader2 } from 'lucide-react'
import { useState, useCallback } from 'react'
import { uploadCardImage } from '../lib/uploadImage'
import toast from 'react-hot-toast'

const lowlight = createLowlight()

export default function TipTapEditor({ content, onChange, placeholder }) {
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Placeholder.configure({ placeholder: placeholder || 'Start typing...' }),
      CodeBlockLowlight.configure({ lowlight }),
      Image.configure({ inline: false, allowBase64: true }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  const insertImageUrl = useCallback((url) => {
    editor?.chain().focus().setImage({ src: url }).run()
  }, [editor])

  const handleUpload = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Only image files are supported.')
      return
    }
    setUploading(true)
    try {
      const url = await uploadCardImage(file)
      insertImageUrl(url)
      toast.success('Image added! 🖼️')
    } catch (err) {
      toast.error('Could not process image. Try a different file.')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }, [insertImageUrl])

  // Handle drop onto the editor wrapper
  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleUpload(file)
  }, [handleUpload])

  // Handle paste (Cmd+V screenshot)
  const handlePaste = useCallback((e) => {
    const items = Array.from(e.clipboardData?.items || [])
    const imageItem = items.find(i => i.type.startsWith('image/'))
    if (!imageItem) return
    e.preventDefault()
    const file = imageItem.getAsFile()
    if (file) handleUpload(file)
  }, [handleUpload])

  if (!editor) return null

  return (
    <div
      className={`tiptap-editor border-2 rounded-2xl overflow-hidden transition-colors ${dragging ? 'border-dashed' : ''}`}
      style={{
        borderColor: dragging ? '#ffb899' : 'var(--color-border)',
        background: dragging ? 'rgba(255,184,153,0.06)' : 'var(--color-surface)',
        boxShadow: dragging ? '0 0 0 3px rgba(255,184,153,0.2)' : 'none',
      }}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onPaste={handlePaste}
    >
      {/* Toolbar */}
      <div
        className="flex items-center gap-1 px-3 py-2 border-b flex-wrap"
        style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-warm)' }}
      >
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
          <Bold size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
          <Italic size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline code">
          <Code size={14} />
        </ToolbarBtn>
        <div className="w-px h-4 bg-black/10 mx-1" />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code block">
          <span className="text-xs font-mono font-bold">{'</>'}</span>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="List">
          <List size={14} />
        </ToolbarBtn>
        <div className="w-px h-4 bg-black/10 mx-1" />

        {/* Image upload button */}
        <label className="relative" title="Upload image">
          <ToolbarBtn as="span" active={false}>
            {uploading
              ? <Loader2 size={14} className="animate-spin" />
              : <ImageIcon size={14} />}
          </ToolbarBtn>
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f) }}
            disabled={uploading}
          />
        </label>

        {dragging && (
          <span className="ml-auto text-xs font-semibold" style={{ color: '#ff9f7a' }}>
            Drop to add image ✨
          </span>
        )}
        {uploading && (
          <span className="ml-auto text-xs opacity-50">Uploading...</span>
        )}
      </div>

      <EditorContent editor={editor} />

      {/* Drop zone hint (shown when editor is empty) */}
      {!dragging && editor.isEmpty && (
        <div className="px-3 pb-3 flex items-center gap-1.5 text-xs opacity-30">
          <ImageIcon size={11} />
          <span>Drag & drop or paste a screenshot here</span>
        </div>
      )}
    </div>
  )
}

function ToolbarBtn({ onClick, active, title, children, as: Tag = 'button' }) {
  return (
    <Tag
      type={Tag === 'button' ? 'button' : undefined}
      onClick={onClick}
      title={title}
      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors text-sm cursor-pointer ${
        active ? '' : 'hover:bg-black/5'
      }`}
      style={active ? { background: '#ffb899', color: 'white' } : {}}
    >
      {children}
    </Tag>
  )
}
