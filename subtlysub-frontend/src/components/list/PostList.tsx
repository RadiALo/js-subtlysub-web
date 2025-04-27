import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PostItem from "../element/PostItem";
import { Post } from "../../types/Post";

interface PostListProps {
  link: string;
  title: string;
  authorization?: boolean;
  createLink?: boolean;
  parameters?: Map<string, string> | undefined;
}

const PostList = ({
  link,
  title,
  authorization = false,
  createLink = false,
  parameters = undefined,
}: PostListProps) => {
  const { t } = useTranslation();

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);

  const loadMore = () => {
    setVisibleCount(visibleCount + 6);
  };

  useEffect(() => {
    const url = new URL(`${apiUrl}${link}`);

    if (parameters) {
      parameters.forEach((value, key) => {
        url.searchParams.append(key, value);
      });
    }

    const fetchPosts = async () => {
      try {
        const response = authorization
          ? await fetch(`${url.toString()}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
          : await fetch(`${url.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };

    fetchPosts();
  }, [apiUrl, link, authorization, token, parameters]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">{title}</h1>

      {(posts && posts.length > 0) || createLink ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.slice(0, visibleCount).map((post: Post) => (
            <PostItem key={post.id} post={post} />
          ))}

          {createLink && (
            <div
              className="relative bg-purple-100 rounded-lg shadow-md flex flex-col justify-center items-center
              transition-transform duration-300 ease-out hover:scale-105 hover:shadow-xl
              cursor-pointer p-6 border-purple-400 border-4 border-dashed text-gray-500"
              onClick={() => navigate("/posts/create")}
            >
              <span className="text-4xl">➕</span>
              <span className="mt-2 font-semibold">{t("createNewPost")}</span>
            </div>
          )}
        </div>
      ) : (
        <p className="text-white">{t("noPostsFound")}</p>
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
