"use client";
import { useState } from "react";
import TranscriptForm from "../summrize/TranscriptForm";
import TranscriptDisplay from "../summrize/TranscriptDisplay";
import DownloadButtons from "../summrize/DownloadButtons";
import NaveBar from "../navebar/NaveBar";
import { summarize } from "../../../src/utils/api";
import { toast } from "react-toastify/unstyled";
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
}

export default function Page() {
  const [data, setData] = useState<TranscriptData | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const generateSummary = async (url: string) => {
    setLoading(true);
    setData(null);

    try {
      const result = await summarize(url);
      if (result.error) {
        alert(result.error);
      } else {
        setData(result);
      }
    } catch (err) {
      console.error(err);
      alert("Error generating summary");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <NaveBar onLogout={() => {}} />
      <div className="p-6">
        <TranscriptForm onSubmit={generateSummary} loading={loading} />

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
          />
          <DownloadButtons transcriptId={data.id} summary={data.summary} highlights={data.highlights} title={data.title} />
        </>
      )}
      </div>
    </div>
  );
}
