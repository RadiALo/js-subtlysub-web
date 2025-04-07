import { useNavigate } from "react-router-dom";
import { Post } from "../types/Post";
import { useTranslation } from 'react-i18next';

export interface PostProps {
  post: Post;
}

const PostItem = ({ post }: PostProps) => {
  const { t } = useTranslation();

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const imagePath = () => {
    return `${apiUrl}${post.imageUrl}`
  }

  return (
    <div
      className="relative bg-white rounded-lg shadow-md transition-transform duration-300 ease-out
                  hover:scale-105 hover:shadow-xl hover:bg-purple-50 cursor-pointer"
      onClick={() => navigate(`/posts/${post.id}`)}
      role="button"
    >
      {post.pending && (
        <span className="absolute top-2 right-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
          Pending
        </span>
      )}
      
      <div className="overflow-hidden rounded-t-lg">
        <img 
          src={imagePath()}
          alt="Post image" 
          className="w-full h-32 object-cover"
        />
      </div>

      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800">{post.title}</h2>
        <p className="text-sm text-gray-500">{t('by')} {post.author.username}</p>
        <p className="text-gray-700 mt-2 h-14">{post.description.length < 60 ? post.description : `${post.description.slice(0, 60).trim()}...`}</p>

        <div className="tag-container">
          {post.tags.slice(0, 3).map(tag => (
            <span
              key={tag.id}
              className="tag"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default PostItem;
