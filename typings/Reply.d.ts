type ReplyType = "audio" | "text";

interface ITaggedUser {
  uuid: IUser["uuid"];
  username: IUser["username"];
}

interface ITextReply {
  id: number;
  user: {
    uuid: string;
    email: string;
    name: string;
    username: string;
    photo?: string;
  };
  type: "text";
  text: string;
  tagged_user: ITaggedUser | null;
  hidden: boolean;
  created_at: string;
}

interface IAudioReply {
  id: number;
  user: {
    uuid: string;
    email: string;
    name: string;
    username: string;
    photo: string;
  };
  type: "audio";
  audio: string;
  audio_duration: number;
  tagged_user: ITaggedUser | null;
  hidden: boolean;
  created_at: string;
}

type IReply = ITextReply | IAudioReply;
