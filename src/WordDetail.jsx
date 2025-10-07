import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

function WordDetail({ item }) {
  const [aiExample, setAiExample] = useState("");
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("favorites") || "[]");
  });

  const isFavorite = favorites.includes(item.key);

  // 初始化 Gemini
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // 🧠 隨機例句（離線）
  function generateRandomExample() {
    const examples = [
      `The ${item.key} project inspired many students.`,
      `Learning about ${item.key} helps us understand word roots.`,
      `The teacher used ${item.key} to explain how English words are formed.`,
    ];
    const random = examples[Math.floor(Math.random() * examples.length)];
    setAiExample(random);
  }

  // 🤖 Gemini AI 例句
  async function generateAIExample() {
    setLoading(true);
    try {
      const prompt = `請用英文寫一句包含字根 "${item.key}" 的簡單句子，下一行以繁體中文解釋句意。`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      setAiExample(text);
    } catch (error) {
      console.error(error);
      setAiExample("⚠️ 無法取得 AI 回應，請稍後再試。");
    } finally {
      setLoading(false);
    }
  }

  // ⭐ 收藏功能
  function toggleFavorite() {
    const updated = isFavorite
      ? favorites.filter((w) => w !== item.key)
      : [...favorites, item.key];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">{item.key}</h2>
        <button
          onClick={toggleFavorite}
          className="text-2xl text-yellow-400 hover:scale-110 transition"
          title="加入收藏"
        >
          {isFavorite ? "⭐" : "☆"}
        </button>
      </div>

      <p className="text-slate-700 text-lg mb-1">{item.meaning}</p>
      <p className="text-sm text-slate-500 italic">{item.notes}</p>

      <div className="mt-4">
        <h3 className="font-semibold text-slate-800">📘 例字：</h3>
        <ul className="mt-2 list-disc pl-5 text-slate-700">
          {item.examples.map((ex) => (
            <li key={ex}>{ex}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold text-slate-800">🌍 延伸單字：</h3>
        <ul className="mt-2 list-disc pl-5 text-slate-700">
          {item.related.map((r) => (
            <li key={r.word}>
              <strong>{r.word}</strong> — {r.meaning}
              <div className="text-sm text-slate-500 italic">{r.example}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 text-center space-x-2">
        <button
          onClick={generateRandomExample}
          className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition"
        >
          🎲 隨機例句
        </button>

        <button
          onClick={generateAIExample}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          ✨ {loading ? "AI 正在生成..." : "AI 例句生成"}
        </button>

        {aiExample && (
          <p className="mt-3 text-slate-700 italic border-t pt-3 whitespace-pre-line">
            {aiExample}
          </p>
        )}
      </div>
    </div>
  );
}

export default WordDetail;
