import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Bold, Italic, List, ListOrdered, Heading2, Heading3, Quote, Link2, Image as ImageIcon, Code } from "lucide-react";
import { api } from "@/lib/api/client";
import { useRef } from "react";

export function Editor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } }),
    ],
    content: value || "<p></p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: "tiptap" },
    },
  });

  if (!editor) {
    return <div className="border-2 border-border p-4 text-sm text-muted-foreground">Loading editor…</div>;
  }

  const btn =
    "inline-flex h-9 w-9 items-center justify-center border-2 border-border hover:bg-accent disabled:opacity-40";
  const active = "bg-primary text-primary-foreground";

  const handleImage = async (file: File) => {
    const { url } = await api.uploadImage(file);
    editor.chain().focus().setImage({ src: url }).run();
  };

  const setLink = () => {
    const url = window.prompt("URL");
    if (!url) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="border-2 border-border bg-card">
      <div className="flex flex-wrap items-center gap-1 border-b-2 border-border p-2">
        <button type="button" className={`${btn} ${editor.isActive("bold") ? active : ""}`} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="h-4 w-4" />
        </button>
        <button type="button" className={`${btn} ${editor.isActive("italic") ? active : ""}`} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="h-4 w-4" />
        </button>
        <button type="button" className={`${btn} ${editor.isActive("heading", { level: 2 }) ? active : ""}`} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="h-4 w-4" />
        </button>
        <button type="button" className={`${btn} ${editor.isActive("heading", { level: 3 }) ? active : ""}`} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 className="h-4 w-4" />
        </button>
        <button type="button" className={`${btn} ${editor.isActive("bulletList") ? active : ""}`} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="h-4 w-4" />
        </button>
        <button type="button" className={`${btn} ${editor.isActive("orderedList") ? active : ""}`} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="h-4 w-4" />
        </button>
        <button type="button" className={`${btn} ${editor.isActive("blockquote") ? active : ""}`} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className="h-4 w-4" />
        </button>
        <button type="button" className={`${btn} ${editor.isActive("codeBlock") ? active : ""}`} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <Code className="h-4 w-4" />
        </button>
        <button type="button" className={btn} onClick={setLink}>
          <Link2 className="h-4 w-4" />
        </button>
        <button type="button" className={btn} onClick={() => fileRef.current?.click()}>
          <ImageIcon className="h-4 w-4" />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleImage(f);
            e.target.value = "";
          }}
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
