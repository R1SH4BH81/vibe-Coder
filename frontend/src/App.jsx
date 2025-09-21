import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import PromptInput from "./components/PromptInput";
import CodeOutput from "./components/CodeOutput";
import LoadingState from "./components/LoadingState";
import HistoryPanel from "./components/HistoryPanel";
import Button from "./components/Button";
import { generateCode, getLanguages } from "./services/api";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { Moon, Sun, History, X } from "lucide-react";
import toast from "react-hot-toast";
import styles from "./App.module.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [generatedCode, setGeneratedCode] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState("javascript");
  const [isLoading, setIsLoading] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [history, setHistory] = useLocalStorage("codeGenieHistory", []);
  const [showHistory, setShowHistory] = useState(false);
  const [darkMode, setDarkMode] = useLocalStorage("darkMode", true);

  // Load available languages on mount
  useEffect(() => {
    loadLanguages();
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const loadLanguages = async () => {
    try {
      const response = await getLanguages();
      setLanguages(response.languages || []);
    } catch (error) {
      console.error("Failed to load languages:", error);
      // Fallback languages
      setLanguages([
        { value: "javascript", label: "JavaScript", icon: "🟨" },
        { value: "python", label: "Python", icon: "🐍" },
        { value: "java", label: "Java", icon: "☕" },
        { value: "cpp", label: "C++", icon: "⚡" },
      ]);
    }
  };

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
        language: selectedLanguage,
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
    setSelectedLanguage(item.language);
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

          {generatedCode && (
            <div className={styles.languageInfo}>
              Generated: <span>{detectedLanguage}</span>
            </div>
          )}
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
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              languages={languages}
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
