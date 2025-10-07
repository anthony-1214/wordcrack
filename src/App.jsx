import React, { useState, useEffect } from "react";
import wordData from "./data/words.json";
import WordDetail from "./WordDetail"; // ✅ 匯入外部元件

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setResults(wordData);
  }, []);

  function handleSearch() {
    const filtered = wordData.filter((item) =>
      item.key.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
    if (filtered.length > 0) setSelected(filtered[0]);
    else setSelected(null);
  }

  function handleKeyPress(e) {
    if (e.key === "Enter") handleSearch();
  }

  function clearSearch() {
    setQuery("");
    setResults(wordData);
    setSelected(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800 p-8">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">WordCrack · 拆字達人</h1>
        <p className="text-slate-600">
          查詢字根、字首與延伸學習的英文單字平台
        </p>
      </header>

      <div className="max-w-5xl mx-auto">
        <div className="flex gap-2 mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="輸入字根或單字，按 Enter 搜尋..."
            className="flex-1 border border-slate-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-slate-400"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition"
          >
            查詢
          </button>
          {query && (
            <button
              onClick={clearSearch}
              className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            >
              清除
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-[1fr_2fr] gap-4">
          <ResultList results={results} onSelect={setSelected} query={query} />

          {selected ? (
            <WordDetail item={selected} />
          ) : (
            <div className="text-center text-slate-500 mt-10">
              🔍 請輸入關鍵字或點選左方項目查看詳細內容
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultList({ results, onSelect, query }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-md max-h-[70vh] overflow-auto">
      <h2 className="text-lg font-semibold mb-3 text-slate-700">
        搜尋結果 ({results.length})
      </h2>

      {results.length === 0 && query && (
        <p className="text-slate-500 italic">❌ 沒有找到相關字根。</p>
      )}

      <ul className="divide-y divide-slate-100">
        {results.map((item) => (
          <li
            key={item.id}
            className="py-3 px-2 cursor-pointer rounded-xl hover:bg-slate-50 transition"
            onClick={() => onSelect(item)}
          >
            <div className="font-semibold text-slate-800">{item.key}</div>
            <div className="text-sm text-slate-600">{item.meaning}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
