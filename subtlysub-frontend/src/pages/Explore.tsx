import { useEffect, useState } from "react";
import PostItem from "../components/PostItem";
import { Post } from "../types/Post";

const Explore = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [newestPosts, setNewestPosts] = useState<Post[]>([]);
  const [newestVisibleCount, setNewestVisibleCount] = useState(6);

  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [trendingVisibleCount, setTrendingVisibleCount] = useState(6);

  const [pendingPosts, setPendingPosts] = useState<Post[]>([]);
  const [pendingPostsVisibleCount, setPendingPostsVisibleCount] = useState(6);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/posts`);

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        setNewestPosts(data);
      } catch (error) {
        console.error("Error fetching tags: ", error);
      }
    };

    fetchPosts();
  }, [apiUrl]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/posts/trending`);

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        setTrendingPosts(data);
      } catch (error) {
        console.error("Error fetching tags: ", error);
      }
    };

    fetchPosts();
  }, [apiUrl]);

  useEffect(() => {
    if (user.role !== "admin" && user.role !== "moderator") {
      return;
    }

    const fetchPosts = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/posts/pending`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        setPendingPosts(data);
      } catch (error) {
        console.error("Error fetching tags: ", error);
      }
    };

    fetchPosts();
  }, [apiUrl]);

  const loadMoreNewest = () => {
    setNewestVisibleCount(newestVisibleCount + 6);
  };

  const loadMoreTrending = () => {
    setTrendingVisibleCount(trendingVisibleCount + 6);
  };

  const loadMorePending = () => {
    setPendingPostsVisibleCount(pendingPostsVisibleCount + 6);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Trending Posts</h1>

      {trendingPosts && trendingPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingPosts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-white">No trending posts found</p>
      )}
      {trendingVisibleCount < trendingPosts.length && (
        <div className="m-auto flex justify-center w-60">
          <button onClick={loadMoreTrending} className="primary-button">
            Load More
          </button>
        </div>
      )}

      <h1 className="mt-12 text-3xl font-bold text-white mb-6">Newest Posts</h1>
      {newestPosts && newestPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {newestPosts.slice(0, newestVisibleCount).map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-white">No newest posts found</p>
      )}
      {newestVisibleCount < newestPosts.length && (
        <div className="m-auto flex justify-center w-60">
          <button onClick={loadMoreNewest} className="primary-button">
            Load More
          </button>
        </div>
      )}

      {(user.role === "admin" || user.role == "moderator") && (
        <>
          <h1 className="mt-12 text-3xl font-bold text-white mb-6">
            Pending Posts
          </h1>

          {pendingPosts && pendingPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingPosts.map((post) => (
                <PostItem key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-white">No pending posts found</p>
          )}

          {pendingPostsVisibleCount < pendingPosts.length && (
            <div className="m-auto flex justify-center w-60">
              <button onClick={loadMorePending} className="primary-button">
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Explore;
