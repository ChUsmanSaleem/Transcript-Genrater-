"use client";

import { useState } from "react";
import { Youtube, Loader2 } from "lucide-react";

interface TranscriptFormProps {
  onSubmit: (url: string) => void;
  loading: boolean;
}

export default function TranscriptForm({ onSubmit, loading }: TranscriptFormProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    onSubmit(url);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-gray-900/60 backdrop-blur-md border border-gray-700 rounded-2xl shadow-xl p-6">
      <h2 className="flex items-center gap-2 text-2xl font-semibold text-white mb-6">
        <Youtube className="w-6 h-6 text-red-500" />
        YouTube Transcript Generator
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="🎥 Paste YouTube video link..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 p-3 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-500 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        />

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" /> Generating...
            </>
          ) : (
            <>Generate Summary</>
          )}
        </button>
      </form>

      <p className="text-sm text-gray-400 mt-3 text-center">
        Paste any public YouTube video link to generate its transcript and summary.
      </p>
    </div>
  );
}
