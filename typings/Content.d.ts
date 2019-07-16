interface IContent {
  id: number;
  title: string;
  user: {
    uuid: string;
    email: string;
    name: string;
    photo?: string;
    username: string;
  };
  question: {
    id: number;
    category: string;
    text: string;
  } | null;
  audio: string;
  audio_duration: number;
  image: string | null;
  related_link: string | null;
  num_link_clicked: number;
  num_hearts: number;
  heart_by_me: boolean;
  num_replies: number;
  num_played: number;
  hidden: boolean;
  featured: boolean;
  featured_bgidx: number;
  created_at: string;
  default_image_color_idx: number;
  default_image_pattern_idx: number;
}
