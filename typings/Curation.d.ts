interface ICuration {
  id: number;
  question: {
    id: number | null;
    category: string;
    text: string;
    audio: string | null;
  };
  num_contents: number;
}
