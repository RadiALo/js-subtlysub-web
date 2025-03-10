import { useNavigate } from "react-router-dom";

interface PostProps {
  post: {
    id: string;
    title: string;
    description: string;
    author: { id: string; username: string };
    tags: { id: string; name: string }[];
  };
}


const PostItem = ({ post }: PostProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="p-4 bg-white rounded-lg shadow-md transition-transform duration-300 ease-out
                  hover:scale-105 hover:shadow-xl hover:bg-purple-50 cursor-pointer"
      onClick={() => navigate(`/posts/${post.id}`)}
      role="button"
    >
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
  );
};

export default PostItem;
