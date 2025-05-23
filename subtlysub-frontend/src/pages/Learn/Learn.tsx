import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Post } from "../../types/Post";
import CardItem from "../../components/element/CardItem";
import { useTranslation } from 'react-i18next';

type ProgressItem = {
  id: number;
  word: string;
  translation: string;
  learned: boolean;
};

const Learn = () => {
  const { t } = useTranslation();

  const apiUrl = import.meta.env.VITE_API_URL;
  
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [post, setPost] = useState<Post>();
  const [progress, setProgress] = useState<ProgressItem[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      const postResponse = await fetch(`${apiUrl}/api/posts/${id}`);

      if (!postResponse.ok) {
        console.error("Failed to fetch post");
        return;
      }

      const post = await postResponse.json();
      setPost(post);
    };

    fetchPost();
  }, [apiUrl, token, id]);

  useEffect(() => {
    const fetchProgress = async () => {
      const learnResponse = await fetch(`${apiUrl}/api/learn/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!learnResponse.ok) {
        console.error("Failed to fetch progress");
        return;
      }

      const learn = await learnResponse.json();

      if (!learn) {
        return;
      }

      learn.progress = post?.cards.map(card => ({ id: card.id, word: card.word, translation: card.translation, learned:
        (learn.progress && learn.progress.find((c: ProgressItem) => c.id === card.id)?.learned) })) || [];

      setProgress(learn.progress);
    };

    fetchProgress();
  }, [apiUrl, id, post]);

  const onlyLearned = () => {
    return progress.filter((item) => item.learned);
  }

  const onlyNotLearned = () => {
    return progress.filter((item) => !item.learned);
  }

  return (
    <div className="max-w-6xl mx-auto mt-6 bg-white rounded-lg shadow-md">
      <div className="overflow-hidden rounded-t-lg relative">
          <img
            src={`${apiUrl}${post?.imageUrl}`}
            alt="Post image"
            className="w-full max-h-64 object-cover"
          />

          {post?.pending && (
            <div className="absolute top-2 right-2 bg-purple-500 text-white text-sm font-bold px-3 py-1 rounded-md">
              {t('pending')}
            </div>
          )}
      </div>

      <div className="px-6 pb-4">
        <div className="p-6 flex justify-between items-start">
            <div className="w-xl">
              <h1 className="text-2xl font-bold text-gray-800">
                {post?.title}
              </h1>

              <p className="text-gray-500 text-sm">
                {t('by')} {post?.author.username}
              </p>

              <div className="mb-4 tag-container">
                {post?.tags?.map((tag) => (
                  <span key={tag.id} className="tag">
                    {tag.name}
                  </span>
                ))}
              </div>

              <div className="mt-4 mb-4">{post?.description}</div>
            </div>
            {onlyNotLearned().length > 0 && <div>
                <Link
                  to="./app"
                  className="w-full text-center px-4 py-2 font-semibold inline-block text-white
                  bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400">
                  Start
                </Link>
            </div>}
        </div>

        <div className="px-6 pb-4">
          {progress && progress.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  Learned
                </h1>
                <ul className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {onlyLearned().slice(0, 10).map((card) => (
                    <li key={card.word}>
                      <CardItem card={card} />
                    </li>
                  ))}
                  {onlyLearned().length > 10 && <p className="text-gray-600 mt-4 text-md">
                    And {onlyLearned().length - 10} more
                  </p>}
                </ul>
              </div>
              

              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  To learn
                </h1>
                <ul className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {onlyNotLearned().slice(0, 10).map((card) => (
                    <li key={card.word}>
                      <CardItem card={card} />
                    </li>
                  ))}
                </ul>
                {onlyNotLearned().length > 10 && <p className="text-gray-600 mt-4 text-md">
                  And {onlyNotLearned().length - 10} more
                </p>}
              </div>
              
              </div>
            ) : (
              <p className="mt-4 text-gray-500">No words available</p>
            )}
        </div>
      </div>
    </div>
  );
}

export default Learn;