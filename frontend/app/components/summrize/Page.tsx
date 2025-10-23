"use client";
import { useState } from "react";
import { Lock, Globe } from "lucide-react";
import TranscriptForm from "../summrize/TranscriptForm";
import TranscriptDisplay from "../summrize/TranscriptDisplay";
import DownloadButtons from "../summrize/DownloadButtons";
import NaveBar from "../navebar/NaveBar";
import { summarize } from "../../../src/utils/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface TranscriptData {
  id: number;
  video_id?: string;
  title?: string;
  channel_name?: string;
  thumbnail_url?: string;
  duration?: string;
  publish_date?: string;
  transcript: string;
  summary: string;
  highlights?: string[];
  key_moments?: { timestamp: string; moment: string }[];
  topics?: string[];
  quotes?: string[];
  sentiment?: string;
  host_name?: string;
  guest_name?: string;
  visibility?: string;
}

export default function Page() {
  const [data, setData] = useState<TranscriptData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const router = useRouter();

  const generateSummary = async (url: string) => {
    setLoading(true);
    setData(null);

    try {
      const result = await summarize(url, "PRIVATE"); // Default to private
      if (result.error) {
        toast.error(result.error);
      } else {
        setData(result);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error generating summary");
    }

    setLoading(false);
  };

  const updateVisibility = async (visibility: string) => {
    if (!data) return;

    try {
      setData({ ...data, visibility });
      setShowVisibilityModal(false);
      toast.success("Visibility updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Error updating visibility");
    }
  };

  return (
    <div className="min-h-screen">
      <NaveBar onLogout={() => {}} />
      <div className="p-6">
        <TranscriptForm onSubmit={generateSummary} loading={loading} />

        {showVisibilityModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-white mb-4">Set Transcript Visibility</h3>
              <p className="text-gray-300 mb-6">Choose whether this transcript should be public or private.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => updateVisibility("PRIVATE")}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition"
                >
                  <Lock className="w-4 h-4" />
                  Private
                </button>
                <button
                  onClick={() => updateVisibility("PUBLIC")}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition"
                >
                  <Globe className="w-4 h-4" />
                  Public
                </button>
              </div>
            </div>
          </div>
        )}

      {loading && <p className="text-center mt-4">Processing video, please wait...</p>}

      {data && (
        <>
          <TranscriptDisplay
            transcript={data.transcript}
            summary={data.summary}
            highlights={data.highlights}
            video_id={data.video_id}
            title={data.title}
            channel_name={data.channel_name}
            thumbnail_url={data.thumbnail_url}
            duration={data.duration}
            publish_date={data.publish_date}
            key_moments={data.key_moments}
            topics={data.topics}
            quotes={data.quotes}
            sentiment={data.sentiment}
            host_name={data.host_name}
            guest_name={data.guest_name}
            visibility={data.visibility}
            onVisibilityChange={() => setShowVisibilityModal(true)}
          />
          <DownloadButtons transcriptId={data.id} summary={data.summary} highlights={data.highlights} title={data.title} />
        </>
      )}
      </div>
    </div>
  );
}
