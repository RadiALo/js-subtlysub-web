export interface Post {
  id: string;
  title: string;
  description: string;
  author: { id: string; username: string };
  tags: { id: string; name: string }[];
  cards: { id: number; word: string; translation: string; }[];
}
