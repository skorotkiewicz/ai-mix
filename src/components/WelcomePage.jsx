import { Bot, Zap, Shield } from "lucide-react";
import useTranslate from "../utils/useTranslate";

export function WelcomePage() {
  const { t } = useTranslate();

  const features = [
    {
      icon: <Bot size={24} />,
      titleKey: "welcome.features.chat.title",
      descriptionKey: "welcome.features.chat.description",
    },
    {
      icon: <Zap size={24} />,
      titleKey: "welcome.features.generator.title",
      descriptionKey: "welcome.features.generator.description",
    },
    {
      icon: <Shield size={24} />,
      titleKey: "welcome.features.local.title",
      descriptionKey: "welcome.features.local.description",
    },
  ];

  return (
    <div className="welcome-page">
      <div className="welcome-hero">
        <div className="welcome-hero-content">
          <Bot size={64} className="welcome-logo" />
          <h1 className="welcome-title">{t("welcome.title")}</h1>
          <p className="welcome-subtitle">{t("welcome.subtitle")}</p>
        </div>
      </div>

      <div className="welcome-features">
        <h2 className="welcome-section-title">{t("welcome.featuresTitle")}</h2>
        <div className="welcome-features-grid">
          {features.map((feature, index) => (
            <div key={index} className="welcome-feature-card">
              <div className="welcome-feature-icon">{feature.icon}</div>
              <h3 className="welcome-feature-title">{t(feature.titleKey)}</h3>
              <p className="welcome-feature-description">{t(feature.descriptionKey)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="welcome-getting-started">
        <h2 className="welcome-section-title">{t("welcome.gettingStarted.title")}</h2>
        <div className="welcome-steps">
          <div className="welcome-step">
            <div className="welcome-step-number">1</div>
            <div className="welcome-step-content">
              <h4>{t("welcome.gettingStarted.step1.title")}</h4>
              <p>{t("welcome.gettingStarted.step1.description")}</p>
            </div>
          </div>
          <div className="welcome-step">
            <div className="welcome-step-number">2</div>
            <div className="welcome-step-content">
              <h4>{t("welcome.gettingStarted.step2.title")}</h4>
              <p>{t("welcome.gettingStarted.step2.description")}</p>
            </div>
          </div>
          <div className="welcome-step">
            <div className="welcome-step-number">3</div>
            <div className="welcome-step-content">
              <h4>{t("welcome.gettingStarted.step3.title")}</h4>
              <p>{t("welcome.gettingStarted.step3.description")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
