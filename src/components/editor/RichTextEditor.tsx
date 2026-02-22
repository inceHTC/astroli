"use client";

import { useRef } from "react";
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

/** Yapıştırılan HTML'deki merdiven/girinti stillerini kaldırır. */
function normalizePastedHtml(html: string): string {
  return html.replace(/\s*style="([^"]*)"/gi, (_, styleValue) => {
    const cleaned = styleValue
      .split(";")
      .map((s: string) => s.trim())
      .filter((s: string) => {
        if (!s) return false;
        const prop = s.split(":")[0]?.trim().toLowerCase() ?? "";
        if (/^margin|^padding|^text-indent/.test(prop)) return false;
        return true;
      })
      .join("; ");
    return cleaned ? ` style="${cleaned}"` : "";
  });
}

/** Yapıştırılan düz metni satır bazında düzenler; merdiven etkisini önler. */
function normalizePastedText(text: string): string {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
}

/** Satır başındaki madde işareti veya numarayı kaldırıp metni döndürür. */
const LIST_LINE_REGEX = /^\s*([•\-*·▪◦‣]|\d+\.)\s*(.*)$/;

function isListLikeLine(line: string): boolean {
  return LIST_LINE_REGEX.test(line.trim());
}

function parseListLine(line: string): string {
  const m = line.trim().match(LIST_LINE_REGEX);
  return m ? m[2].trim() : line.trim();
}

/** Düz metin listesini HTML <ul><li>...</li></ul> yapısına çevirir. */
function plainTextToListHtml(text: string): string {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const listItems: string[] = [];
  for (const line of lines) {
    if (isListLikeLine(line)) listItems.push(parseListLine(line));
    else if (listItems.length > 0) break;
  }
  if (listItems.length < 2) return "";
  const lis = listItems.map((t) => `<li>${escapeHtml(t)}</li>`).join("");
  return `<ul>${lis}</ul>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** HTML'deki paragraf/div madde satırlarını gerçek <ul><li> listesine çevirir. */
function convertListLikeBlocksToLists(html: string): string {
  let out = html;
  // Blok etiketleri (p, div, li içinde sadece metin) – madde işareti veya numara ile başlayan
  const bulletRe = /<(p|div)(?:\s[^>]*)?>[\s\u00A0]*[•\-*·▪◦‣]\s*([\s\S]*?)<\/\1>/gi;
  const numberRe = /<(p|div)(?:\s[^>]*)?>[\s\u00A0]*\d+\.\s*([\s\S]*?)<\/\1>/gi;
  out = out.replace(bulletRe, "<li>$2</li>");
  out = out.replace(numberRe, "<li>$2</li>");
  // Mevcut <li>...</li> içindeki baştaki madde karakterini temizle
  out = out.replace(/<li>[\s\u00A0]*[•\-*·▪◦‣]\s*/gi, "<li>");
  // Ardışık <li> bloklarını tek <ul> içinde topla (zaten <ul> içinde olanlara dokunma)
  out = out.replace(/(<li>[\s\S]*?<\/li>\s*)+/gi, (match: string, offset: number, whole: string) => {
    const before = whole.substring(0, offset);
    const openUl = (before.match(/<ul\b/gi) || []).length;
    const closeUl = (before.match(/<\/ul>/gi) || []).length;
    if (openUl > closeUl) return match;
    return `<ul>${match.trim()}</ul>`;
  });
  return out;
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
  const editorRef = useRef<Editor | null>(null);

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
    onCreate: ({ editor }) => {
      editorRef.current = editor;
    },
    onDestroy: () => {
      editorRef.current = null;
    },
    editorProps: {
      handlePaste(view, event) {
        const ed = editorRef.current;
        if (!ed || !event.clipboardData) return false;
        const html = event.clipboardData.getData("text/html");
        const text = event.clipboardData.getData("text/plain");
        let listHtml = "";
        if (html && html.trim()) {
          let out = html;
          if (/class="[^"]*Mso|<\/?w:|<\/?o:/i.test(out)) out = cleanWordHtml(out);
          out = normalizePastedHtml(out);
          out = convertListLikeBlocksToLists(out);
          if (/<ul[\s>]/.test(out) && /<li[\s>]/.test(out)) listHtml = out;
        }
        if (!listHtml && text && text.trim()) {
          const lines = text.split(/\r?\n/).filter((l) => l.trim());
          const listLikeCount = lines.filter((l) => isListLikeLine(l)).length;
          if (listLikeCount >= 2) listHtml = plainTextToListHtml(text);
        }
        if (listHtml) {
          event.preventDefault();
          ed.chain().focus().insertContent(listHtml).run();
          return true;
        }
        return false;
      },
      transformPastedHTML(html) {
        let out = html;
        if (/class="[^"]*Mso|<\/?w:|<\/?o:/i.test(out)) out = cleanWordHtml(out);
        out = normalizePastedHtml(out);
        out = convertListLikeBlocksToLists(out);
        return out;
      },
      transformPastedText(text) {
        return normalizePastedText(text);
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="rich-text-editor flex max-h-[78vh] flex-col rounded-xl border border-gray-200 bg-white overflow-hidden">
      <EditorToolbar editor={editor} />
      <div className="flex-1 min-h-0 overflow-y-auto">
        <EditorContent editor={editor} className="editor-content px-4 py-4 min-h-[320px] prose prose-sm max-w-none" />
      </div>
    </div>
  );
}

function EditorToolbar({ editor }: { editor: Editor }) {
  const button = (onClick: () => void, label: string, active?: boolean) => (
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
    <div className="editor-toolbar flex-shrink-0 flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50/80 px-3 py-2">
      {button(() => editor.chain().focus().toggleBold().run(), "Kalın", editor.isActive("bold"))}
      {button(() => editor.chain().focus().toggleItalic().run(), "İtalik", editor.isActive("italic"))}
      {button(() => editor.chain().focus().toggleUnderline().run(), "Altı çizili", editor.isActive("underline"))}
      <span className="mx-1 h-5 w-px bg-gray-300" />
      {button(() => editor.chain().focus().toggleHeading({ level: 1 }).run(), "H1", editor.isActive("heading", { level: 1 }))}
      {button(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), "H2", editor.isActive("heading", { level: 2 }))}
      {button(() => editor.chain().focus().toggleHeading({ level: 3 }).run(), "H3", editor.isActive("heading", { level: 3 }))}
      <span className="mx-1 h-5 w-px bg-gray-300" />
      {button(() => editor.chain().focus().toggleBulletList().run(), "Liste", editor.isActive("bulletList"))}
      {button(() => editor.chain().focus().toggleOrderedList().run(), "Numara", editor.isActive("orderedList"))}
      {button(() => editor.chain().focus().toggleBlockquote().run(), "Alıntı", editor.isActive("blockquote"))}
      {button(() => editor.chain().focus().toggleCodeBlock().run(), "Kod", editor.isActive("codeBlock"))}
      {button(() => editor.chain().focus().setHorizontalRule().run(), "Çizgi", false)}
      <span className="mx-1 h-5 w-px bg-gray-300" />
      {button(setLink, "Link", editor.isActive("link"))}
      {button(addImage, "Görsel", false)}
      {button(() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(), "Tablo", false)}
      <span className="mx-1 h-5 w-px bg-gray-300" />
      {button(() => editor.chain().focus().setTextAlign("left").run(), "Sol", editor.isActive({ textAlign: "left" }))}
      {button(() => editor.chain().focus().setTextAlign("center").run(), "Orta", editor.isActive({ textAlign: "center" }))}
      {button(() => editor.chain().focus().setTextAlign("right").run(), "Sağ", editor.isActive({ textAlign: "right" }))}
    </div>
  );
}

export function getEditorHtml(editor: Editor | null): string {
  return editor?.getHTML() ?? "";
}
