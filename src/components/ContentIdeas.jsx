import { useState } from "react";
import { Lightbulb, Target, TrendingUp } from "lucide-react";
import { OllamaAPI } from "../services/ollamaAPI";
import useTranslate from "../utils/useTranslate";

export function ContentIdeas() {
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("blog");
  const [audience, setAudience] = useState("");
  const [count, setCount] = useState(10);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslate();

  const getPlatformLabel = (key) => t(`contentIdeas.platforms.${key}`);

  const generateIdeas = async () => {
    if (!niche.trim()) return;

    setIsLoading(true);
    setError("");

    const audienceText = audience ? t('contentIdeas.audiencePrompt', { audience }) : '';
    const prompt = t('contentIdeas.prompt', {
      count,
      platform: getPlatformLabel(platform),
      niche,
      audienceText
    });

    try {
      const response = await OllamaAPI.generateText(prompt, null, {
        temperature: 0.8,
      });

      const ideas = response
        .split("\n")
        .filter((line) => line.trim() && /^\d+\./.test(line.trim()))
        .map((line) => {
          const cleaned = line.replace(/^\d+\.\s*/, "").trim();
          const parts = cleaned.split(" - ");
          return {
            title: parts[0] || cleaned,
            description: parts[1] || "",
            reason: parts[2] || "",
          };
        });

      setResults(ideas);
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
          <Lightbulb size={20} />
        </div>
        <h3 className="card-title">{t('contentIdeas.title')}</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label className="form-label">{t('contentIdeas.nicheLabel')}</label>
        <input
          type="text"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          placeholder={t('contentIdeas.nichePlaceholder')}
          className="form-input"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 100px",
          gap: "calc(var(--spacing-unit) * 2)",
        }}
      >
        <div className="form-group">
          <label className="form-label">{t('contentIdeas.platformLabel')}</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="form-select"
          >
            {Object.keys({blog: '', social: '', youtube: '', podcast: '', newsletter: '', linkedin: ''}).map((key) => (
              <option key={key} value={key}>
                {getPlatformLabel(key)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">{t('contentIdeas.audienceLabel')}</label>
          <input
            type="text"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder={t('contentIdeas.audiencePlaceholder')}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">{t('contentIdeas.countLabel')}</label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="form-select"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={generateIdeas}
        disabled={isLoading || !niche.trim()}
        className="btn"
      >
        {isLoading ? (
          <div className="loading-spinner" />
        ) : (
          <TrendingUp size={16} />
        )}
        {t('contentIdeas.generate')}
      </button>

      {results.length > 0 && (
        <div className="result-container">
          <div className="result-title">
            {t('contentIdeas.resultTitle', { platform: getPlatformLabel(platform) })}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "calc(var(--spacing-unit) * 2)",
            }}
          >
            {results.map((idea, index) => (
              <div
                key={index}
                style={{
                  padding: "calc(var(--spacing-unit) * 3)",
                  background: "var(--background-card)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    marginBottom: "calc(var(--spacing-unit) * 1)",
                    display: "flex",
                    alignItems: "center",
                    gap: "calc(var(--spacing-unit) * 1)",
                  }}
                >
                  <Target size={16} style={{ color: "var(--accent-color)" }} />
                  {idea.title}
                </div>
                {idea.description && (
                  <div
                    style={{
                      color: "var(--text-secondary)",
                      marginBottom: "calc(var(--spacing-unit) * 1)",
                      fontSize: "0.875rem",
                    }}
                  >
                    {idea.description}
                  </div>
                )}
                {idea.reason && (
                  <div
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.8rem",
                      fontStyle: "italic",
                    }}
                  >
                    💡 {idea.reason}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
