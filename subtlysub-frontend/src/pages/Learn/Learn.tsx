import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Post } from "../../types/Post";

const Learn = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [post, setPost] = useState<Post>();
  const [progress, setProgress] = useState<string[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      const postResponse = await fetch(`${apiUrl}/api/posts/${id}`);

      if (!postResponse.ok) {
        console.error("Failed to fetch post");
        return;
      }

      const favoriteCollectionResponse = await fetch(
        `${apiUrl}/api/collections/favorite`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!favoriteCollectionResponse.ok) {
        console.error("Failed to fetch favorite collection");
        return;
      }

      const post = await postResponse.json();
      const favoriteCollection = await favoriteCollectionResponse.json();
      if (favoriteCollection.posts.some((p: Post) => p.id === post.id)) {
        post.favorite = true;
      }

      setPost(post);
    };

    const fetchProgress = async () => {
      const progressResponse = await fetch(`${apiUrl}/api/progress/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    };
    fetchPost();
  }, [apiUrl, token, id]);

  return (
    <div className="max-w-6xl mx-auto mt-6 bg-white rounded-lg shadow-md">
      <div className="overflow-hidden rounded-t-lg relative">
          <img
            src={`${apiUrl}${post?.imageUrl}`}
            alt="Post image"
            className="w-full max-h-64 object-cover"
          />

          {post?.pending && (
            <div className="absolute top-2 right-2 bg-purple-500 text-white text-sm font-bold px-3 py-1 rounded-md">
              Pending
            </div>
          )}
      </div>

      <div className="px-6 pb-4">
        <div className="p-6 flex justify-between items-start">
            <div className="w-xl">
              <h1 className="text-2xl font-bold text-gray-800">
                {post?.title}
              </h1>

              <p className="text-gray-500 text-sm">
                by {post?.author.username}
              </p>

              <div className="mb-4 tag-container">
                {post?.tags?.map((tag) => (
                  <span key={tag.id} className="tag">
                    {tag.name}
                  </span>
                ))}
              </div>

              <div className="mt-4 mb-4">{post?.description}</div>
            </div>
        </div>

        <div>

        </div>
      </div>
    </div>
  );
}

export default Learn;