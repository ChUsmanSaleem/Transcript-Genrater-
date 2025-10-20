const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface SignupData {
  username: string;
  email: string;
  password: string;
}

export async function signup(data: SignupData) {
  return fetch(`${API_BASE_URL}api/users/signup/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json());
}

export async function login(data: { email: string; password: string }) {
  return fetch(`${API_BASE_URL}api/users/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json());
}

export async function verifyEmail(token: string) {
  return fetch(`${API_BASE_URL}api/users/verify-email/?token=${token}`)
    .then(res => res.json());
}

export async function forgotPassword(email: string) {
  return fetch(`${API_BASE_URL}api/users/forgot-password/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  }).then(res => res.json());
}

export async function resetPassword(token: string, password: string) {
  return fetch(`${API_BASE_URL}api/users/reset-password/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
  }).then(res => res.json());
}

export async function summarize(youtubeUrl: string): Promise<{
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
  error?: string;
}> {
  const token = localStorage.getItem('access_token');
  return fetch(`${API_BASE_URL}api/transcript/summarize/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ youtube_url: youtubeUrl }),
  }).then(res => res.json());
}

export async function fetchHistory(): Promise<{
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
  created_at: string;
}[]> {
  const token = localStorage.getItem('access_token');
  return fetch(`${API_BASE_URL}api/transcript/history/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  }).then(res => res.json());
}

export async function deleteHistory(transcriptId: number): Promise<{ message?: string; error?: string }> {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${API_BASE_URL}api/transcript/history/${transcriptId}/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (response.ok) {
    return { message: 'Transcript deleted successfully' };
  } else {
    const errorData = await response.json().catch(() => ({ error: 'Failed to delete transcript' }));
    return errorData;
  }
}

