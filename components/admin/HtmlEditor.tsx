"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Code,
  Minus,
  RemoveFormatting,
  Eye,
  FileCode,
  PenTool,
  Sparkles,
} from "lucide-react";
import { cn } from "@/utils";

interface HtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export const HtmlEditor: React.FC<HtmlEditorProps> = ({
  value,
  onChange,
  placeholder = "Tuliskan detail promosi, syarat & ketentuan, dan informasi lengkap di sini...",
  className,
  minHeight = "220px",
}) => {
  const [activeTab, setActiveTab] = useState<"visual" | "html" | "preview">("visual");
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdatingRef = useRef(false);

  // Sync value into visual editor when value changes externally or when switching tabs
  useEffect(() => {
    if (activeTab === "visual" && editorRef.current) {
      if (!isUpdatingRef.current && editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value, activeTab]);

  const handleVisualInput = () => {
    if (!editorRef.current) return;
    isUpdatingRef.current = true;
    const html = editorRef.current.innerHTML;
    onChange(html);
    isUpdatingRef.current = false;
  };

  const executeCommand = (command: string, arg: string | undefined = undefined) => {
    if (activeTab !== "visual") return;
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    handleVisualInput();
  };

  const handleInsertLink = () => {
    const url = prompt("Masukkan URL Tautan:", "https://");
    if (url && url.trim() && url !== "https://") {
      executeCommand("createLink", url.trim());
    }
  };

  const handleInsertBlockquote = () => {
    executeCommand("formatBlock", "blockquote");
  };

  const handleInsertHeading = (tag: "h2" | "h3" | "p") => {
    executeCommand("formatBlock", tag);
  };

  const handleInsertPresetSnippet = (type: "terms" | "alert") => {
    if (type === "terms") {
      const snippet = `
<h4>Syarat & Ketentuan:</h4>
<ul>
  <li>Berlaku untuk seluruh pemegang kartu virtual Sakuin.</li>
  <li>Minimal transaksi sesuai dengan ketentuan yang tertera pada promosi.</li>
  <li>Reward atau cashback akan diproses otomatis ke akun pengguna.</li>
</ul>
      `.trim();
      if (activeTab === "visual" && editorRef.current) {
        editorRef.current.focus();
        document.execCommand("insertHTML", false, snippet);
        handleVisualInput();
      } else {
        onChange(value + "\n" + snippet);
      }
    } else if (type === "alert") {
      const snippet = `
<blockquote>Catatan Penting: Promo terbatas selama kuota harian masih tersedia.</blockquote>
      `.trim();
      if (activeTab === "visual" && editorRef.current) {
        editorRef.current.focus();
        document.execCommand("insertHTML", false, snippet);
        handleVisualInput();
      } else {
        onChange(value + "\n" + snippet);
      }
    }
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xs overflow-hidden flex flex-col transition-all focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500/20",
        className
      )}
    >
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b border-gray-100 dark:border-gray-800/80 bg-gray-50/70 dark:bg-gray-850/50">
        {/* Left: Tab Modes */}
        <div className="flex items-center gap-1 bg-gray-200/70 dark:bg-gray-800 p-0.5 rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("visual")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer",
              activeTab === "visual"
                ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-2xs"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            )}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Visual Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("html")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer",
              activeTab === "html"
                ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-2xs"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            )}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Kode HTML</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer",
              activeTab === "preview"
                ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-2xs"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            )}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Pratinjau</span>
          </button>
        </div>

        {/* Right: Quick Template Snippets */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-gray-400 hidden sm:inline text-[11px]">Templat cepat:</span>
          <button
            type="button"
            onClick={() => handleInsertPresetSnippet("terms")}
            className="px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-[11px] cursor-pointer transition-colors"
            title="Sisipkan format Syarat & Ketentuan standar"
          >
            + S&K
          </button>
          <button
            type="button"
            onClick={() => handleInsertPresetSnippet("alert")}
            className="px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-[11px] cursor-pointer transition-colors"
            title="Sisipkan catatan kutipan penting"
          >
            + Catatan
          </button>
        </div>
      </div>

      {/* Formatting Toolbar (Only active in Visual mode) */}
      {activeTab === "visual" && (
        <div className="flex flex-wrap items-center gap-0.5 px-2.5 py-1.5 border-b border-gray-100 dark:border-gray-800/60 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 overflow-x-auto no-scrollbar">
          {/* Headings */}
          <button
            type="button"
            onClick={() => handleInsertHeading("h2")}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            title="Judul Bagian (H2)"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleInsertHeading("h3")}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            title="Subjudul (H3)"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-4 bg-gray-200 dark:bg-gray-700 mx-1 shrink-0" />

          {/* Text Styling */}
          <button
            type="button"
            onClick={() => executeCommand("bold")}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            title="Tebal (Bold)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("italic")}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            title="Miring (Italic)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("underline")}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            title="Garis Bawah (Underline)"
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("strikeThrough")}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            title="Coret (Strikethrough)"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-4 bg-gray-200 dark:bg-gray-700 mx-1 shrink-0" />

          {/* Lists & Quotes */}
          <button
            type="button"
            onClick={() => executeCommand("insertUnorderedList")}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            title="Daftar Poin (Bullet List)"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("insertOrderedList")}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            title="Daftar Angka (Numbered List)"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleInsertBlockquote}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            title="Kutipan (Blockquote)"
          >
            <Quote className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-4 bg-gray-200 dark:bg-gray-700 mx-1 shrink-0" />

          {/* Links & Dividers */}
          <button
            type="button"
            onClick={handleInsertLink}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            title="Sisipkan Tautan (Link)"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("insertHorizontalRule")}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            title="Garis Pembatas (Divider)"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("removeFormat")}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-400 hover:text-red-500"
            title="Hapus Pemformatan"
          >
            <RemoveFormatting className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Editor Body */}
      <div className="p-3.5 flex-1 relative bg-white dark:bg-gray-900">
        {/* Mode 1: Visual WYSIWYG */}
        {activeTab === "visual" && (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleVisualInput}
            onBlur={handleVisualInput}
            style={{ minHeight }}
            data-placeholder={placeholder}
            className={cn(
              "w-full outline-none text-sm text-gray-800 dark:text-gray-100 leading-relaxed font-sans",
              "prose prose-sm dark:prose-invert max-w-none",
              "[&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-2 [&_h2]:mb-1",
              "[&_h3]:text-sm [&_h3]:font-bold [&_h3]:mt-2 [&_h3]:mb-1",
              "[&_h4]:text-xs [&_h4]:font-bold [&_h4]:mt-2 [&_h4]:mb-1",
              "[&_p]:mb-2",
              "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2",
              "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2",
              "[&_blockquote]:border-l-4 [&_blockquote]:border-brand-500 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:my-2 [&_blockquote]:text-gray-500 dark:[&_blockquote]:text-gray-400",
              "[&_a]:text-brand-600 [&_a]:underline",
              "empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none"
            )}
          />
        )}

        {/* Mode 2: HTML Source Code */}
        {activeTab === "html" && (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ minHeight }}
            placeholder="<p>Masukkan kode HTML di sini...</p>"
            className="w-full h-full font-mono text-xs text-gray-800 dark:text-gray-200 bg-gray-50/50 dark:bg-gray-850/50 rounded-xl p-3 border border-gray-100 dark:border-gray-800 outline-none resize-y leading-relaxed focus:ring-1 focus:ring-brand-500"
          />
        )}

        {/* Mode 3: Live Preview */}
        {activeTab === "preview" && (
          <div
            style={{ minHeight }}
            className="w-full text-sm text-gray-800 dark:text-gray-100 leading-relaxed rounded-xl p-3 bg-gray-50/40 dark:bg-gray-850/30 border border-dashed border-gray-200 dark:border-gray-800 overflow-y-auto"
          >
            {value && value.trim() ? (
              <div
                dangerouslySetInnerHTML={{ __html: value }}
                className={cn(
                  "prose prose-sm dark:prose-invert max-w-none",
                  "[&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-2 [&_h2]:mb-1",
                  "[&_h3]:text-sm [&_h3]:font-bold [&_h3]:mt-2 [&_h3]:mb-1",
                  "[&_h4]:text-xs [&_h4]:font-bold [&_h4]:mt-2 [&_h4]:mb-1",
                  "[&_p]:mb-2",
                  "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2",
                  "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2",
                  "[&_blockquote]:border-l-4 [&_blockquote]:border-brand-500 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:my-2 [&_blockquote]:text-gray-500 dark:[&_blockquote]:text-gray-400",
                  "[&_a]:text-brand-600 [&_a]:underline"
                )}
              />
            ) : (
              <div className="py-8 text-center text-xs text-gray-400 italic">
                Belum ada konten detail promosi untuk dipratinjau.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-3 py-1.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850/30 flex items-center justify-between text-[11px] text-gray-400">
        <span>Format: HTML Standar Sakuin</span>
        <span>{value ? `${value.length} karakter` : "Kosong"}</span>
      </div>
    </div>
  );
};

export default HtmlEditor;
