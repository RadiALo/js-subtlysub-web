import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PostItem from "./PostItem";
import { Post } from "../types/Post";

interface PostListProps {
  url: string;
  title: string;
  authorization?: boolean;
}

const PostList = ({ url, title, authorization = false }: PostListProps) => {
  const { t } = useTranslation();

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [posts, setPosts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);

  const loadMore = () => {
    setVisibleCount(visibleCount + 6);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = authorization
          ? await fetch(`${apiUrl}${url}`)
          : await fetch(`${apiUrl}${url}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        console.log(data);
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">{title}</h1>

      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post: Post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-white">{t("noPostsFounded")}</p>
      )}

      {visibleCount < posts.length && (
        <div className="m-auto flex justify-center w-60">
          <button onClick={loadMore} className="primary-button">
            {t("loadMore")}
          </button>
        </div>
      )}
    </div>
  );
};

export default PostList;
