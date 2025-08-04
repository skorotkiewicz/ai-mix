import { useState } from "react";
import { Type, RefreshCw } from "lucide-react";
import { OllamaAPI } from "../services/ollamaAPI";
import useTranslate from "../utils/useTranslate";

export function TitleGenerator() {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("blog");
  const [count, setCount] = useState(5);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslate();

  const categories = {
    blog: t("titleGenerator.categories.blog"),
    article: t("titleGenerator.categories.article"),
    news: t("titleGenerator.categories.news"),
    marketing: t("titleGenerator.categories.marketing"),
    tutorial: t("titleGenerator.categories.tutorial"),
    review: t("titleGenerator.categories.review"),
    story: t("titleGenerator.categories.story"),
  };

  const generateTitles = async () => {
    if (!content.trim()) return;

    setIsLoading(true);
    setError("");

    const prompt = t("titleGenerator.prompt", {
      count: count,
      category: categories[category],
      content: content,
    });

    try {
      const response = await OllamaAPI.generateText(prompt, null, {
        temperature: 0.8,
      });

      const titles = response
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => line.replace(/^\d+\.\s*/, "").trim())
        .filter((title) => title.length > 0);

      setResults(titles);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card fade-in">
      <div className="card-header">
        <div className="card-icon">
          <Type size={20} />
        </div>
        <h3 className="card-title">{t("titleGenerator.title")}</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label className="form-label">{t("titleGenerator.contentLabel")}</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t("titleGenerator.contentPlaceholder")}
          className="form-textarea"
          style={{ minHeight: "120px" }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "calc(var(--spacing-unit) * 2)",
        }}
      >
        <div className="form-group">
          <label className="form-label">{t("titleGenerator.categoryLabel")}</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-select"
          >
            {Object.entries(categories).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">{t("titleGenerator.countLabel")}</label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="form-select"
          >
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={generateTitles}
        disabled={isLoading || !content.trim()}
        className="btn"
      >
        {isLoading ? <div className="loading-spinner" /> : <RefreshCw size={16} />}
        {t("titleGenerator.generate")}
      </button>

      {results.length > 0 && (
        <div className="result-container">
          <div className="result-title">{t("titleGenerator.resultTitle")}</div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "calc(var(--spacing-unit) * 2)",
            }}
          >
            {results.map((title, index) => (
              <div
                key={index}
                style={{
                  padding: "calc(var(--spacing-unit) * 2)",
                  background: "var(--background-card)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onClick={() => navigator.clipboard.writeText(title)}
                title={t("titleGenerator.clickToCopy")}
              >
                <div style={{ fontWeight: "500", color: "var(--text-primary)" }}>
                  {index + 1}. {title}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
