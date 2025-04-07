import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Post } from "../types/Post";
import PostSearch from "./element/PostSearch";

export default function SearchBar() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const search = async (query: string) => {
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/posts/search?q=${query}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Помилка пошуку:", error);
      setResults([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      search(query);
    }, 600);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [query]);

  return (
    <div className="relative w-full max-w-md">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
        🔍
      </span>

      <input
        onFocus={() => {setFocused(true)}} onBlur={() => {setFocused(false)}} 
        type="text"
        placeholder={t("search")}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2 placeholder-gray-600 text-black bg-white max-w-md border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      {focused && query && query.trim() != "" &&
        (!loading ? (
          results && results.length > 0 ? (
            <div className="absolute z-10 mt-2 w-full bg-white border rounded-2xl shadow-lg max-h-60 overflow-y-auto">
              <ul className="divide-y divide-gray-200">
                  {results.map((post) => (
                    <PostSearch
                      post={post}
                      key={post.id}
                      onClick={() => {setQuery("")}}
                    />
                  ))}
              </ul>
            </div>
          ) : (
            <div className="absolute z-10 mt-2 w-full bg-white border rounded-2xl shadow-lg max-h-60 overflow-y-auto">
              <p className="p-4 text-gray-500">{t("noResults")}</p>
            </div>
          )
        ) : (
          <div className="absolute z-10 mt-2 w-full bg-white border rounded-2xl shadow-lg max-h-60 overflow-y-auto">
            <p className="p-4 text-gray-500">{t("loading")}</p>
          </div>
        ))
      }
    </div>
  );
}
