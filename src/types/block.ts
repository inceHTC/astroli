export type Block =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "bulletList"; items: string[] }
  | { type: "orderedList"; items: string[] }
  | { type: "image"; src: string; caption?: string }
  | { type: "quote"; text: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "divider" };

export const BLOCK_TYPES = [
  { value: "paragraph", label: "Paragraf" },
  { value: "heading", label: "Başlık" },
  { value: "bulletList", label: "Madde listesi" },
  { value: "orderedList", label: "Numaralı liste" },
  { value: "image", label: "Görsel" },
  { value: "quote", label: "Alıntı" },
  { value: "table", label: "Tablo" },
  { value: "divider", label: "Ayırıcı" },
] as const;
