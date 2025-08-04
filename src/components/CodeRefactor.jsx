import { useState } from "react";
import { Code2, RefreshCw, Check } from "lucide-react";
import { OllamaAPI } from "../services/ollamaAPI";
import useTranslate from "../utils/useTranslate";

export function CodeRefactor() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [refactorType, setRefactorType] = useState("optimize");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const { t } = useTranslate();

  const languages = {
    javascript: "JavaScript",
    python: "Python",
    java: "Java",
    cpp: "C++",
    csharp: "C#",
    php: "PHP",
  };

  const getRefactorTypeLabel = (key) => t(`codeRefactor.refactorTypes.${key}`);

  const refactorCode = async () => {
    if (!code.trim()) return;

    setIsLoading(true);
    setError("");

    const instruction = t(`codeRefactor.instructions.${refactorType}`);
    const prompt = t("codeRefactor.prompt", {
      language: languages[language],
      instruction: instruction,
      languageKey: language,
      code: code,
    });

    try {
      const response = await OllamaAPI.generateText(prompt, null, {
        temperature: 0.2,
      });
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const sampleCodes = {
    javascript: `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    if (items[i].price != null) {
      total = total + items[i].price * items[i].quantity;
    }
  }
  return total;
}`,
    python: `def find_max(numbers):
    max_num = numbers[0]
    for i in range(1, len(numbers)):
        if numbers[i] > max_num:
            max_num = numbers[i]
    return max_num`,
  };

  const loadSampleCode = () => {
    setCode(sampleCodes[language] || sampleCodes.javascript);
  };

  return (
    <div className="card fade-in">
      <div className="card-header">
        <div className="card-icon">
          <Code2 size={20} />
        </div>
        <h3 className="card-title">{t("codeRefactor.title")}</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div style={{ marginBottom: "calc(var(--spacing-unit) * 3)" }}>
        <button type="button" onClick={loadSampleCode} className="btn btn-secondary">
          <Code2 size={16} />
          {t("codeRefactor.loadSample")}
        </button>
      </div>

      <div className="form-group">
        <label className="form-label">{t("codeRefactor.codeLabel")}</label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={t("codeRefactor.codePlaceholder")}
          className="form-textarea"
          style={{
            minHeight: "150px",
            fontFamily: "Monaco, Menlo, Ubuntu Mono, monospace",
          }}
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
          <label className="form-label">{t("codeRefactor.languageLabel")}</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="form-select"
          >
            {Object.entries(languages).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">{t("codeRefactor.refactorTypeLabel")}</label>
          <select
            value={refactorType}
            onChange={(e) => setRefactorType(e.target.value)}
            className="form-select"
          >
            {Object.keys({
              optimize: "",
              clean: "",
              modern: "",
              security: "",
              structure: "",
              comments: "",
            }).map((key) => (
              <option key={key} value={key}>
                {getRefactorTypeLabel(key)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={refactorCode}
        disabled={isLoading || !code.trim()}
        className="btn"
      >
        {isLoading ? <div className="loading-spinner" /> : <RefreshCw size={16} />}
        {t("codeRefactor.refactor")}
      </button>

      {result && (
        <div className="result-container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "calc(var(--spacing-unit) * 2)",
            }}
          >
            <div className="result-title">{t("codeRefactor.resultTitle")}</div>
            <button type="button" onClick={copyToClipboard} className="copy-button">
              {copied ? <Check size={16} /> : <RefreshCw size={16} />}
            </button>
          </div>
          <div className="result-text">{result}</div>
        </div>
      )}
    </div>
  );
}
