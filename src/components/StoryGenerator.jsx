import { useState } from "react";
import { BookOpen, Dice1 } from "lucide-react";
import { OllamaAPI } from "../services/ollamaAPI";

export function StoryGenerator() {
  const [genre, setGenre] = useState("fantasy");
  const [characters, setCharacters] = useState("");
  const [setting, setSetting] = useState("");
  const [plot, setPlot] = useState("");
  const [length, setLength] = useState("short");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const genres = {
    fantasy: "Fantasy",
    scifi: "Science Fiction",
    mystery: "Kryminał",
    romance: "Romans",
    horror: "Horror",
    adventure: "Przygodowy",
    comedy: "Komedia",
    drama: "Dramat",
  };

  const lengths = {
    short: "Krótkie opowiadanie (1-2 strony)",
    medium: "Średnie opowiadanie (3-4 strony)",
    long: "Długie opowiadanie (5+ stron)",
  };

  const generateStory = async () => {
    setIsLoading(true);
    setError("");

    const lengthInstructions = {
      short: "krótkie opowiadanie (około 500-800 słów)",
      medium: "średnie opowiadanie (około 1000-1500 słów)",
      long: "długie opowiadanie (około 2000+ słów)",
    };

    let prompt = `Napisz ${lengthInstructions[length]} w gatunku ${genres[genre]}.`;

    if (characters) prompt += ` Główne postacie: ${characters}.`;
    if (setting) prompt += ` Miejsce akcji: ${setting}.`;
    if (plot) prompt += ` Fabuła: ${plot}.`;

    prompt += ` Opowiadanie powinno być kompletne z wprowadzeniem, rozwinięciem i zakończeniem. Pisz w języku polskim.`;

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
    const randomCharacters = [
      "młody wojownik i mądra czarodziejka",
      "detektyw i jego tajemniczy partner",
      "kosmonauta i alien",
      "dwoje nastolatków z różnych światów",
      "stary rybak i dziwne stworzenie z morza",
    ];

    const randomSettings = [
      "magiczny las pełen tajemnic",
      "futurystyczne miasto w roku 3024",
      "opuszczona wyspa na oceanie",
      "mała wioska w górach",
      "stacja kosmiczna na krańcu galaktyki",
    ];

    const randomPlots = [
      "muszą odnaleźć starożytny artefakt",
      "odkrywają spisek zagrażający światu",
      "próbują wrócić do domu",
      "muszą ocalić swoje miasto",
      "szukają odpowiedzi na zagadkę życia",
    ];

    setCharacters(
      randomCharacters[Math.floor(Math.random() * randomCharacters.length)],
    );
    setSetting(
      randomSettings[Math.floor(Math.random() * randomSettings.length)],
    );
    setPlot(randomPlots[Math.floor(Math.random() * randomPlots.length)]);
  };

  return (
    <div className="card fade-in">
      <div className="card-header">
        <div className="card-icon">
          <BookOpen size={20} />
        </div>
        <h3 className="card-title">Generator Opowiadań</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div
        style={{
          display: "flex",
          gap: "calc(var(--spacing-unit) * 2)",
          marginBottom: "calc(var(--spacing-unit) * 3)",
        }}
      >
        <button
          type="button"
          onClick={generateRandomPrompt}
          className="btn btn-secondary"
        >
          <Dice1 size={16} />
          Losowy Pomysł
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
          <label className="form-label">Gatunek</label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="form-select"
          >
            {Object.entries(genres).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Długość</label>
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
        <label className="form-label">Główne postacie (opcjonalnie)</label>
        <input
          type="text"
          value={characters}
          onChange={(e) => setCharacters(e.target.value)}
          placeholder="Np. młody wojownik, mądra czarodziejka..."
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Miejsce akcji (opcjonalnie)</label>
        <input
          type="text"
          value={setting}
          onChange={(e) => setSetting(e.target.value)}
          placeholder="Np. magiczny las, futurystyczne miasto..."
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Zarys fabuły (opcjonalnie)</label>
        <textarea
          value={plot}
          onChange={(e) => setPlot(e.target.value)}
          placeholder="Np. bohaterowie muszą odnaleźć starożytny artefakt..."
          className="form-textarea"
          style={{ minHeight: "80px" }}
        />
      </div>

      <button
        type="button"
        onClick={generateStory}
        disabled={isLoading}
        className="btn"
      >
        {isLoading ? (
          <div className="loading-spinner" />
        ) : (
          <BookOpen size={16} />
        )}
        Napisz Opowiadanie
      </button>

      {result && (
        <div className="result-container">
          <div className="result-title">Wygenerowane opowiadanie:</div>
          <div className="result-text" style={{ lineHeight: "1.8" }}>
            {result}
          </div>
        </div>
      )}
    </div>
  );
}
