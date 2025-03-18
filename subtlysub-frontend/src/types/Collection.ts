import { Post } from './Post';

export interface Collection {
  id: string;
  name: string;
  description: string;
  imageUrl: string;  
  owner: { id: string; username: string };
  posts: Post[];
}
