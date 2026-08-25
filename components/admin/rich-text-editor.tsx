"use client";

import React, { useEffect, useRef, useCallback } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Bold,
  Italic,
  Underline,
  Highlighter,
  Type,
  AlignLeft,
  List,
  Minus,
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
};

const TOOLBAR_ACTIONS: ToolbarAction[] = [
  { cmd: "bold", icon: Bold, title: "Negrito (Ctrl+B)" },
  { cmd: "italic", icon: Italic, title: "Itálico (Ctrl+I)" },
  { cmd: "underline", icon: Underline, title: "Sublinhado (Ctrl+U)" },
  { cmd: "hiliteColor", value: "#FFFE9E", icon: Highlighter, title: "Grifar" },
];

const BLOCK_ACTIONS: ToolbarAction[] = [
  { cmd: "formatBlock", value: "h2", icon: Type, title: "Título (H2)" },
  { cmd: "formatBlock", value: "p", icon: AlignLeft, title: "Parágrafo" },
  { cmd: "insertUnorderedList", icon: List, title: "Lista" },
  { cmd: "insertHorizontalRule", icon: Minus, title: "Separador" },
];

/** Remove tags perigosas mas mantém formatação */
function sanitize(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "");
}

export function RichTextEditor({
  name,
  defaultValue,
  placeholder = "Descreva os detalhes do imóvel...",
  minHeight = "160px",
}: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLInputElement>(null);

  // Inicializa o conteúdo
  useEffect(() => {
    if (editorRef.current && defaultValue) {
      editorRef.current.innerHTML = defaultValue;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const syncHidden = useCallback(() => {
    if (editorRef.current && hiddenRef.current) {
      hiddenRef.current.value = sanitize(editorRef.current.innerHTML);
    }
  }, []);

  const exec = useCallback(
    (cmd: string, value?: string) => {
      editorRef.current?.focus();
      document.execCommand(cmd, false, value);
      syncHidden();
    },
    [syncHidden]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      // Prioriza texto HTML (preserva formatação do Word/Google Docs)
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

  return (
    <div className="overflow-hidden rounded-md border border-gray-300 focus-within:border-kenesis-green focus-within:ring-1 focus-within:ring-kenesis-green">
      {/* Hidden input that submits with the form */}
      <input ref={hiddenRef} type="hidden" name={name} defaultValue={defaultValue || ""} />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
        {TOOLBAR_ACTIONS.map(({ cmd, value, icon: Icon, title }) => (
          <button
            key={cmd + (value || "")}
            type="button"
            title={title}
            onMouseDown={(e) => {
              e.preventDefault();
              exec(cmd, value as string | undefined);
            }}
            className="flex h-7 w-7 items-center justify-center rounded text-gray-600 transition-colors hover:bg-kenesis-cream hover:text-kenesis-green"
          >
            <Icon size={14} />
          </button>
        ))}

        <div className="mx-1 h-5 w-px bg-gray-300" />

        {BLOCK_ACTIONS.map(({ cmd, value, icon: Icon, title }) => (
          <button
            key={cmd + (value || "")}
            type="button"
            title={title}
            onMouseDown={(e) => {
              e.preventDefault();
              exec(cmd, value as string | undefined);
            }}
            className="flex h-7 w-7 items-center justify-center rounded text-gray-600 transition-colors hover:bg-kenesis-cream hover:text-kenesis-green"
          >
            <Icon size={14} />
          </button>
        ))}
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={syncHidden}
        onPaste={handlePaste}
        data-placeholder={placeholder}
        style={{ minHeight }}
        className="prose prose-sm max-w-none p-3 text-sm text-gray-800 outline-none [&:empty]:before:text-gray-400 [&:empty]:before:content-[attr(data-placeholder)]"
      />
    </div>
  );
}
