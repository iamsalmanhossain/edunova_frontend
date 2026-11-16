"use client";

import React, { useRef } from "react";
import {
  Columns,
  Code,
  Eye,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Table as TableIcon,
  Link2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import MarkdownViewer from "@/components/shared/MarkdownViewer";

interface AboutMarkdownEditorProps {
  content: string;
  onChangeContent: (val: string) => void;
  editorMode: "split" | "edit" | "preview";
  onChangeEditorMode: (mode: "split" | "edit" | "preview") => void;
}

export default function AboutMarkdownEditor({
  content,
  onChangeContent,
  editorMode,
  onChangeEditorMode,
}: AboutMarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Markdown Toolbar Helpers
  const insertFormatting = (prefix: string, suffix = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = `${prefix}${selectedText || "text"}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    onChangeContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selectedText.length || 4)
      );
    }, 0);
  };

  return (
    <Card className="border-[#e2e8e4] rounded-t-none -mt-5">
      <CardHeader className="pb-3 border-b bg-[#fafcfa]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-sm font-bold text-[#0f1f17]">
              Live Markdown Documentation Editor
            </CardTitle>
            <CardDescription className="text-xs">
              Write formatted text with headers, tables, code blocks, lists, and callout alerts.
            </CardDescription>
          </div>

          {/* Editor Mode Switcher */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-200 shrink-0">
            <button
              type="button"
              onClick={() => onChangeEditorMode("split")}
              className={`px-2.5 py-1 text-xs font-medium rounded flex items-center gap-1.5 transition-colors ${
                editorMode === "split"
                  ? "bg-[#0a4b32] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Columns className="w-3 h-3" />
              Split View
            </button>
            <button
              type="button"
              onClick={() => onChangeEditorMode("edit")}
              className={`px-2.5 py-1 text-xs font-medium rounded flex items-center gap-1.5 transition-colors ${
                editorMode === "edit"
                  ? "bg-[#0a4b32] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Code className="w-3 h-3" />
              Editor Only
            </button>
            <button
              type="button"
              onClick={() => onChangeEditorMode("preview")}
              className={`px-2.5 py-1 text-xs font-medium rounded flex items-center gap-1.5 transition-colors ${
                editorMode === "preview"
                  ? "bg-[#0a4b32] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Eye className="w-3 h-3" />
              Live Preview
            </button>
          </div>
        </div>

        {/* Formatting Toolbar */}
        <div className="flex items-center gap-1 pt-2 flex-wrap text-gray-700">
          <button
            type="button"
            onClick={() => insertFormatting("**", "**")}
            title="Bold"
            className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("*", "*")}
            title="Italic"
            className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <span className="w-px h-4 bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={() => insertFormatting("# ")}
            title="Heading 1"
            className="p-1.5 hover:bg-gray-200 rounded text-gray-700 font-bold text-xs"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("## ")}
            title="Heading 2"
            className="p-1.5 hover:bg-gray-200 rounded text-gray-700 font-bold text-xs"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("### ")}
            title="Heading 3"
            className="p-1.5 hover:bg-gray-200 rounded text-gray-700 font-bold text-xs"
          >
            H3
          </button>
          <span className="w-px h-4 bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={() => insertFormatting("- ")}
            title="Bullet List"
            className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("1. ")}
            title="Numbered List"
            className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("> ")}
            title="Blockquote"
            className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("```\n", "\n```")}
            title="Code Block"
            className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("[link title](", ")")}
            title="Link"
            className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
          >
            <Link2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("\n| Feature | Status |\n|---|---|\n| Item 1 | Active |\n")}
            title="Table"
            className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
          >
            <TableIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div
          className={`grid ${
            editorMode === "split"
              ? "grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200"
              : "grid-cols-1"
          }`}
        >
          {/* Editor Column */}
          {(editorMode === "split" || editorMode === "edit") && (
            <div className="p-4">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => onChangeContent(e.target.value)}
                placeholder="Write your markdown content or drop a README.md file here..."
                rows={20}
                className="w-full h-[540px] p-3 text-xs sm:text-sm font-mono text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0a4b32]/40 resize-none leading-relaxed"
              />
            </div>
          )}

          {/* Preview Column */}
          {(editorMode === "split" || editorMode === "preview") && (
            <div className="p-5 h-[572px] overflow-y-auto bg-[#fafdfa]">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                <span>Real-time Preview</span>
                <span className="text-[10px] text-[#0a4b32] lowercase bg-[#eef5f1] px-2 py-0.5 rounded">
                  {content.length} characters
                </span>
              </div>
              {content.trim() ? (
                <MarkdownViewer content={content} />
              ) : (
                <div className="text-center py-20 text-gray-400 text-xs">
                  <Eye className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                  <p>Nothing to preview yet. Start typing or drop a README file.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
