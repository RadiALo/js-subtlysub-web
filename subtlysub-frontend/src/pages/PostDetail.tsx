import { Link, useParams } from "react-router-dom";
import { Post } from "../types/Post";
import { useEffect, useState } from "react";
import CardItem from "../components/CardItem";

const PostDetail = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const { id } = useParams();
  const [post, setPost] = useState<Post>();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const imagePath = () => {
    return `${apiUrl}${post?.imageUrl}`
  }

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(`${apiUrl}/api/posts/${id}`);

      if (!response.ok) {
        console.error("Failed to fetch post");
      }

      const data = await response.json();

      setPost(data);
    }

    fetchPost();
  }, [apiUrl])

  const handleApprove = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const response = await fetch(`${apiUrl}/api/posts/${post?.id}/approve`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to approve post");
    }

    if (!post) {
      return;
    }
    
    post.pending = false;
    setPost(post);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto mt-6 bg-white rounded-lg shadow-md">
        <div>
          <div className="overflow-hidden rounded-t-lg relative">
            <img 
              src={imagePath()}
              alt="Post image"
              className="w-full max-h-24 md:max-h-32 object-cover"
            />

            {post?.pending && (
              <div className="absolute top-2 right-2 bg-purple-500 text-white text-sm font-bold px-3 py-1 rounded-md">
                Pending
              </div>
            )}
          </div>

          <div className="ml-6 p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">{post?.title}</h1>

              <div className="flex gap-4 items-center flex-row-reverse">
                {(user.role === 'admin' || user.role === 'moderator' || user.id === post?.author.id) && <div>
                  <Link
                    to="./edit"
                    className="primary-button"
                  >
                    Edit
                  </Link>
                </div>}

                {post?.pending && (user.role === 'admin' || user.role === 'moderator') && <div>
                  <button
                    className="primary-button"
                    onClick={handleApprove}
                  >
                    Approve
                  </button>
                </div>}
              </div>
            </div>

            <p className="text-gray-500 text-sm">by {post?.author.username}</p>

            <div className="mt-4 mb-4">
              {post?.description}
            </div>

            
            <div className="mb-4 tag-container">
              {post?.tags?.map(tag => (
                <span
                  key={tag.id}
                  className="tag"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>

          { post?.cards && post.cards.length > 0 ? (
            <div className="ml-6 p-6">
              <h1 className="text-2xl font-bold text-gray-800">Vocabulary Preview:</h1>
              <ul className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {post.cards.slice(0, 10).map((card) => (
                  <li key={card.word}>
                    <CardItem card={card}/>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-4 text-gray-500">No words available</p>
          )}
        </div>
      </div>
    </>
  );
};

export default PostDetail;