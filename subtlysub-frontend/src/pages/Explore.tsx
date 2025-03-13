import { useEffect, useState } from "react";
import PostItem from "../components/PostItem";
import { Post } from "../types/Post";

const Explore = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/posts`);
    
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching tags: ", error);
      }
    }

    fetchPosts();
  }, [apiUrl]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Explore Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map(post => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Explore;
