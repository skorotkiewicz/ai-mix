import { useState } from "react";
import { ChefHat, Users } from "lucide-react";
import { OllamaAPI } from "../services/ollamaAPI";

export function RecipeGenerator() {
  const [ingredients, setIngredients] = useState("");
  const [cuisine, setCuisine] = useState("any");
  const [dietType, setDietType] = useState("any");
  const [servings, setServings] = useState(4);
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const cuisines = {
    any: "Dowolna",
    polish: "Polska",
    italian: "Włoska",
    chinese: "Chińska",
    mexican: "Meksykańska",
    indian: "Indyjska",
    french: "Francuska",
    japanese: "Japońska",
    thai: "Tajska",
  };

  const dietTypes = {
    any: "Dowolna",
    vegetarian: "Wegetariańska",
    vegan: "Wegańska",
    glutenfree: "Bezglutenowa",
    keto: "Ketogeniczna",
    lowcarb: "Niskowęglowodanowa",
    healthy: "Zdrowa",
  };

  const generateRecipe = async () => {
    if (!ingredients.trim()) return;

    setIsLoading(true);
    setError("");

    let prompt = `Stwórz przepis kulinarny używając następujących składników: ${ingredients}.`;

    if (cuisine !== "any") prompt += ` Kuchnia: ${cuisines[cuisine]}.`;
    if (dietType !== "any") prompt += ` Dieta: ${dietTypes[dietType]}.`;

    prompt += ` Liczba porcji: ${servings}.

Przepis powinien zawierać:
1. Nazwę dania
2. Listę wszystkich potrzebnych składników z ilościami
3. Czas przygotowania
4. Instrukcje krok po kroku
5. Wskazówki dodatkowe

Napisz w języku polskim, w przystępny sposób:`;

    try {
      const response = await OllamaAPI.generateText(prompt, null, {
        temperature: 0.7,
      });
      setResult(response);
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
          <ChefHat size={20} />
        </div>
        <h3 className="card-title">Generator Przepisów</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label className="form-label">Dostępne składniki</label>
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Np. kurczak, ryż, papryka, cebula, czosnek, sól, pieprz..."
          className="form-textarea"
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
          <label className="form-label">Kuchnia</label>
          <select
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            className="form-select"
          >
            {Object.entries(cuisines).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Typ diety</label>
          <select
            value={dietType}
            onChange={(e) => setDietType(e.target.value)}
            className="form-select"
          >
            {Object.entries(dietTypes).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Porcje</label>
          <input
            type="number"
            value={servings}
            onChange={(e) => setServings(Number(e.target.value))}
            min="1"
            max="20"
            className="form-input"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={generateRecipe}
        disabled={isLoading || !ingredients.trim()}
        className="btn"
      >
        {isLoading ? (
          <div className="loading-spinner"></div>
        ) : (
          <ChefHat size={16} />
        )}
        Stwórz Przepis
      </button>

      {result && (
        <div className="result-container">
          <div className="result-title">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "calc(var(--spacing-unit) * 2)",
              }}
            >
              Wygenerowany przepis:
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "calc(var(--spacing-unit) * 1)",
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                }}
              >
                <Users size={14} />
                {servings}{" "}
                {servings === 1 ? "porcja" : servings < 5 ? "porcje" : "porcji"}
              </div>
            </div>
          </div>
          <div className="result-text">{result}</div>
        </div>
      )}
    </div>
  );
}
