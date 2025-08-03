import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { OllamaProvider } from "./contexts/OllamaContext";
import App from "./App";
import "./index.css";

const Root = () => {
  const AppWithCtx = (
    <OllamaProvider>
      <App />
    </OllamaProvider>
  );

  if (import.meta.env.DEV) {
    return AppWithCtx;
  }

  return <StrictMode>{AppWithCtx}</StrictMode>;
};

createRoot(document.getElementById("root")).render(<Root />);
