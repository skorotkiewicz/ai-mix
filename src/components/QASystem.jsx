import { useState } from "react";
import { HelpCircle, FileText } from "lucide-react";
import { OllamaAPI } from "../services/ollamaAPI";
import useTranslate from "../utils/useTranslate";

export function QASystem() {
  const [context, setContext] = useState("");
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslate();

  const sampleContexts = [
    {
      label: t("qaSystem.sampleContexts.company"),
      content: t("qaSystem.sampleContent.company"),
    },
    {
      label: t("qaSystem.sampleContexts.recipes"),
      content: t("qaSystem.sampleContent.recipes"),
    },
  ];

  const answerQuestion = async () => {
    if (!context.trim() || !question.trim()) return;

    setIsLoading(true);
    setError("");

    const prompt = t("qaSystem.prompt", {
      context: context,
      question: question,
    });

    try {
      const response = await OllamaAPI.generateText(prompt, null, {
        temperature: 0.3,
      });
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleContext = (sampleContent) => {
    setContext(sampleContent);
  };

  return (
    <div className="card fade-in">
      <div className="card-header">
        <div className="card-icon">
          <HelpCircle size={20} />
        </div>
        <h3 className="card-title">{t("qaSystem.title")}</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div style={{ marginBottom: "calc(var(--spacing-unit) * 3)" }}>
        <div className="form-label">{t("qaSystem.sampleContextsLabel")}</div>
        <div
          style={{
            display: "flex",
            gap: "calc(var(--spacing-unit) * 1)",
            flexWrap: "wrap",
          }}
        >
          {sampleContexts.map((sample, index) => (
            <button
              type="button"
              key={index}
              onClick={() => loadSampleContext(sample.content)}
              className="btn btn-secondary"
              style={{
                fontSize: "0.8rem",
                padding: "calc(var(--spacing-unit) * 1) calc(var(--spacing-unit) * 2)",
              }}
            >
              <FileText size={14} />
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">{t("qaSystem.contextLabel")}</label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder={t("qaSystem.contextPlaceholder")}
          className="form-textarea"
          style={{ minHeight: "150px" }}
        />
      </div>

      <div className="form-group">
        <label className="form-label">{t("qaSystem.questionLabel")}</label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t("qaSystem.questionPlaceholder")}
          className="form-textarea"
          style={{ minHeight: "80px" }}
        />
      </div>

      <button
        type="button"
        onClick={answerQuestion}
        disabled={isLoading || !context.trim() || !question.trim()}
        className="btn"
      >
        {isLoading ? <div className="loading-spinner" /> : <HelpCircle size={16} />}
        {t("qaSystem.generate")}
      </button>

      {result && (
        <div className="result-container">
          <div className="result-title">{t("qaSystem.resultTitle")}</div>
          <div className="result-text">{result}</div>
        </div>
      )}
    </div>
  );
}
