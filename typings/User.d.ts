interface IUser {
  uuid: string;
  email: string;
  name: string;
  has_unread_feeds: boolean;
  signup_type: string;
  signup_date: string;
  username: string;
  tags: string[];
  photo: string;
  bg_photo: string;
  role: string;
  affiliation: string;
  introduction: {
    title: string;
    audio: string;
  } | null;
  introduction_text: string | null;
  onesignal_user_id: string;
  num_followers: number;
  num_followings: number;
  follow_by_me: boolean;
  num_contents: number;
  num_replies: number;
  num_played: number;
  num_unique_played: number;
  is_active: boolean;
}

interface IUserSettings {
  notification: boolean;
  streaming: boolean;
}
