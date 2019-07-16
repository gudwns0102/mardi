interface IFeed {
  id: number;
  text: string;
  time: string;
  related_user: {
    uuid: string;
    name: string;
    username: string | null;
    photo: string | null;
  };
  content: {
    id: number;
    title: string;
    image: string | null;
    default_image_color_idx: number;
    default_image_pattern_idx: number;
  } | null;
  is_read: boolean;
  onesignal_extra_data: FeedNavigateAction;
}

type FeedNavigateAction =
  | {
      action: "navigateContent";
      contentId: number;
    }
  | {
      action: "navigateUser";
      userId: string;
    };
