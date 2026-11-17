"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  Info,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

export default function MarkdownViewer({
  content,
  className = "",
}: MarkdownViewerProps) {
  const renderedNodes = useMemo(() => {
    if (!content || typeof content !== "string") return null;

    const lines = content.replace(/\r\n/g, "\n").split("\n");
    const elements: React.ReactNode[] = [];
    let i = 0;

    const parseInline = (text: string): React.ReactNode[] => {
      // Tokenize inline markdown: links, code, bold, italics
      const parts: React.ReactNode[] = [];
      let remaining = text;
      let key = 0;

      while (remaining.length > 0) {
        // Link: [label](url)
        const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          const [full, label, url] = linkMatch;
          const isExternal = url.startsWith("http://") || url.startsWith("https://");
          parts.push(
            isExternal ? (
              <a
                key={key++}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:text-emerald-800 underline inline-flex items-center gap-0.5 font-medium transition-colors"
              >
                {label}
                <ExternalLink className="w-3 h-3 inline ml-0.5 opacity-70" />
              </a>
            ) : (
              <Link
                key={key++}
                href={url}
                className="text-emerald-700 hover:text-emerald-800 underline font-medium"
              >
                {label}
              </Link>
            )
          );
          remaining = remaining.slice(full.length);
          continue;
        }

        // Inline Code: `code`
        const codeMatch = remaining.match(/^`([^`]+)`/);
        if (codeMatch) {
          const [full, code] = codeMatch;
          parts.push(
            <code
              key={key++}
              className="px-1.5 py-0.5 text-[0.88em] bg-[#edf2ee] text-[#0a4b32] font-mono rounded border border-[#d6e2d9]"
            >
              {code}
            </code>
          );
          remaining = remaining.slice(full.length);
          continue;
        }

        // Bold: **text** or __text__
        const boldMatch = remaining.match(/^(\*\*|__)(.*?)\1/);
        if (boldMatch) {
          const [full, , boldText] = boldMatch;
          parts.push(
            <strong key={key++} className="font-bold text-gray-900">
              {parseInline(boldText)}
            </strong>
          );
          remaining = remaining.slice(full.length);
          continue;
        }

        // Italic: *text* or _text_
        const italicMatch = remaining.match(/^(\*|_)(.*?)\1/);
        if (italicMatch && !remaining.startsWith("**") && !remaining.startsWith("__")) {
          const [full, , italicText] = italicMatch;
          parts.push(
            <em key={key++} className="italic text-gray-800">
              {parseInline(italicText)}
            </em>
          );
          remaining = remaining.slice(full.length);
          continue;
        }

        // Plain text up to next special char
        const nextSpecial = remaining.search(/(\[|`|\*\*|__|\*|_)/);
        if (nextSpecial === -1) {
          parts.push(remaining);
          break;
        } else if (nextSpecial === 0) {
          // If special character was matched without closing, take 1 char
          parts.push(remaining[0]);
          remaining = remaining.slice(1);
        } else {
          parts.push(remaining.slice(0, nextSpecial));
          remaining = remaining.slice(nextSpecial);
        }
      }

      return parts;
    };

    while (i < lines.length) {
      const line = lines[i];

      // Fenced Code Block: ```lang
      if (line.trim().startsWith("```")) {
        const lang = line.trim().slice(3).trim();
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith("```")) {
          codeLines.push(lines[i]);
          i++;
        }
        i++; // skip closing ```
        const codeText = codeLines.join("\n");

        elements.push(
          <div
            key={`code-${i}`}
            className="my-5 rounded-xl overflow-hidden border border-[#d6e4da] bg-[#0b1a13] text-[#e0efe6] shadow-sm"
          >
            {lang && (
              <div className="flex items-center justify-between px-4 py-1.5 bg-[#07130e] text-[11px] font-mono text-[#82a492] border-b border-[#1b3126]">
                <span className="uppercase font-semibold tracking-wider">{lang}</span>
              </div>
            )}
            <pre className="p-4 text-xs sm:text-sm font-mono overflow-x-auto leading-relaxed">
              <code>{codeText}</code>
            </pre>
          </div>
        );
        continue;
      }

      // Markdown Table: | Header | Header |
      if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
          tableLines.push(lines[i].trim());
          i++;
        }

        if (tableLines.length >= 2) {
          const parseRow = (rowStr: string) =>
            rowStr
              .slice(1, -1)
              .split("|")
              .map((c) => c.trim());

          const headers = parseRow(tableLines[0]);
          // Check if row 1 is separator (e.g. |---|---|)
          const isSeparator = /^\|?(\s*:?-+:?\s*\|)+\s*$/.test(tableLines[1]);
          const dataRows = isSeparator
            ? tableLines.slice(2).map(parseRow)
            : tableLines.slice(1).map(parseRow);

          elements.push(
            <div
              key={`table-${i}`}
              className="my-5 overflow-x-auto rounded-xl border border-[#e2e8e4] shadow-sm"
            >
              <table className="w-full text-left text-xs sm:text-sm divide-y divide-[#e2e8e4]">
                <thead className="bg-[#f4f7f4] font-semibold text-[#0f1f17]">
                  <tr>
                    {headers.map((h, hIdx) => (
                      <th key={hIdx} className="py-2.5 px-4 font-bold">
                        {parseInline(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf2ee] bg-white">
                  {dataRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-[#fbfdfb] transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="py-2.5 px-4 text-[#47554f]">
                          {parseInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          continue;
        }
      }

      // Headings
      if (line.startsWith("# ")) {
        elements.push(
          <h1
            key={`h1-${i}`}
            className="text-2xl sm:text-3xl font-extrabold text-[#0f1f17] tracking-tight mt-8 mb-4 border-b border-[#e2e8e4] pb-2"
          >
            {parseInline(line.slice(2))}
          </h1>
        );
        i++;
        continue;
      }
      if (line.startsWith("## ")) {
        elements.push(
          <h2
            key={`h2-${i}`}
            className="text-xl sm:text-2xl font-bold text-[#0f1f17] tracking-tight mt-6 mb-3 flex items-center gap-2"
          >
            <span className="w-1.5 h-6 bg-[#0a4b32] rounded-full inline-block shrink-0" />
            <span>{parseInline(line.slice(3))}</span>
          </h2>
        );
        i++;
        continue;
      }
      if (line.startsWith("### ")) {
        elements.push(
          <h3
            key={`h3-${i}`}
            className="text-lg sm:text-xl font-bold text-[#1a382b] mt-5 mb-2"
          >
            {parseInline(line.slice(4))}
          </h3>
        );
        i++;
        continue;
      }
      if (line.startsWith("#### ")) {
        elements.push(
          <h4
            key={`h4-${i}`}
            className="text-base sm:text-lg font-semibold text-[#1a382b] mt-4 mb-2"
          >
            {parseInline(line.slice(5))}
          </h4>
        );
        i++;
        continue;
      }

      // Horizontal Rule
      if (/^(\*\*\*|---|___)$/.test(line.trim())) {
        elements.push(
          <hr key={`hr-${i}`} className="my-6 border-t border-[#e2e8e4]" />
        );
        i++;
        continue;
      }

      // Blockquote & Alerts
      if (line.startsWith(">")) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].startsWith(">")) {
          quoteLines.push(lines[i].replace(/^>\s?/, ""));
          i++;
        }
        const fullQuote = quoteLines.join("\n");
        const firstLine = quoteLines[0] || "";

        let alertType: "note" | "tip" | "important" | "warning" | null = null;
        let alertBody = fullQuote;

        if (firstLine.includes("[!NOTE]")) {
          alertType = "note";
          alertBody = quoteLines.slice(1).join("\n");
        } else if (firstLine.includes("[!TIP]")) {
          alertType = "tip";
          alertBody = quoteLines.slice(1).join("\n");
        } else if (firstLine.includes("[!IMPORTANT]")) {
          alertType = "important";
          alertBody = quoteLines.slice(1).join("\n");
        } else if (firstLine.includes("[!WARNING]") || firstLine.includes("[!CAUTION]")) {
          alertType = "warning";
          alertBody = quoteLines.slice(1).join("\n");
        }

        if (alertType) {
          const alertConfig = {
            note: {
              bg: "bg-blue-50/70",
              border: "border-blue-200",
              text: "text-blue-900",
              icon: <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />,
              title: "Note",
            },
            tip: {
              bg: "bg-emerald-50/70",
              border: "border-emerald-200",
              text: "text-emerald-900",
              icon: <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
              title: "Tip",
            },
            important: {
              bg: "bg-purple-50/70",
              border: "border-purple-200",
              text: "text-purple-900",
              icon: <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />,
              title: "Important",
            },
            warning: {
              bg: "bg-amber-50/70",
              border: "border-amber-200",
              text: "text-amber-900",
              icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
              title: "Warning",
            },
          }[alertType];

          elements.push(
            <div
              key={`alert-${i}`}
              className={`my-4 p-4 rounded-xl border ${alertConfig.border} ${alertConfig.bg} flex items-start gap-3`}
            >
              {alertConfig.icon}
              <div className="text-xs sm:text-sm">
                <p className={`font-bold mb-1 ${alertConfig.text}`}>{alertConfig.title}</p>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {parseInline(alertBody)}
                </div>
              </div>
            </div>
          );
        } else {
          elements.push(
            <blockquote
              key={`quote-${i}`}
              className="my-4 border-l-4 border-[#0a4b32] pl-4 py-1 italic text-gray-700 bg-[#f7faf7] rounded-r-lg"
            >
              <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {parseInline(fullQuote)}
              </div>
            </blockquote>
          );
        }
        continue;
      }

      // Unordered List: - or *
      if (/^(\s*)[-*]\s+/.test(line)) {
        const listItems: { indent: number; text: string }[] = [];
        while (i < lines.length && /^(\s*)[-*]\s+/.test(lines[i])) {
          const match = lines[i].match(/^(\s*)[-*]\s+(.*)$/);
          if (match) {
            listItems.push({
              indent: match[1].length,
              text: match[2],
            });
          }
          i++;
        }

        elements.push(
          <ul
            key={`ul-${i}`}
            className="my-3 space-y-1.5 list-disc list-inside text-xs sm:text-sm text-gray-700 leading-relaxed pl-1"
          >
            {listItems.map((item, idx) => (
              <li
                key={idx}
                style={{ marginLeft: `${item.indent * 0.75}rem` }}
                className="marker:text-[#0a4b32]"
              >
                <span>{parseInline(item.text)}</span>
              </li>
            ))}
          </ul>
        );
        continue;
      }

      // Ordered List: 1.
      if (/^(\s*)\d+\.\s+/.test(line)) {
        const listItems: string[] = [];
        while (i < lines.length && /^(\s*)\d+\.\s+/.test(lines[i])) {
          const match = lines[i].match(/^(\s*)\d+\.\s+(.*)$/);
          if (match) {
            listItems.push(match[2]);
          }
          i++;
        }

        elements.push(
          <ol
            key={`ol-${i}`}
            className="my-3 space-y-1.5 list-decimal list-inside text-xs sm:text-sm text-gray-700 leading-relaxed pl-1"
          >
            {listItems.map((item, idx) => (
              <li key={idx} className="marker:text-[#0a4b32] marker:font-semibold">
                <span>{parseInline(item)}</span>
              </li>
            ))}
          </ol>
        );
        continue;
      }

      // Paragraph
      if (line.trim().length > 0) {
        elements.push(
          <p
            key={`p-${i}`}
            className="text-xs sm:text-sm text-[#47554f] leading-relaxed my-2"
          >
            {parseInline(line)}
          </p>
        );
      }

      i++;
    }

    return elements;
  }, [content]);

  return <div className={`markdown-content space-y-2 ${className}`}>{renderedNodes}</div>;
}
