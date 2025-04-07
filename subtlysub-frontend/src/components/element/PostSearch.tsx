import { Post } from "../../types/Post";
import { useNavigate } from "react-router-dom";

interface PostSearchProps {
  post: Post;
  onClick?: () => void;
}

const PostSearch = ({post, onClick}: PostSearchProps) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();


  const handleClick = () => {
    if (onClick) {
      onClick();
    }

    navigate(`/posts/${post.id}`);
  };

  return (
    <li onClick={handleClick} className="text-black px-4 py-2 hover:bg-purple-100 cursor-pointer flex gap-2 items-center">
      <img src={`${apiUrl}${post.imageUrl}`} alt="Post icon" className="rounded-lg inline w-10 h-10 shadow-md object-cover" />
      <span className="font-semibold text-gray-800">{post.title}</span>
      
      <span className="text-gray-800">by {post.author.username}</span>
    </li>
  );
};

export default PostSearch;