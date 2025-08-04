import { useState, useEffect } from "react";
import { Bot, Globe } from "lucide-react";
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
import { OllamaSettings } from "./components/OllamaSettings";
import { WelcomePage } from "./components/WelcomePage";
import "./styles/global.css";
import { OllamaAPI } from "./services/ollamaAPI";
import useTranslate from "./utils/useTranslate";

function App() {
  const [activeTab, setActiveTab] = useState("welcome");
  const [ollamaStatus, setOllamaStatus] = useState("checking");
  const [showOllamaSettings, setShowOllamaSettings] = useState(false);

  const { t, changeLanguage, currentLanguage } = useTranslate();

  const tabs = [
    // { id: "welcome", label: t("tabs.welcome"), component: WelcomePage },
    { id: "chat", label: t("tabs.chat"), component: ChatComponent },
    {
      id: "text-generator",
      label: t("tabs.textGenerator"),
      component: TextGenerator,
    },
    { id: "translator", label: t("tabs.translator"), component: Translator },
    {
      id: "sentiment",
      label: t("tabs.sentiment"),
      component: SentimentAnalyzer,
    },
    {
      id: "code-generator",
      label: t("tabs.codeGenerator"),
      component: CodeGenerator,
    },
    { id: "email", label: t("tabs.email"), component: EmailAssistant },
    { id: "poetry", label: t("tabs.poetry"), component: PoetryGenerator },
    { id: "titles", label: t("tabs.titles"), component: TitleGenerator },
    { id: "qa", label: t("tabs.qa"), component: QASystem },
    { id: "stories", label: t("tabs.stories"), component: StoryGenerator },
    { id: "recipes", label: t("tabs.recipes"), component: RecipeGenerator },
    {
      id: "summarizer",
      label: t("tabs.summarizer"),
      component: TextSummarizer,
    },
    { id: "refactor", label: t("tabs.refactor"), component: CodeRefactor },
    { id: "language", label: t("tabs.language"), component: LanguageDetector },
    {
      id: "content-ideas",
      label: t("tabs.contentIdeas"),
      component: ContentIdeas,
    },
    {
      id: "text-analyzer",
      label: t("tabs.textAnalyzer"),
      component: TextAnalyzer,
    },
  ];

  useEffect(() => {
    checkOllamaStatus();

    // Check if ollamaUrl or selectedModel are missing and show popup
    const ollamaUrl = localStorage.getItem("ollamaUrl");
    const selectedModel = localStorage.getItem("selectedModel");
    if (!ollamaUrl || !selectedModel) {
      setShowOllamaSettings(true);
    }
  }, []);

  const checkOllamaStatus = async () => {
    try {
      const ollamaUrl = OllamaAPI.getOllamaUrl();
      const response = await fetch(`${ollamaUrl}/api/tags`);
      if (response.ok) {
        setOllamaStatus("connected");
      } else {
        setOllamaStatus("error");
      }
    } catch (_error) {
      setOllamaStatus("error");
    }
  };

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component || WelcomePage;

  return (
    <div style={{ minHeight: "100vh" }}>
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <div className="logo" onClick={() => setActiveTab("welcome")}>
              <Bot size={32} />
              {t("app.title")}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "calc(var(--spacing-unit) * 2)",
              }}
            >
              <div className="language-switcher-dropdown">
                <div className="language-icon">
                  <Globe size={18} />
                  <span className="current-lang">{currentLanguage.toUpperCase()}</span>
                </div>
                <div className="language-dropdown">
                  <button
                    type="button"
                    onClick={() => changeLanguage("en")}
                    className={`lang-btn ${currentLanguage === "en" ? "active" : ""}`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => changeLanguage("pl")}
                    className={`lang-btn ${currentLanguage === "pl" ? "active" : ""}`}
                  >
                    PL
                  </button>
                  <button
                    type="button"
                    onClick={() => changeLanguage("de")}
                    className={`lang-btn ${currentLanguage === "de" ? "active" : ""}`}
                  >
                    DE
                  </button>
                </div>
              </div>
              <div className="model-display" onClick={() => setShowOllamaSettings(true)}>
                <span className="model-label">Model:</span>
                <span className="model-name">{OllamaAPI.getSelectedModel()}</span>
              </div>
              <div
                className={`header-status ${
                  ollamaStatus === "connected" ? "status-connected" : "status-error"
                }`}
                onClick={() => setShowOllamaSettings(true)}
              >
                <div className="status-indicator" />
                {ollamaStatus === "connected"
                  ? t("app.status.connected")
                  : ollamaStatus === "checking"
                    ? t("app.status.checking")
                    : t("app.status.unavailable")}
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
              <strong>{t("app.error.title")}</strong>
              <br />
              {t("app.error.description")}
              <br />
              {t("app.error.download")}{" "}
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

      {/* Popup Modal for Ollama Settings */}
      {showOllamaSettings && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowOllamaSettings(false);
            }
          }}
        >
          <div className="modal-container">
            <OllamaSettings onClose={() => setShowOllamaSettings(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
