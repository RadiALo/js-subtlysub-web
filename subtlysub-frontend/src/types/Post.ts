import { Collection } from "./Collection";

export interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  pending: boolean;
  author: { id: string; username: string };
  tags: { id: string; name: string }[];
  cards: { id: number; word: string; translation: string; }[];
  linkedColl: Collection;
}
