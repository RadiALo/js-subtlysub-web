import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import PostCard from "../../components/element/PostCard";
import { Post } from "../../types/Post";
import { Collection } from "../../types/Collection";

const CollectionDetail = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const { id } = useParams();
  const [collection, setCollection] = useState<Collection>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    if (!token) {
      return;
    }

    const response = await fetch(`${apiUrl}/api/collections/${collection?.id}`, {
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

  useEffect(() => {
    const fetchCollection = async () => {
      const response = await fetch(`${apiUrl}/api/collections/${id}`, {
        headers: { Authorization: `Beaver: ${token}` },
      });

      if (!response.ok) {
        console.error("Failed to fetch collection");
        return;
      }

      const data = await response.json();
      console.log(data);
      setCollection(data);
    };

    fetchCollection();
  }, [apiUrl]);

  return (
    <>
      <div className="max-w-6xl mx-auto mt-6 bg-white rounded-lg shadow-md">
        <div className="overflow-hidden rounded-t-lg relative">
          <img
            src={`${apiUrl}${collection?.imageUrl}`}
            alt="Post image"
            className="w-full max-h-64 object-cover"
          />
        </div>

        <div className="px-6 pb-4">
          <div className="p-6 flex justify-between items-start">
            <div className="w-xl">
              <h1 className="text-2xl font-bold text-gray-800">
                {collection?.name}
              </h1>
              <p className="text-gray-500 text-sm">
                by {collection?.owner.username}
              </p>

              <div className="mt-4 mb-4">{collection?.description}</div>
            </div>
            {(user.role === 'admin' || user.role === 'moderator' || user.id === collection?.owner.id) &&
                <div className="flex gap-4 items-center flex-row-reverse">
                  {(collection?.name !== "Favorites" && (user.role === 'admin' || user.role === 'moderator' || user.id === collection?.owner.id)) && <div>
                    <button
                      className="red-button"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Delete
                    </button>
                  </div>}

                  {(collection?.name !== "Favorites" && (user.role === 'admin' || user.role === 'moderator'
                      || user.id === collection?.owner.id)) && <div>
                    <Link
                      to="./edit"
                      className="primary-button"
                    >
                      Edit
                    </Link>
                  </div>}
                </div>
              }
          </div>
          { collection?.posts && collection.posts.length > 0 ? (
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800">Posts</h1>
                <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {collection.posts.map((post: Post) => (
                    <PostCard post={post}/>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-4 text-gray-500">No posts available</p>
            )}
        </div>
      </div>

      {isModalOpen && <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-bold">Are you sure you want to delete this collection?</h2>
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

export default CollectionDetail;
