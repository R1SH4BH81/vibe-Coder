import { useState } from "react";
import { Copy, Download, Code, FileText, Palette, Zap } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import toast from "react-hot-toast";
import styles from "./CodeOutput.module.css";

const CodeOutput = ({ code, language, prompt, darkMode }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Parse multi-file code into separate files
  const parseMultiFileCode = (code) => {
    if (!code) return [];

    // Check for structured multi-file format
    const htmlMatch = code.match(
      /<!-- HTML -->[\s\S]*?([\s\S]*?)(?=\/\* CSS \*\/|$)/i,
    );
    const cssMatch = code.match(
      /\/\* CSS \*\/[\s\S]*?([\s\S]*?)(?=\/\/ JavaScript|$)/i,
    );
    const jsMatch = code.match(/\/\/ JavaScript[\s\S]*?([\s\S]*?)$/i);

    const files = [];

    if (htmlMatch && htmlMatch[1].trim()) {
      files.push({
        name: "index.html",
        language: "html",
        content: htmlMatch[1].trim(),
        icon: FileText,
      });
    }

    if (cssMatch && cssMatch[1].trim()) {
      files.push({
        name: "styles.css",
        language: "css",
        content: cssMatch[1].trim(),
        icon: Palette,
      });
    }

    if (jsMatch && jsMatch[1].trim()) {
      files.push({
        name: "script.js",
        language: "javascript",
        content: jsMatch[1].trim(),
        icon: Zap,
      });
    }

    // If no structured format found, try to detect if it's a complete HTML with embedded CSS/JS
    if (files.length === 0) {
      const hasHtmlTags = /<html|<div|<body|<!DOCTYPE/i.test(code);
      const hasStyleTags = /<style[\s\S]*?<\/style>/i.test(code);
      const hasScriptTags = /<script[\s\S]*?<\/script>/i.test(code);

      if (hasHtmlTags) {
        files.push({
          name: "index.html",
          language: "html",
          content: code,
          icon: FileText,
        });

        // Extract CSS from style tags
        if (hasStyleTags) {
          const styleMatch = code.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
          if (styleMatch && styleMatch[1].trim()) {
            files.push({
              name: "styles.css",
              language: "css",
              content: styleMatch[1].trim(),
              icon: Palette,
            });
          }
        }

        // Extract JavaScript from script tags
        if (hasScriptTags) {
          const scriptMatch = code.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
          if (scriptMatch && scriptMatch[1].trim()) {
            files.push({
              name: "script.js",
              language: "javascript",
              content: scriptMatch[1].trim(),
              icon: Zap,
            });
          }
        }
      } else {
        // Single file
        files.push({
          name: `code.${getFileExtension(language)}`,
          language: language,
          content: code,
          icon: Code,
        });
      }
    }

    return files;
  };

  const getFileExtension = (lang) => {
    const extensions = {
      javascript: "js",
      typescript: "ts",
      python: "py",
      java: "java",
      cpp: "cpp",
      csharp: "cs",
      go: "go",
      rust: "rs",
      php: "php",
      ruby: "rb",
      html: "html",
      css: "css",
      sql: "sql",
      bash: "sh",
      json: "json",
    };
    return extensions[lang] || "txt";
  };

  const files = parseMultiFileCode(code);
  const currentFile = files[activeTab] || files[0];

  const copyToClipboard = async () => {
    try {
      const contentToCopy = currentFile ? currentFile.content : code;
      await navigator.clipboard.writeText(contentToCopy);
      setCopied(true);
      toast.success(
        `${currentFile ? currentFile.name : "Code"} copied to clipboard!`,
      );
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy code");
    }
  };

  const downloadCode = () => {
    if (files.length > 1) {
      // Download all files for multi-file projects
      files.forEach((file, index) => {
        setTimeout(() => {
          const blob = new Blob([file.content], { type: "text/plain" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = file.name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, index * 100); // Small delay between downloads
      });
      toast.success(`Downloaded ${files.length} files`);
    } else if (currentFile) {
      // Download single file
      const blob = new Blob([currentFile.content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = currentFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${currentFile.name}`);
    }
  };

  if (!code) {
    return (
      <div
        className={`${styles.outputContainer} ${darkMode ? styles.dark : ""}`}
      >
        <div className={styles.emptyState}>
          <Code size={48} style={{ marginBottom: "16px", opacity: 0.5 }} />
          <h3 className={styles.emptyStateTitle}>
            Generated code will appear here
          </h3>
          <p className={styles.emptyStateDescription}>
            Enter a prompt and click generate to see your AI-generated code
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.outputContainer} ${darkMode ? styles.dark : ""}`}>
      <div className={styles.outputHeader}>
        <div className={styles.outputTitle}>
          <Code size={16} />
          {files.length > 1
            ? `${files.length} Files`
            : currentFile
            ? currentFile.name
            : "Generated Code"}{" "}
          • {(currentFile ? currentFile.content : code).split("\n").length}{" "}
          lines
        </div>

        <div className={styles.outputActions}>
          <button
            onClick={copyToClipboard}
            className={styles.actionButton}
            title={`Copy ${
              currentFile ? currentFile.name : "code"
            } to clipboard`}
          >
            <Copy size={16} />
          </button>

          <button
            onClick={downloadCode}
            className={styles.actionButton}
            title={
              files.length > 1
                ? "Download all files"
                : `Download ${currentFile ? currentFile.name : "code"}`
            }
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* File Tabs */}
      {files.length > 1 && (
        <div className={styles.fileTabs}>
          {files.map((file, index) => {
            const IconComponent = file.icon;
            return (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`${styles.fileTab} ${
                  index === activeTab ? styles.activeTab : ""
                }`}
              >
                <IconComponent size={14} />
                {file.name}
              </button>
            );
          })}
        </div>
      )}

      <div className={styles.codeContainer}>
        <SyntaxHighlighter
          language={currentFile ? currentFile.language : language}
          style={darkMode ? vscDarkPlus : vs}
          showLineNumbers={true}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            background: darkMode ? "#1a1a1d" : "#fafafa",
            fontSize: "14px",
            lineHeight: "1.5",
            padding: "16px",
          }}
          lineNumberStyle={{
            color: darkMode ? "#6b7280" : "#9ca3af",
            paddingRight: "12px",
            textAlign: "right",
            userSelect: "none",
            fontSize: "13px",
          }}
        >
          {currentFile ? currentFile.content : code}
        </SyntaxHighlighter>

        {copied && <div className={styles.copySuccess}>✓ Copied!</div>}
      </div>
    </div>
  );
};

export default CodeOutput;
