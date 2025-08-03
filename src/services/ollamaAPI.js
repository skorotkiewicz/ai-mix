const OLLAMA_BASE_URL = "http://localhost:11434";

export class OllamaAPI {
  static async generateText(prompt, model = "llama3.2", options = {}) {
    try {
      const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            ...options,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Ollama API Error:", error);
      throw new Error(
        "Failed to connect to Ollama. Make sure Ollama is running on localhost:11434",
      );
    }
  }

  static async streamChat(messages, model = "llama3.2", onChunk) {
    try {
      const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Failed to get response reader");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim());

        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.message?.content) {
              onChunk(parsed.message.content);
            }
          } catch (e) {
            // Skip invalid JSON lines
          }
        }
      }
    } catch (error) {
      console.error("Ollama Stream Error:", error);
      throw new Error(
        "Failed to connect to Ollama. Make sure Ollama is running on localhost:11434",
      );
    }
  }

  static async getAvailableModels() {
    try {
      const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.models || [];
    } catch (error) {
      console.error("Failed to get models:", error);
      return [];
    }
  }
}
