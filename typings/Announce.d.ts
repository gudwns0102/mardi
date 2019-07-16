interface IAnnounce {
  id: number;
  title: string;
  content: string;
  audio: string | null;
  num_viewed: number;
  created_at: string;
}
