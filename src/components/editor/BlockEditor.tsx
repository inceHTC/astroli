"use client";

import { useState } from "react";
import type { Block } from "@/types/block";
import { BLOCK_TYPES } from "@/types/block";

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-gray-400";

function createBlock(type: Block["type"]): Block {
  switch (type) {
    case "paragraph":
      return { type: "paragraph", text: "" };
    case "heading":
      return { type: "heading", level: 2, text: "" };
    case "bulletList":
      return { type: "bulletList", items: [""] };
    case "orderedList":
      return { type: "orderedList", items: [""] };
    case "image":
      return { type: "image", src: "", caption: "" };
    case "quote":
      return { type: "quote", text: "" };
    case "table":
      return { type: "table", headers: ["", ""], rows: [["", ""]] };
    case "divider":
      return { type: "divider" };
    default:
      return { type: "paragraph", text: "" };
  }
}

function BlockRow({
  block,
  index,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  total,
}: {
  block: Block;
  index: number;
  onChange: (b: Block) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  total: number;
}) {
  return (
    <div className="flex gap-2 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
      <div className="flex shrink-0 flex-col gap-0.5">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={index === 0}
          className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 disabled:opacity-30"
          aria-label="Yukarı"
        >
          ▲
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={index >= total - 1}
          className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 disabled:opacity-30"
          aria-label="Aşağı"
        >
          ▼
        </button>
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        {block.type === "paragraph" && (
          <>
            <span className="text-xs font-medium text-gray-500">Paragraf</span>
            <textarea
              value={block.text}
              onChange={(e) => onChange({ ...block, text: e.target.value })}
              rows={3}
              className={inputClass}
              placeholder="Metin..."
            />
          </>
        )}
        {block.type === "heading" && (
          <>
            <span className="text-xs font-medium text-gray-500">Başlık</span>
            <div className="flex gap-2">
              <select
                value={block.level}
                onChange={(e) =>
                  onChange({
                    ...block,
                    level: Number(e.target.value) as 2 | 3,
                  })
                }
                className={`${inputClass} w-24`}
              >
                <option value={2}>H2</option>
                <option value={3}>H3</option>
              </select>
              <input
                type="text"
                value={block.text}
                onChange={(e) => onChange({ ...block, text: e.target.value })}
                className={inputClass}
                placeholder="Başlık metni"
              />
            </div>
          </>
        )}
        {block.type === "bulletList" && (
          <>
            <span className="text-xs font-medium text-gray-500">Madde listesi</span>
            <ListItemsEditor
              items={block.items}
              onChange={(items) => onChange({ ...block, items })}
            />
          </>
        )}
        {block.type === "orderedList" && (
          <>
            <span className="text-xs font-medium text-gray-500">Numaralı liste</span>
            <ListItemsEditor
              items={block.items}
              onChange={(items) => onChange({ ...block, items })}
            />
          </>
        )}
        {block.type === "image" && (
          <>
            <span className="text-xs font-medium text-gray-500">Görsel</span>
            <input
              type="text"
              value={block.src}
              onChange={(e) => onChange({ ...block, src: e.target.value })}
              className={inputClass}
              placeholder="Görsel URL"
            />
            <input
              type="text"
              value={block.caption ?? ""}
              onChange={(e) =>
                onChange({ ...block, caption: e.target.value || undefined })
              }
              className={inputClass}
              placeholder="Altyazı (isteğe bağlı)"
            />
          </>
        )}
        {block.type === "quote" && (
          <>
            <span className="text-xs font-medium text-gray-500">Alıntı</span>
            <textarea
              value={block.text}
              onChange={(e) => onChange({ ...block, text: e.target.value })}
              rows={2}
              className={inputClass}
              placeholder="Alıntı metni..."
            />
          </>
        )}
        {block.type === "table" && (
          <>
            <span className="text-xs font-medium text-gray-500">Tablo</span>
            <TableBlockEditor block={block} onChange={onChange} />
          </>
        )}
        {block.type === "divider" && (
          <span className="text-xs font-medium text-gray-500">Ayırıcı çizgi</span>
        )}
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 rounded p-2 text-red-600 hover:bg-red-50"
        aria-label="Blok sil"
      >
        Sil
      </button>
    </div>
  );
}

function ListItemsEditor({
  items,
  onChange,
}: {
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const update = (i: number, v: string) => {
    const next = [...items];
    next[i] = v;
    onChange(next);
  };
  const add = () => onChange([...items, ""]);
  const remove = (i: number) =>
    onChange(items.filter((_, j) => j !== i));

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => update(i, e.target.value)}
            className={inputClass}
            placeholder={`Madde ${i + 1}`}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="shrink-0 rounded px-2 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="text-sm text-gray-600 hover:underline"
      >
        + Madde ekle
      </button>
    </div>
  );
}

function TableBlockEditor({
  block,
  onChange,
}: {
  block: { type: "table"; headers: string[]; rows: string[][] };
  onChange: (b: Block) => void;
}) {
  const { headers, rows } = block;

  const setHeader = (i: number, v: string) => {
    const h = [...headers];
    h[i] = v;
    onChange({ ...block, headers: h });
  };
  const setCell = (ri: number, ci: number, v: string) => {
    const r = rows.map((row) => [...row]);
    if (!r[ri]) r[ri] = headers.map(() => "");
    r[ri][ci] = v;
    onChange({ ...block, rows: r });
  };
  const addCol = () => {
    onChange({
      ...block,
      headers: [...headers, ""],
      rows: rows.map((row) => [...row, ""]),
    });
  };
  const removeCol = (ci: number) => {
    if (headers.length <= 1) return;
    onChange({
      ...block,
      headers: headers.filter((_, i) => i !== ci),
      rows: rows.map((row) => row.filter((_, i) => i !== ci)),
    });
  };
  const addRow = () => {
    onChange({
      ...block,
      rows: [...rows, headers.map(() => "")],
    });
  };
  const removeRow = (ri: number) => {
    if (rows.length <= 1) return;
    onChange({ ...block, rows: rows.filter((_, i) => i !== ri) });
  };

  return (
    <div className="space-y-3">
      <div className="text-xs text-gray-500">Başlıklar</div>
      <div className="flex flex-wrap gap-2">
        {headers.map((h, i) => (
          <div key={i} className="flex gap-1">
            <input
              type="text"
              value={h}
              onChange={(e) => setHeader(i, e.target.value)}
              className={`${inputClass} w-28`}
              placeholder={`Kolon ${i + 1}`}
            />
            <button
              type="button"
              onClick={() => removeCol(i)}
              className="shrink-0 rounded px-1 text-gray-400 hover:bg-gray-200"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addCol}
          className="rounded border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-500 hover:bg-gray-100"
        >
          + Kolon
        </button>
      </div>
      <div className="text-xs text-gray-500">Satırlar</div>
      {rows.map((row, ri) => (
        <div key={ri} className="flex flex-wrap items-center gap-2">
          {headers.map((_, ci) => (
            <input
              key={ci}
              type="text"
              value={row[ci] ?? ""}
              onChange={(e) => setCell(ri, ci, e.target.value)}
              className={`${inputClass} w-28`}
            />
          ))}
          <button
            type="button"
            onClick={() => removeRow(ri)}
            className="rounded px-2 text-gray-400 hover:bg-gray-200"
          >
            Satır sil
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addRow}
        className="text-sm text-gray-600 hover:underline"
      >
        + Satır ekle
      </button>
    </div>
  );
}

export function BlockEditor({
  blocks,
  onChange,
}: {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}) {
  const [newBlockType, setNewBlockType] = useState<Block["type"]>("paragraph");

  const updateBlock = (index: number, block: Block) => {
    const next = [...blocks];
    next[index] = block;
    onChange(next);
  };

  const addBlock = () => {
    onChange([...blocks, createBlock(newBlockType)]);
  };

  const removeBlock = (index: number) => {
    onChange(blocks.filter((_, i) => i !== index));
  };

  const move = (index: number, dir: -1 | 1) => {
    const to = index + dir;
    if (to < 0 || to >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[to]] = [next[to], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={newBlockType}
          onChange={(e) =>
            setNewBlockType(e.target.value as Block["type"])
          }
          className={inputClass}
          style={{ width: "auto", minWidth: 160 }}
        >
          {BLOCK_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={addBlock}
          className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          + Blok ekle
        </button>
      </div>

      <div className="space-y-3">
        {blocks.length === 0 && (
          <p className="rounded-lg border border-dashed border-gray-300 bg-gray-50/50 py-8 text-center text-sm text-gray-500">
            Henüz blok yok. Yukarıdan blok ekleyin.
          </p>
        )}
        {blocks.map((block, index) => (
          <BlockRow
            key={index}
            block={block}
            index={index}
            total={blocks.length}
            onChange={(b) => updateBlock(index, b)}
            onRemove={() => removeBlock(index)}
            onMoveUp={() => move(index, -1)}
            onMoveDown={() => move(index, 1)}
          />
        ))}
      </div>
    </div>
  );
}
