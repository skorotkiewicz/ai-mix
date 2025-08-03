import { useState } from "react";
import { ChefHat, Users } from "lucide-react";
import { OllamaAPI } from "../services/ollamaAPI";
import useTranslate from "../utils/useTranslate";

export function RecipeGenerator() {
  const [ingredients, setIngredients] = useState("");
  const [cuisine, setCuisine] = useState("any");
  const [dietType, setDietType] = useState("any");
  const [servings, setServings] = useState(4);
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslate();

  const cuisines = {
    any: t("recipeGenerator.cuisines.any"),
    polish: t("recipeGenerator.cuisines.polish"),
    italian: t("recipeGenerator.cuisines.italian"),
    chinese: t("recipeGenerator.cuisines.chinese"),
    mexican: t("recipeGenerator.cuisines.mexican"),
    indian: t("recipeGenerator.cuisines.indian"),
    french: t("recipeGenerator.cuisines.french"),
    japanese: t("recipeGenerator.cuisines.japanese"),
    thai: t("recipeGenerator.cuisines.thai"),
  };

  const dietTypes = {
    any: t("recipeGenerator.dietTypes.any"),
    vegetarian: t("recipeGenerator.dietTypes.vegetarian"),
    vegan: t("recipeGenerator.dietTypes.vegan"),
    glutenfree: t("recipeGenerator.dietTypes.glutenfree"),
    keto: t("recipeGenerator.dietTypes.keto"),
    lowcarb: t("recipeGenerator.dietTypes.lowcarb"),
    healthy: t("recipeGenerator.dietTypes.healthy"),
  };

  const generateRecipe = async () => {
    if (!ingredients.trim()) return;

    setIsLoading(true);
    setError("");

    const prompt = t("recipeGenerator.prompt", {
      ingredients: ingredients,
      servings: servings,
      cuisineText: cuisine !== "any" ? t("recipeGenerator.cuisinePrompt", { cuisine: cuisines[cuisine] }) : "",
      dietTypeText: dietType !== "any" ? t("recipeGenerator.dietTypePrompt", { dietType: dietTypes[dietType] }) : ""
    });

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
        <h3 className="card-title">{t("recipeGenerator.title")}</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label className="form-label">{t("recipeGenerator.ingredientsLabel")}</label>
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder={t("recipeGenerator.ingredientsPlaceholder")}
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
          <label className="form-label">{t("recipeGenerator.cuisineLabel")}</label>
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
          <label className="form-label">{t("recipeGenerator.dietTypeLabel")}</label>
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
          <label className="form-label">{t("recipeGenerator.servingsLabel")}</label>
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
          <div className="loading-spinner" />
        ) : (
          <ChefHat size={16} />
        )}
        {t("recipeGenerator.generate")}
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
              {t("recipeGenerator.resultTitle")}
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
                {servings === 1 ? t("recipeGenerator.servingsText.one") : servings < 5 ? t("recipeGenerator.servingsText.few") : t("recipeGenerator.servingsText.many")}
              </div>
            </div>
          </div>
          <div className="result-text">{result}</div>
        </div>
      )}
    </div>
  );
}
