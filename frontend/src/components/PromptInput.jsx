import { useState } from "react";
import { Send } from "lucide-react";
import styles from "./PromptInput.module.css";

const PromptInput = ({
  prompt,
  setPrompt,
  selectedLanguage,
  setSelectedLanguage,
  languages,
  onGenerate,
  isLoading,
  darkMode,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onGenerate();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        className={`${styles.inputContainer} ${darkMode ? styles.dark : ""}`}
      >
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the code you want to generate... (e.g., 'Create a React component for a user profile card' or 'Write a Python function to validate email addresses')"
          className={styles.textarea}
          disabled={isLoading}
        />

        <div className={styles.inputFooter}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              style={{
                background: darkMode ? "#1a1a1d" : "#f9fafb",
                border: `1px solid ${darkMode ? "#3e3e42" : "#d1d5db"}`,
                borderRadius: "6px",
                padding: "4px 8px",
                fontSize: "13px",
                color: darkMode ? "#ececec" : "#374151",
              }}
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.icon} {lang.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className={styles.submitButton}
          >
            <Send size={16} />
            {isLoading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PromptInput;
