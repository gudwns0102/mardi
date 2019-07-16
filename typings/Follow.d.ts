interface IFollow {
  uuid: string;
  email: string;
  name: string;
  username: string | null;
  photo: string | null;
  follow_by_me: boolean;
}
