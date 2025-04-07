import { useNavigate } from "react-router-dom";
import { Post } from "../../types/Post";

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  return (
    <li className="bg-gray-200 rounded-lg border-2 border-purple-600 overflow-hidden shadow-lg ">
      <img
        src={`${apiUrl}${post.imageUrl}`}
        alt="Post image"
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 truncate">
          {post.title}
        </h2>
        <p className="text-sm text-gray-500">by {post.author.username}</p>
        <div className="tag-container h-20">
          {post.tags.map((tag) => (
            <span key={tag.id} className="tag">
              {tag.name}
            </span>
          ))}
        </div>

        <button onClick={() => navigate(`/posts/${post.id}`) } className="mt-4 primary-button">View Post</button>
      </div>
    </li>
  );
};

export default PostCard;