import { useNavigate } from "react-router-dom";
import { Post } from "../types/Post"

export interface PostProps {
  post: Post;
}

const PostItem = ({ post }: PostProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-lg shadow-md transition-transform duration-300 ease-out
                  hover:scale-105 hover:shadow-xl hover:bg-purple-50 cursor-pointer"
      onClick={() => navigate(`/posts/${post.id}`)}
      role="button"
    >
      <div className="overflow-hidden rounded-t-lg">
        <img 
          src="/diablo-post-image.avif" 
          alt="Post image" 
          className="w-full max-h-12 md:max-h-24 object-cover"
        />
      </div>

      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800">{post.title}</h2>
        <p className="text-sm text-gray-500">by {post.author.username}</p>
        <p className="text-gray-700 mt-2">{post.description}</p>

        <div className="tag-container">
          {post.tags.map(tag => (
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
