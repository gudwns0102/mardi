interface IQuestion {
  id: number;
  category: string;
  text: string;
  audio: string | null;
  answered_by_me: boolean;
  new: boolean;
  hot: boolean;
  num_contents: number;
  hidden: boolean;
  created_at: string;
}

interface IDefaultQuestion {
  id: number;
  text: string;
  num_clicked: number;
  created_at: string;
}
