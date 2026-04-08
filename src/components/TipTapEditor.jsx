import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight } from 'lowlight'
import { Bold, Italic, Code, List } from 'lucide-react'

const lowlight = createLowlight()

export default function TipTapEditor({ content, onChange, placeholder }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Placeholder.configure({ placeholder: placeholder || 'Start typing...' }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  if (!editor) return null

  return (
    <div className="tiptap-editor border rounded-2xl overflow-hidden" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
      {/* Toolbar */}
      <div
        className="flex items-center gap-1 px-3 py-2 border-b"
        style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-warm)' }}
      >
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold"
        >
          <Bold size={14} />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic"
        >
          <Italic size={14} />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
          title="Inline code"
        >
          <Code size={14} />
        </ToolbarBtn>
        <div className="w-px h-4 bg-black/10 mx-1" />
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
          title="Code block"
        >
          <span className="text-xs font-mono font-bold">{'</>'}</span>
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="List"
        >
          <List size={14} />
        </ToolbarBtn>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}

function ToolbarBtn({ onClick, active, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors text-sm ${
        active ? 'bg-peach text-white' : 'hover:bg-black/5'
      }`}
      style={active ? { background: '#ffb899', color: 'white' } : {}}
    >
      {children}
    </button>
  )
}
