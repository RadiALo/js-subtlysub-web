import { useNavigate } from "react-router-dom";
import { Collection } from "../types/Collection";

export interface CollectionProps {
  collection: Collection;
}

const CollectionItem = ({ collection }: CollectionProps) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  return (
    <div
      className="relative bg-white rounded-lg shadow-md transition-transform duration-300 ease-out
                  hover:scale-105 hover:shadow-xl hover:bg-blue-50 cursor-pointer"
      onClick={() => navigate(`/collections/${collection.id}`)}
      role="button"
    >
      <div className="overflow-hidden rounded-t-lg">
        <img 
          src={`${apiUrl}${collection.imageUrl}`}
          alt="Collection image" 
          className="w-full max-h-32 object-cover"
        />
      </div>

      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800">{collection.name}</h2>
        <p className="text-sm text-gray-500">by {collection.owner.username}</p>
        <p className="text-gray-700 mt-2 h-14">
          {collection.description.length < 60 
            ? collection.description 
            : `${collection.description.slice(0, 60).trim()}...`}
        </p>

        <div className="text-sm text-gray-500 mt-2">
          {collection.posts.length} {collection.posts.length === 1 ? "post" : "posts"}
        </div>
      </div>
    </div>
  );
};

export default CollectionItem;
