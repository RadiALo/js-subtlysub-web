import { Link, useParams, useNavigate } from "react-router-dom";
import { Post } from "../../types/Post";
import { useEffect, useState } from "react";
import CardItem from "../../components/CardItem";


const PostDetail = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [post, setPost] = useState<Post>();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      const postResponse = await fetch(`${apiUrl}/api/posts/${id}`);

      if (!postResponse.ok) {
        console.error("Failed to fetch post");
        return;
      }

      const favoriteCollectionResponse = await fetch(`${apiUrl}/api/collections/favorite`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

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
    }

    fetchPost();
  }, [apiUrl])

  const handleApprove = async () => {
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

  const handleDelete = async () => {
    if (!token) {
      return;
    }

    const response = await fetch(`${apiUrl}/api/posts/${post?.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      return;
    }

    navigate(-1);
  }

  const toggleFavorite = async () => {
    if (!token) {
      return;
    }

    const action = post?.favorite ? "remove" : "add";

    const response = await fetch(`${apiUrl}/api/collections/favorite/${post?.id}/${action}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      console.error("Failed to add post to favorite collection");
      return;
    }

    post.favorite = !post.favorite;
    setPost({...post});
  }

  return (
    <>
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
                <h1 className="text-2xl font-bold text-gray-800">{post?.title}</h1>
                <p className="text-gray-500 text-sm">by {post?.author.username}</p>

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

                <div className="mt-4 mb-4">
                  {post?.description}
                </div>

                <div className="flex justify-end items-center gap-4 mt-4">
                  <button className="px-4 py-2 inline-block font-semibold text-white bg-purple-500 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400">
                    Add to
                  </button>

                  <button
                    className="font-bold text-lg px-4 py-2 bg-purple-500 text-white 
                              rounded-full shadow-md hover:bg-purple-600 active:scale-95 
                              transition-all duration-200"
                    onClick={toggleFavorite}
                  >
                    { post?.favorite ? "❤️" : "🤍" }
                  </button>
                </div>
              </div>

              {post?.linkedColl && (
                <div className="py-4 px-6 bg-purple-400 text-white shadow-lg shadow-purple-600/30 rounded-xl 
                              hover:shadow-xl hover:bg-purple-500 transition-shadow transition-color flex flex-col items-center 
                              text-center cursor-pointer"
                  onClick={() => navigate(`/collections/${post.linkedColl.id}`)}
                >
                  <span className="text-sm font-semibold tracking-wide">Discover more:</span>
                  
                  <img 
                    src={`${apiUrl}${post.linkedColl.imageUrl}`} 
                    alt="Linked collection image" 
                    className="w-48 h-28 object-cover rounded-lg mt-4 mb-4"
                  />
                  
                  <span className="text-lg font-semibold">{post.linkedColl.name}</span>
                </div>
              )}


              {(user.role === 'admin' || user.role === 'moderator' || user.id === post?.author.id) &&
                <div className="flex gap-4 items-center flex-row-reverse">
                  {(user.role === 'admin' || user.role === 'moderator' || user.id === post?.author.id) && <div>
                    <button
                      className="red-button"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Delete
                    </button>
                  </div>}

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
              }
              
            </div>

          { post?.cards && post.cards.length > 0 ? (
            <div className="p-6">
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

      {isModalOpen && <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-bold">Are you sure you want to delete this post?</h2>
            <span className="text-gray-600 block mb-4">Data cannot be restored</span>

            <div className="flex justify-center gap-4">
              <button className="red-button"
                onClick={handleDelete}
              >
                Yes
              </button>
              
              <button className="green-button"
                onClick={() => setIsModalOpen(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>}
    </>
  );
};

export default PostDetail;