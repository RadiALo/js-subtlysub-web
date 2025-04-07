import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostItem from "../components/element/PostItem";
import PostList from "../components/list/PostList";
import { Post } from "../types/Post";
import { Collection } from "../types/Collection";
import CollectionItem from "../components/element/CollectionItem";
import { useTranslation } from 'react-i18next';
import CollectionList from "../components/list/CollectionList";

const Home = () => {
  const { t } = useTranslation();


  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const navigate = useNavigate();

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



  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col gap-12">
      <PostList title={t('continueStudying')} link="/api/posts/recent" authorization={true} />

      <CollectionList title={t('yourCollections')} link="/api/collections" authorization={true} createLink={true} />

      <PostList title={t('yourPosts')} link={`/api/posts`} authorization={true} createLink={true} parameters={new Map([['authorId', user.id]])}/>
    </div>
  );
};

export default Home;
