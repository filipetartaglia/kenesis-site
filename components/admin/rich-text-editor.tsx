"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Bold,
  Italic,
  Underline,
  Highlighter,
  Heading2,
  AlignLeft,
  List,
  Minus,
  Link2,
  RotateCcw,
  RotateCw,
} from "lucide-react";

type Props = {
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
  minHeight?: string;
};

type ToolbarAction = {
  cmd: string;
  value?: string;
  icon: LucideIcon;
  title: string;
  shortcut?: string;
};

const INLINE_ACTIONS: ToolbarAction[] = [
  { cmd: "bold",      icon: Bold,        title: "Negrito",     shortcut: "Ctrl+B" },
  { cmd: "italic",    icon: Italic,      title: "Itálico",     shortcut: "Ctrl+I" },
  { cmd: "underline", icon: Underline,   title: "Sublinhado",  shortcut: "Ctrl+U" },
  { cmd: "hiliteColor", value: "#FFF9C4", icon: Highlighter, title: "Destacar texto" },
];

const BLOCK_ACTIONS: ToolbarAction[] = [
  { cmd: "formatBlock", value: "h2", icon: Heading2,   title: "Título" },
  { cmd: "formatBlock", value: "p",  icon: AlignLeft,  title: "Parágrafo" },
  { cmd: "insertUnorderedList",       icon: List,       title: "Lista com marcadores" },
  { cmd: "insertHorizontalRule",      icon: Minus,      title: "Linha separadora" },
];

/** Remove tags perigosas mas mantém formatação */
function sanitize(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "");
}

/** CSS injetado dentro do editor para formatar os elementos */
const EDITOR_STYLES = `
  [contenteditable] h2 {
    font-size: 1.2rem;
    font-weight: 700;
    line-height: 1.3;
    color: #02231F;
    margin: 0.75rem 0 0.25rem;
  }
  [contenteditable] p {
    margin: 0.4rem 0;
    line-height: 1.7;
  }
  [contenteditable] ul {
    list-style: disc;
    padding-left: 1.4rem;
    margin: 0.4rem 0;
  }
  [contenteditable] li {
    margin: 0.15rem 0;
    line-height: 1.6;
  }
  [contenteditable] hr {
    border: none;
    border-top: 1px solid #d1d5db;
    margin: 0.75rem 0;
  }
  [contenteditable] mark {
    background: #FFF9C4;
    padding: 0 2px;
    border-radius: 2px;
  }
  [contenteditable]:empty::before {
    content: attr(data-placeholder);
    color: #9ca3af;
    pointer-events: none;
  }
`;

export function RichTextEditor({
  name,
  defaultValue,
  placeholder = "Descreva os detalhes do imóvel...",
  minHeight = "180px",
}: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLInputElement>(null);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  // Inicializa o conteúdo
  useEffect(() => {
    if (!editorRef.current) return;
    if (defaultValue) {
      editorRef.current.innerHTML = defaultValue;
    } else {
      // Padrão: parágrafo vazio para o cursor
      editorRef.current.innerHTML = "<p><br></p>";
    }
    syncHidden();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const syncHidden = useCallback(() => {
    if (!editorRef.current || !hiddenRef.current) return;
    const html = editorRef.current.innerHTML;
    // Não salva o parágrafo inicial vazio
    const isEmpty = html === "<p><br></p>" || html === "<br>" || html.trim() === "";
    hiddenRef.current.value = isEmpty ? "" : sanitize(html);
  }, []);

  const updateActiveFormats = useCallback(() => {
    const formats = new Set<string>();
    if (document.queryCommandState("bold"))      formats.add("bold");
    if (document.queryCommandState("italic"))    formats.add("italic");
    if (document.queryCommandState("underline")) formats.add("underline");
    const blockTag = document.queryCommandValue("formatBlock").toLowerCase();
    if (blockTag) formats.add(blockTag);
    setActiveFormats(formats);
  }, []);

  const exec = useCallback(
    (cmd: string, value?: string) => {
      editorRef.current?.focus();
      document.execCommand(cmd, false, value);
      syncHidden();
      updateActiveFormats();
    },
    [syncHidden, updateActiveFormats]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      const html = e.clipboardData.getData("text/html");
      const text = e.clipboardData.getData("text/plain");
      if (html) {
        document.execCommand("insertHTML", false, sanitize(html));
      } else {
        // Quebras de linha viram parágrafos
        const formatted = text
          .split(/\n\n+/)
          .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
          .join("");
        document.execCommand("insertHTML", false, formatted || text);
      }
      syncHidden();
    },
    [syncHidden]
  );

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    // Enter em um h2 → cria parágrafo
    if (e.key === "Enter" && !e.shiftKey) {
      const block = document.queryCommandValue("formatBlock").toLowerCase();
      if (block === "h2") {
        e.preventDefault();
        document.execCommand("formatBlock", false, "p");
        return;
      }
    }
  }, []);

  const isActive = (cmd: string, value?: string) => {
    if (value) return activeFormats.has(value.toLowerCase());
    return activeFormats.has(cmd);
  };

  return (
    <div className="overflow-hidden rounded-md border border-gray-300 focus-within:border-kenesis-green focus-within:ring-1 focus-within:ring-kenesis-green">
      <style dangerouslySetInnerHTML={{ __html: EDITOR_STYLES }} />
      <input ref={hiddenRef} type="hidden" name={name} defaultValue={defaultValue || ""} />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
        {/* Undo / Redo */}
        <button
          type="button"
          title="Desfazer (Ctrl+Z)"
          onMouseDown={(e) => { e.preventDefault(); exec("undo"); }}
          className="flex h-7 w-7 items-center justify-center rounded text-gray-500 transition-colors hover:bg-kenesis-cream hover:text-kenesis-green"
        >
          <RotateCcw size={13} />
        </button>
        <button
          type="button"
          title="Refazer (Ctrl+Y)"
          onMouseDown={(e) => { e.preventDefault(); exec("redo"); }}
          className="flex h-7 w-7 items-center justify-center rounded text-gray-500 transition-colors hover:bg-kenesis-cream hover:text-kenesis-green"
        >
          <RotateCw size={13} />
        </button>

        <div className="mx-1 h-5 w-px bg-gray-300" />

        {/* Inline formats */}
        {INLINE_ACTIONS.map(({ cmd, value, icon: Icon, title, shortcut }) => (
          <button
            key={cmd + (value || "")}
            type="button"
            title={shortcut ? `${title} (${shortcut})` : title}
            onMouseDown={(e) => { e.preventDefault(); exec(cmd, value); }}
            className={`flex h-7 w-7 items-center justify-center rounded transition-colors
              ${isActive(cmd, value)
                ? "bg-kenesis-green text-white"
                : "text-gray-600 hover:bg-kenesis-cream hover:text-kenesis-green"}`}
          >
            <Icon size={14} />
          </button>
        ))}

        <div className="mx-1 h-5 w-px bg-gray-300" />

        {/* Block formats */}
        {BLOCK_ACTIONS.map(({ cmd, value, icon: Icon, title }) => (
          <button
            key={cmd + (value || "")}
            type="button"
            title={title}
            onMouseDown={(e) => { e.preventDefault(); exec(cmd, value); }}
            className={`flex h-7 w-7 items-center justify-center rounded transition-colors
              ${isActive(cmd, value)
                ? "bg-kenesis-green text-white"
                : "text-gray-600 hover:bg-kenesis-cream hover:text-kenesis-green"}`}
          >
            <Icon size={14} />
          </button>
        ))}

        <div className="mx-1 h-5 w-px bg-gray-300" />

        {/* Link */}
        <button
          type="button"
          title="Inserir link"
          onMouseDown={(e) => {
            e.preventDefault();
            const url = window.prompt("URL do link:");
            if (url) exec("createLink", url);
          }}
          className="flex h-7 w-7 items-center justify-center rounded text-gray-600 transition-colors hover:bg-kenesis-cream hover:text-kenesis-green"
        >
          <Link2 size={14} />
        </button>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={syncHidden}
        onKeyUp={updateActiveFormats}
        onMouseUp={updateActiveFormats}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
        style={{ minHeight }}
        className="p-3 text-sm text-gray-800 outline-none"
      />

      {/* Hint */}
      <div className="border-t border-gray-100 bg-gray-50 px-3 py-1.5 text-[10px] text-gray-400">
        Dica: Cole texto do Word ou Google Docs para preservar formatação. Enter após título cria parágrafo automaticamente.
      </div>
    </div>
  );
}
