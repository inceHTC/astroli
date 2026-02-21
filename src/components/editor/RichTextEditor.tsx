"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";
import TextAlign from "@tiptap/extension-text-align";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";

const PLACEHOLDER = "İçeriği buraya yapıştırabilir veya yazabilirsiniz. AI’dan kopyaladığınızda biçim korunur.";

function cleanWordHtml(html: string): string {
  return html
    .replace(/\s*class="[^"]*Mso[^"]*"/gi, "")
    .replace(/\s*class="[^"]*"/g, "")
    .replace(/<o:p>\s*<\/o:p>/gi, "")
    .replace(/<span[^>]*>\s*<\/span>/gi, "")
    .replace(/\s*style="[^"]*"/gi, (m) => (m.includes("mso-") ? "" : m))
    .replace(/<\/?xml[^>]*>/gi, "")
    .replace(/<\/?meta[^>]*>/gi, "")
    .replace(/<\/?w:[^>]*>/gi, "")
    .trim();
}

export function RichTextEditor({
  content,
  onChange,
  editable = true,
  placeholder = PLACEHOLDER,
}: {
  content: string;
  onChange?: (html: string) => void;
  editable?: boolean;
  placeholder?: string;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    editable,
    content: content || "",
    extensions: [
      StarterKit.configure({
        codeBlock: { HTMLAttributes: { class: "editor-code-block" } },
        heading: { levels: [1, 2, 3, 4] },
        horizontalRule: false,
        link: false,
        underline: false,
      }),
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" } }),
      Image.configure({ inline: false, allowBase64: true }),
      TableKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      HorizontalRule,
      Placeholder.configure({ placeholder }),
      Typography,
    ],
    editorProps: {
      transformPastedHTML(html) {
        if (/class="[^"]*Mso|<\/?w:|<\/?o:/i.test(html)) return cleanWordHtml(html);
        return html;
      },
      transformPastedText(text) {
        return text;
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="rich-text-editor rounded-xl border border-gray-200 bg-white">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} className="editor-content px-4 py-4 min-h-[320px] prose prose-sm max-w-none" />
    </div>
  );
}

function EditorToolbar({ editor }: { editor: Editor }) {
  const button = (onClick: () => void, active?: boolean, label: string) => (
    <button
      type="button"
      onClick={onClick}
      className={`rounded p-2 text-sm font-medium transition ${active ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}
      title={label}
    >
      {label}
    </button>
  );

  const setLink = () => {
    const url = window.prompt("Link URL:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("Görsel URL:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="editor-toolbar sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50/80 px-3 py-2 backdrop-blur-sm">
      {button(() => editor.chain().focus().toggleBold().run(), editor.isActive("bold"), "Kalın")}
      {button(() => editor.chain().focus().toggleItalic().run(), editor.isActive("italic"), "İtalik")}
      {button(() => editor.chain().focus().toggleUnderline().run(), editor.isActive("underline"), "Altı çizili")}
      <span className="mx-1 h-5 w-px bg-gray-300" />
      {button(() => editor.chain().focus().toggleHeading({ level: 1 }).run(), editor.isActive("heading", { level: 1 }), "H1")}
      {button(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive("heading", { level: 2 }), "H2")}
      {button(() => editor.chain().focus().toggleHeading({ level: 3 }).run(), editor.isActive("heading", { level: 3 }), "H3")}
      <span className="mx-1 h-5 w-px bg-gray-300" />
      {button(() => editor.chain().focus().toggleBulletList().run(), editor.isActive("bulletList"), "Liste")}
      {button(() => editor.chain().focus().toggleOrderedList().run(), editor.isActive("orderedList"), "Numara")}
      {button(() => editor.chain().focus().toggleBlockquote().run(), editor.isActive("blockquote"), "Alıntı")}
      {button(() => editor.chain().focus().toggleCodeBlock().run(), editor.isActive("codeBlock"), "Kod")}
      {button(() => editor.chain().focus().setHorizontalRule().run(), false, "Çizgi")}
      <span className="mx-1 h-5 w-px bg-gray-300" />
      {button(setLink, editor.isActive("link"), "Link")}
      {button(addImage, false, "Görsel")}
      {button(() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(), false, "Tablo")}
      <span className="mx-1 h-5 w-px bg-gray-300" />
      {button(() => editor.chain().focus().setTextAlign("left").run(), editor.isActive({ textAlign: "left" }), "Sol")}
      {button(() => editor.chain().focus().setTextAlign("center").run(), editor.isActive({ textAlign: "center" }), "Orta")}
      {button(() => editor.chain().focus().setTextAlign("right").run(), editor.isActive({ textAlign: "right" }), "Sağ")}
    </div>
  );
}

export function getEditorHtml(editor: Editor | null): string {
  return editor?.getHTML() ?? "";
}
