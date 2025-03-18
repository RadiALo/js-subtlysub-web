import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostItem from "../components/PostItem";
import PostCard from "../components/PostCard";

const CollectionDetail = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const { id } = useParams();
  const [collection, setCollection] = useState<Collection>();

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
            
          </div>
          { collection?.posts && collection.posts.length > 0 ? (
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800">Posts</h1>
                <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {collection.posts.map((post) => (
                    <PostCard post={post}/>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-4 text-gray-500">No posts available</p>
            )}
        </div>
      </div>
    </>
  );
};

export default CollectionDetail;
