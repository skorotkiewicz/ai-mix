import { useState } from "react";
import { BookOpen, Dice1 } from "lucide-react";
import { OllamaAPI } from "../services/ollamaAPI";
import useTranslate from "../utils/useTranslate";

export function StoryGenerator() {
  const [genre, setGenre] = useState("fantasy");
  const [characters, setCharacters] = useState("");
  const [setting, setSetting] = useState("");
  const [plot, setPlot] = useState("");
  const [length, setLength] = useState("short");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslate();

  const genres = {
    fantasy: t("storyGenerator.genres.fantasy"),
    scifi: t("storyGenerator.genres.scifi"),
    mystery: t("storyGenerator.genres.mystery"),
    romance: t("storyGenerator.genres.romance"),
    horror: t("storyGenerator.genres.horror"),
    adventure: t("storyGenerator.genres.adventure"),
    comedy: t("storyGenerator.genres.comedy"),
    drama: t("storyGenerator.genres.drama"),
  };

  const lengths = {
    short: t("storyGenerator.lengths.short"),
    medium: t("storyGenerator.lengths.medium"),
    long: t("storyGenerator.lengths.long"),
  };

  const generateStory = async () => {
    setIsLoading(true);
    setError("");

    const lengthInstructions = {
      short: t("storyGenerator.lengthInstructions.short"),
      medium: t("storyGenerator.lengthInstructions.medium"),
      long: t("storyGenerator.lengthInstructions.long"),
    };

    const prompt = t("storyGenerator.prompt", {
      length: lengthInstructions[length],
      genre: genres[genre],
      charactersText: characters ? t("storyGenerator.charactersPrompt", { characters }) : "",
      settingText: setting ? t("storyGenerator.settingPrompt", { setting }) : "",
      plotText: plot ? t("storyGenerator.plotPrompt", { plot }) : "",
    });

    try {
      const response = await OllamaAPI.generateText(prompt, null, {
        temperature: 0.8,
      });
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const generateRandomPrompt = () => {
    const randomCharacters = t("storyGenerator.randomPrompts.characters", {
      returnObjects: true,
    });
    const randomSettings = t("storyGenerator.randomPrompts.settings", {
      returnObjects: true,
    });
    const randomPlots = t("storyGenerator.randomPrompts.plots", {
      returnObjects: true,
    });

    setCharacters(randomCharacters[Math.floor(Math.random() * randomCharacters.length)]);
    setSetting(randomSettings[Math.floor(Math.random() * randomSettings.length)]);
    setPlot(randomPlots[Math.floor(Math.random() * randomPlots.length)]);
  };

  return (
    <div className="card fade-in">
      <div className="card-header">
        <div className="card-icon">
          <BookOpen size={20} />
        </div>
        <h3 className="card-title">{t("storyGenerator.title")}</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div
        style={{
          display: "flex",
          gap: "calc(var(--spacing-unit) * 2)",
          marginBottom: "calc(var(--spacing-unit) * 3)",
        }}
      >
        <button type="button" onClick={generateRandomPrompt} className="btn btn-secondary">
          <Dice1 size={16} />
          {t("storyGenerator.randomIdea")}
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "calc(var(--spacing-unit) * 2)",
        }}
      >
        <div className="form-group">
          <label className="form-label">{t("storyGenerator.genreLabel")}</label>
          <select value={genre} onChange={(e) => setGenre(e.target.value)} className="form-select">
            {Object.entries(genres).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">{t("storyGenerator.lengthLabel")}</label>
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

      <div className="form-group">
        <label className="form-label">{t("storyGenerator.charactersLabel")}</label>
        <input
          type="text"
          value={characters}
          onChange={(e) => setCharacters(e.target.value)}
          placeholder={t("storyGenerator.charactersPlaceholder")}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">{t("storyGenerator.settingLabel")}</label>
        <input
          type="text"
          value={setting}
          onChange={(e) => setSetting(e.target.value)}
          placeholder={t("storyGenerator.settingPlaceholder")}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">{t("storyGenerator.plotLabel")}</label>
        <textarea
          value={plot}
          onChange={(e) => setPlot(e.target.value)}
          placeholder={t("storyGenerator.plotPlaceholder")}
          className="form-textarea"
          style={{ minHeight: "80px" }}
        />
      </div>

      <button type="button" onClick={generateStory} disabled={isLoading} className="btn">
        {isLoading ? <div className="loading-spinner" /> : <BookOpen size={16} />}
        {t("storyGenerator.generate")}
      </button>

      {result && (
        <div className="result-container">
          <div className="result-title">{t("storyGenerator.resultTitle")}</div>
          <div className="result-text" style={{ lineHeight: "1.8" }}>
            {result}
          </div>
        </div>
      )}
    </div>
  );
}
