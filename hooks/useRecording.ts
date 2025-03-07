// hooks/useRecording.ts
import { useEffect, useState } from "react";

interface Recording {
  id: string;
  clerk_user_id: string;
  recording_url: string;
  title: string;
  description: string;
  duration: string;
  created_at: string;
  updated_at: string;
}

const fetchRecordings = async () => {
  const res = await fetch("/api/videos/get-videos");

  if (!res.ok) {
    throw new Error("Failed to fetch recordings");
  }

  return res.json();
};

const useRecording = () => {
  const [data, setData] = useState<Recording[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getData() {
      try {
        const recordings = await fetchRecordings();
        setData(recordings);
      } catch (error) {
        setError("Failed to fetch recordings");
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, []);

  // Function to get recordings for a specific clerk ID
  const getRecordingsByClerkId = (clerkId: string) => {
    return data.filter((recording) => recording.clerk_user_id === clerkId);
  };

  return {
    data,
    loading,
    error,
    refetch: fetchRecordings,
    getRecordingsByClerkId,
  };
};

export default useRecording;
