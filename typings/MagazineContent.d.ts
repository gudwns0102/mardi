type MagazineContent = {
  id: number;
  magazine: {
    id: number;
  };
  title: string;
  text: string;
  audio?: string;
  num_replies: number;
  num_played: number;
  num_hearts: number;
  heart_by_me: boolean;
  audio_duration: number;
  picture?: string | null;
  user_name?: string;
  user_thumbnail?: string;
  link_user?: {
    id: number;
    uuid?: string;
    email?: string;
    username?: string;
    name?: string;
    photo?: string;
  };
};
