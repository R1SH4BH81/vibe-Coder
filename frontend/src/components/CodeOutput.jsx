import { useState } from "react";
import { Copy, Download, Code } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import toast from "react-hot-toast";
import styles from "./CodeOutput.module.css";

const CodeOutput = ({ code, language, prompt, darkMode }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy code");
    }
  };

  const downloadCode = () => {
    const fileExtensions = {
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

    const extension = fileExtensions[language] || "txt";
    const filename = `generated-code.${extension}`;

    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`Code downloaded as ${filename}`);
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
          {language} • {code.split("\n").length} lines
        </div>

        <div className={styles.outputActions}>
          <button
            onClick={copyToClipboard}
            className={styles.actionButton}
            title="Copy to clipboard"
          >
            <Copy size={16} />
          </button>

          <button
            onClick={downloadCode}
            className={styles.actionButton}
            title="Download code"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      <div className={styles.codeContainer}>
        <SyntaxHighlighter
          language={language}
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
          {code}
        </SyntaxHighlighter>

        {copied && <div className={styles.copySuccess}>✓ Copied!</div>}
      </div>
    </div>
  );
};

export default CodeOutput;
