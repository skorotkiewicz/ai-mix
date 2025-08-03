import { useState } from "react";
import { FileText, Minimize2 } from "lucide-react";
import { OllamaAPI } from "../services/ollamaAPI";
import useTranslate from "../utils/useTranslate";

export function TextSummarizer() {
  const [text, setText] = useState("");
  const [summaryType, setSummaryType] = useState("bullet");
  const [length, setLength] = useState("medium");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslate();

  const summaryTypes = {
    bullet: t("textSummarizer.summaryTypes.bullet"),
    paragraph: t("textSummarizer.summaryTypes.paragraph"),
    abstract: t("textSummarizer.summaryTypes.abstract"),
    executive: t("textSummarizer.summaryTypes.executive"),
  };

  const lengths = {
    short: t("textSummarizer.lengths.short"),
    medium: t("textSummarizer.lengths.medium"),
    long: t("textSummarizer.lengths.long"),
  };

  const sampleTexts = [
    {
      label: t("textSummarizer.sampleTexts.scientific"),
      content: t("textSummarizer.sampleContent.scientific"),
    },
    {
      label: t("textSummarizer.sampleTexts.business"),
      content: t("textSummarizer.sampleContent.business"),
    },
  ];

  const summarizeText = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    setError("");

    const typeInstructions = {
      bullet: t("textSummarizer.typeInstructions.bullet"),
      paragraph: t("textSummarizer.typeInstructions.paragraph"),
      abstract: t("textSummarizer.typeInstructions.abstract"),
      executive: t("textSummarizer.typeInstructions.executive"),
    };

    const lengthInstructions = {
      short: t("textSummarizer.lengthInstructions.short"),
      medium: t("textSummarizer.lengthInstructions.medium"),
      long: t("textSummarizer.lengthInstructions.long"),
    };

    const prompt = t("textSummarizer.prompt", {
      lengthInstruction: lengthInstructions[length],
      typeInstruction: typeInstructions[summaryType],
      text: text
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

  const loadSampleText = (content) => {
    setText(content);
  };

  return (
    <div className="card fade-in">
      <div className="card-header">
        <div className="card-icon">
          <FileText size={20} />
        </div>
        <h3 className="card-title">{t("textSummarizer.title")}</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div style={{ marginBottom: "calc(var(--spacing-unit) * 3)" }}>
        <div className="form-label">{t("textSummarizer.sampleTextsLabel")}</div>
        <div
          style={{
            display: "flex",
            gap: "calc(var(--spacing-unit) * 1)",
            flexWrap: "wrap",
          }}
        >
          {sampleTexts.map((sample, index) => (
            <button
              type="button"
              key={index}
              onClick={() => loadSampleText(sample.content)}
              className="btn btn-secondary"
              style={{
                fontSize: "0.8rem",
                padding:
                  "calc(var(--spacing-unit) * 1) calc(var(--spacing-unit) * 2)",
              }}
            >
              <FileText size={14} />
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">{t("textSummarizer.textLabel")}</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("textSummarizer.textPlaceholder")}
          className="form-textarea"
          style={{ minHeight: "150px" }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "calc(var(--spacing-unit) * 2)",
        }}
      >
        <div className="form-group">
          <label className="form-label">{t("textSummarizer.summaryTypeLabel")}</label>
          <select
            value={summaryType}
            onChange={(e) => setSummaryType(e.target.value)}
            className="form-select"
          >
            {Object.entries(summaryTypes).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">{t("textSummarizer.lengthLabel")}</label>
          <select
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="form-select"
          >
            {Object.entries(lengths).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={summarizeText}
        disabled={isLoading || !text.trim()}
        className="btn"
      >
        {isLoading ? (
          <div className="loading-spinner" />
        ) : (
          <Minimize2 size={16} />
        )}
        {t("textSummarizer.generate")}
      </button>

      {result && (
        <div className="result-container">
          <div className="result-title">{t("textSummarizer.resultTitle")}</div>
          <div className="result-text">{result}</div>
        </div>
      )}
    </div>
  );
}
