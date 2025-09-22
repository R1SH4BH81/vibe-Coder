import { useState } from "react";
import { Send } from "lucide-react";
import styles from "./PromptInput.module.css";

const PromptInput = ({
  prompt,
  setPrompt,
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
          placeholder="Describe the code you want to generate... The language will be automatically detected from your description. (e.g., 'Create a React component for a user profile card' or 'Write a Python function to validate email addresses')"
          className={styles.textarea}
          disabled={isLoading}
        />

        <div className={styles.inputFooter}>
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
