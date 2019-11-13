type MagazineContent = {
  id: number;
  title: string;
  text: string;
  audio?: string;
  num_replies?: number;
  num_played?: number;
  audio_duration?: number;
  picture?: string;
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
