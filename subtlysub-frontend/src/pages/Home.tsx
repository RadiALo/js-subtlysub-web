import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostItem from "../components/PostItem";
import { Post } from "../types/Post";
import { Collection } from "../types/Collection";
import CollectionItem from "../components/CollectionItem";
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();


  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const navigate = useNavigate();

  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [recentVisibleCount, setRecentVisibleCount] = useState(6);

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
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/posts/recent`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
    
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        
        const data = await response.json();
        setRecentPosts(data);
      } catch (error) {
        console.error("Error fetching tags: ", error);
      }
    }

    fetchPosts();
  }, [apiUrl]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/collections`, {
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


  const loadMoreRecent = () => {
    setRecentVisibleCount(prev => prev + 6);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-6">
        {t('continueStudying')}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {recentPosts.slice(0, recentVisibleCount).map(post => (
          <PostItem key={post.id} post={post} />  
        ))}
      </div>
      {recentVisibleCount < recentPosts.length && (
        <div className="m-auto flex justify-center w-60">
          <button
            onClick={loadMoreRecent}
            className="primary-button"
          >
            {t('loadMore')}
          </button>
        </div>
      )}
      <h1 className="mt-12 text-3xl font-bold text-white mb-6">
        {t('yourCollections')}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myCollections.slice(0, 10).map(collection => (
          <CollectionItem key={collection.id} collection={collection} />
        ))}
        
        <div
          className="relative bg-purple-100 rounded-lg shadow-md flex flex-col justify-center items-center
            transition-transform duration-300 ease-out hover:scale-105 hover:shadow-xl
            cursor-pointer p-6 border-4 border-dashed border-purple-400 text-gray-500"
          onClick={() => navigate('/collections/create')}
        >
          <span className="text-4xl">➕</span>
          <span className="mt-2 font-semibold">{t('createNewCollection')}</span>
        </div>
      </div>

      <h1 className="mt-12 text-3xl font-bold text-white mb-6">
        {t('yourPosts')}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myPosts.slice(0, 10).map(post => (
          <PostItem key={post.id} post={post} />
        ))}

        <div
          className="relative bg-purple-100 rounded-lg shadow-md flex flex-col justify-center items-center
            transition-transform duration-300 ease-out hover:scale-105 hover:shadow-xl
            cursor-pointer p-6 border-purple-400 border-4 border-dashed text-gray-500"
          onClick={() => navigate('/posts/create')}
        >
          <span className="text-4xl">➕</span>
          <span className="mt-2 font-semibold">{t('createNewPost')}</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
