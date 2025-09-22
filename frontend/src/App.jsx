import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import PromptInput from "./components/PromptInput";
import CodeOutput from "./components/CodeOutput";
import LoadingState from "./components/LoadingState";
import Button from "./components/Button";
import { generateCode } from "./services/api";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { Moon, Sun, History, X } from "lucide-react";
import toast from "react-hot-toast";
import styles from "./App.module.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState("javascript");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useLocalStorage("codeGenieHistory", []);
  const [showHistory, setShowHistory] = useState(false);
  const [darkMode, setDarkMode] = useLocalStorage("darkMode", true);

  // Apply dark mode class to document
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error(
        "Please enter a description of the code you want to generate.",
      );
      return;
    }

    setIsLoading(true);
    setGeneratedCode("");

    try {
      const response = await generateCode({
        prompt: prompt.trim(),
        includeComments: true,
      });

      if (response.success) {
        setGeneratedCode(response.code);
        setDetectedLanguage(response.language);

        // Add to history
        const historyItem = {
          id: Date.now(),
          prompt: prompt.trim(),
          code: response.code,
          language: response.language,
          timestamp: response.timestamp,
          tokensUsed: response.tokensUsed,
        };

        setHistory((prev) => [historyItem, ...prev.slice(0, 49)]); // Keep last 50 items
        toast.success("Code generated successfully! 🎉");
      } else {
        throw new Error(response.message || "Failed to generate code");
      }
    } catch (error) {
      console.error("Generation error:", error);
      let errorMessage = "Failed to generate code. Please try again.";

      if (error.message?.includes("API key")) {
        errorMessage =
          "API configuration error. Please check the server configuration.";
      } else if (error.message?.includes("quota")) {
        errorMessage = "API quota exceeded. Please try again later.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistorySelect = (item) => {
    setPrompt(item.prompt);
    setGeneratedCode(item.code);
    setDetectedLanguage(item.language);
    setShowHistory(false);
    toast.success("Loaded from history!");
  };

  const clearHistory = () => {
    setHistory([]);
    toast.success("History cleared!");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`${styles.app} ${darkMode ? styles.dark : ""}`}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: darkMode ? "#374151" : "#ffffff",
            color: darkMode ? "#f3f4f6" : "#1f2937",
            border: `1px solid ${darkMode ? "#4b5563" : "#e5e7eb"}`,
          },
        }}
      />

      <div className={styles.container}>
        {/* Header */}
        <Header />

        {/* Controls */}
        <div className={styles.controls}>
          <div className={styles.controlsLeft}>
            {generatedCode && (
              <div className={styles.languageInfo}>
                Generated: <span>{detectedLanguage}</span>
              </div>
            )}
            <Button
              variant="secondary"
              onClick={toggleDarkMode}
              title={`Switch to ${darkMode ? "light" : "dark"} mode`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              {darkMode ? "Light" : "Dark"}
            </Button>

            {/* <Button
              variant="secondary"
              onClick={() => setShowHistory(!showHistory)}
              title="View generation history"
              className={styles.historyButton}
            >
              <History size={20} />
              History
              {history.length > 0 && (
                <span className={styles.historyBadge}>
                  {history.length > 99 ? "99+" : history.length}
                </span>
              )}
            </Button> */}
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`${styles.mainContent} ${isLoading ? styles.blurred : ""}`}
        >
          {/* Left Panel - Input */}
          <div className={styles.leftPanel}>
            <PromptInput
              prompt={prompt}
              setPrompt={setPrompt}
              onGenerate={handleGenerate}
              isLoading={isLoading}
              darkMode={darkMode}
            />
          </div>

          {/* Right Panel - Output */}
          <div className={styles.rightPanel}>
            <CodeOutput
              code={generatedCode}
              language={detectedLanguage}
              prompt={prompt}
              darkMode={darkMode}
            />
          </div>
        </div>

        {/* Centered Loading State */}
        {isLoading && (
          <div className={styles.loadingOverlay}>
            <LoadingState darkMode={darkMode} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
