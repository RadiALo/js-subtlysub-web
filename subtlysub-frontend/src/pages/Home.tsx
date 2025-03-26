import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostItem from "../components/PostItem";
import { Post } from "../types/Post";
import { Collection } from "../types/Collection";
import CollectionItem from "../components/CollectionItem";

const Home = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [myPosts, setMyPosts] = useState<Post[]>([]);

  const [myCollections, setMyCollections] = useState<Collection[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const url = new URL(`${apiUrl}/api/posts`);
        url.searchParams.append("authorId", user.id);
        const response = await fetch(url.toString());
    
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        
        const data = await response.json();
        setMyPosts(data);
      } catch (error) {
        console.error("Error fetching tags: ", error);
      }
    }

    fetchPosts();
  }, [apiUrl]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/collections/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch collections");
        }

        const data = await response.json();
        setMyCollections(data);
      } catch (error) {
        console.error("Error fetching collections: ", error)
      }
    };

    fetchCollections();
  }, [apiUrl])

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-6">
        Your Collections
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myCollections.map(collection => (
          <CollectionItem key={collection.id} collection={collection} />
        ))}
        
        <div
          className="relative bg-purple-100 rounded-lg shadow-md flex flex-col justify-center items-center
            transition-transform duration-300 ease-out hover:scale-105 hover:shadow-xl
            cursor-pointer p-6 border-4 border-dashed border-purple-400 text-gray-500"
          onClick={() => navigate('/collections/create')}
        >
          <span className="text-4xl">➕</span>
          <span className="mt-2 font-semibold">Create new Collection</span>
        </div>
      </div>

      <h1 className="mt-12 text-3xl font-bold text-white mb-6">Your Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myPosts.map(post => (
          <PostItem key={post.id} post={post} />
        ))}

        <div
          className="relative bg-purple-100 rounded-lg shadow-md flex flex-col justify-center items-center
            transition-transform duration-300 ease-out hover:scale-105 hover:shadow-xl
            cursor-pointer p-6 border-purple-400 border-4 border-dashed text-gray-500"
          onClick={() => navigate('/posts/create')}
        >
          <span className="text-4xl">➕</span>
          <span className="mt-2 font-semibold">Create new Post</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
