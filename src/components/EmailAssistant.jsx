import { useState } from "react";
import { Mail, Send, User, Briefcase } from "lucide-react";
import { OllamaAPI } from "../services/ollamaAPI";
import useTranslate from "../utils/useTranslate";

export function EmailAssistant() {
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState("professional");
  const [recipient, setRecipient] = useState("");
  const [context, setContext] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslate();

  const getToneLabel = (key) => t(`emailAssistant.tones.${key}`);

  const templates = [
    {
      id: "meeting",
      label: t('emailAssistant.templates.meeting'),
      icon: <User size={16} />,
    },
    {
      id: "follow-up",
      label: t('emailAssistant.templates.follow-up'),
      icon: <Briefcase size={16} />,
    },
    { id: "apology", label: t('emailAssistant.templates.apology'), icon: <Mail size={16} /> },
    {
      id: "introduction",
      label: t('emailAssistant.templates.introduction'),
      icon: <User size={16} />,
    },
  ];

  const generateEmail = async () => {
    if (!purpose.trim()) return;

    setIsLoading(true);
    setError("");

    const toneInstruction = t(`emailAssistant.toneInstructions.${tone}`);
    const recipientText = recipient ? t('emailAssistant.recipientPrompt', { recipient }) : '';
    const contextText = context ? t('emailAssistant.contextPrompt', { context }) : '';
    
    const prompt = t('emailAssistant.prompt', {
      tone: toneInstruction,
      purpose,
      recipientText,
      contextText
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

  const mainTemplate = (templateId) => {
    setPurpose(t(`emailAssistant.templateContent.${templateId}`));
  };

  return (
    <div className="card fade-in">
      <div className="card-header">
        <div className="card-icon">
          <Mail size={20} />
        </div>
        <h3 className="card-title">{t('emailAssistant.title')}</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div style={{ marginBottom: "calc(var(--spacing-unit) * 3)" }}>
        <div className="form-label">{t('emailAssistant.templatesLabel')}</div>
        <div
          style={{
            display: "flex",
            gap: "calc(var(--spacing-unit) * 1)",
            flexWrap: "wrap",
          }}
        >
          {templates.map((template) => (
            <button
              type="button"
              key={template.id}
              onClick={() => mainTemplate(template.id)}
              className="btn btn-secondary"
              style={{
                fontSize: "0.8rem",
                padding:
                  "calc(var(--spacing-unit) * 1) calc(var(--spacing-unit) * 2)",
              }}
            >
              {template.icon}
              {template.label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">{t('emailAssistant.purposeLabel')}</label>
        <textarea
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder={t('emailAssistant.purposePlaceholder')}
          className="form-textarea"
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
          <label className="form-label">{t('emailAssistant.recipientLabel')}</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder={t('emailAssistant.recipientPlaceholder')}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">{t('emailAssistant.toneLabel')}</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="form-select"
          >
            {Object.keys({professional: '', friendly: '', formal: '', casual: '', persuasive: ''}).map((key) => (
              <option key={key} value={key}>
                {getToneLabel(key)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">{t('emailAssistant.contextLabel')}</label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder={t('emailAssistant.contextPlaceholder')}
          className="form-textarea"
          style={{ minHeight: "80px" }}
        />
      </div>

      <button
        type="button"
        onClick={generateEmail}
        disabled={isLoading || !purpose.trim()}
        className="btn"
      >
        {isLoading ? <div className="loading-spinner" /> : <Send size={16} />}
        {t('emailAssistant.generate')}
      </button>

      {result && (
        <div className="result-container">
          <div className="result-title">{t('emailAssistant.resultTitle')}</div>
          <div className="result-text">{result}</div>
        </div>
      )}
    </div>
  );
}
