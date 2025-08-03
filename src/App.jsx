import { useState, useEffect } from "react";
import { Bot } from "lucide-react";
import { ChatComponent } from "./components/ChatComponent";
import { TextGenerator } from "./components/TextGenerator";
import { Translator } from "./components/Translator";
import { SentimentAnalyzer } from "./components/SentimentAnalyzer";
import { CodeGenerator } from "./components/CodeGenerator";
import { EmailAssistant } from "./components/EmailAssistant";
import { PoetryGenerator } from "./components/PoetryGenerator";
import { TitleGenerator } from "./components/TitleGenerator";
import { QASystem } from "./components/QASystem";
import { StoryGenerator } from "./components/StoryGenerator";
import { RecipeGenerator } from "./components/RecipeGenerator";
import { TextSummarizer } from "./components/TextSummarizer";
import { CodeRefactor } from "./components/CodeRefactor";
import { LanguageDetector } from "./components/LanguageDetector";
import { ContentIdeas } from "./components/ContentIdeas";
import { TextAnalyzer } from "./components/TextAnalyzer";
import "./styles/global.css";

function App() {
  const [activeTab, setActiveTab] = useState("chat");
  const [ollamaStatus, setOllamaStatus] = useState("checking");

  const tabs = [
    { id: "chat", label: "Chat", component: ChatComponent },
    {
      id: "text-generator",
      label: "Generator Tekstu",
      component: TextGenerator,
    },
    { id: "translator", label: "Tłumacz", component: Translator },
    {
      id: "sentiment",
      label: "Analiza Sentimentu",
      component: SentimentAnalyzer,
    },
    { id: "code-generator", label: "Generator Kodu", component: CodeGenerator },
    { id: "email", label: "Asystent Email", component: EmailAssistant },
    { id: "poetry", label: "Poezja", component: PoetryGenerator },
    { id: "titles", label: "Tytuły", component: TitleGenerator },
    { id: "qa", label: "Q&A", component: QASystem },
    { id: "stories", label: "Opowiadania", component: StoryGenerator },
    { id: "recipes", label: "Przepisy", component: RecipeGenerator },
    { id: "summarizer", label: "Podsumowanie", component: TextSummarizer },
    { id: "refactor", label: "Refaktor Kodu", component: CodeRefactor },
    { id: "language", label: "Detektor Języka", component: LanguageDetector },
    {
      id: "content-ideas",
      label: "Pomysły na Treści",
      component: ContentIdeas,
    },
    {
      id: "text-analyzer",
      label: "Analizator Tekstu",
      component: TextAnalyzer,
    },
  ];

  useEffect(() => {
    checkOllamaStatus();
  }, []);

  const checkOllamaStatus = async () => {
    try {
      const response = await fetch("http://localhost:11434/api/tags");
      if (response.ok) {
        setOllamaStatus("connected");
      } else {
        setOllamaStatus("error");
      }
    } catch (_error) {
      setOllamaStatus("error");
    }
  };

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || ChatComponent;

  return (
    <div style={{ minHeight: "100vh" }}>
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <Bot size={32} />
              Ollama AI Studio
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "calc(var(--spacing-unit) * 2)",
              }}
            >
              <div
                style={{
                  fontSize: "0.875rem",
                  color:
                    ollamaStatus === "connected"
                      ? "var(--success-color)"
                      : "var(--error-color)",
                  display: "flex",
                  alignItems: "center",
                  gap: "calc(var(--spacing-unit) * 1)",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background:
                      ollamaStatus === "connected"
                        ? "var(--success-color)"
                        : "var(--error-color)",
                  }}
                ></div>
                {ollamaStatus === "connected"
                  ? "Ollama Połączona"
                  : ollamaStatus === "checking"
                    ? "Sprawdzanie..."
                    : "Ollama Niedostępna"}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          {ollamaStatus === "error" && (
            <div
              className="error-message"
              style={{ marginBottom: "calc(var(--spacing-unit) * 3)" }}
            >
              <strong>Ollama nie jest dostępna!</strong>
              <br />
              Upewnij się, że Ollama jest zainstalowana i uruchomiona na
              localhost:11434.
              <br />
              Możesz pobrać Ollama z:{" "}
              <a
                href="https://ollama.ai"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--error-color)",
                  textDecoration: "underline",
                }}
              >
                https://ollama.ai
              </a>
            </div>
          )}

          <div className="nav-tabs">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="fade-in">
            <ActiveComponent />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
