import { Link, useParams, useNavigate } from "react-router-dom";
import { Post } from "../../types/Post";
import { useEffect, useState } from "react";
import CardItem from "../../components/CardItem";
import { Collection } from "../../types/Collection";
import { useTranslation } from "react-i18next";

const PostDetail = () => {
  const { t } = useTranslation();

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [post, setPost] = useState<Post>();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectionsInfo, setCollectionsInfo] = useState<Map<string, boolean>>(
    new Map()
  );

  const [pinToCollection, setPinToCollection] = useState<Collection | null>(post ? post.linkedColl : null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddToModalOpen, setIsAddToModalOpen] = useState(false);
  const [isPinToModalOpen, setIsPinToModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      const postResponse = await fetch(`${apiUrl}/api/posts/${id}`);

      if (!postResponse.ok) {
        console.error("Failed to fetch post");
        return;
      }

      const favoriteCollectionResponse = await fetch(
        `${apiUrl}/api/collections/favorite`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
    };

    fetchPost();
  }, [apiUrl, token, id]);

  useEffect(() => {
    const fetchCollections = async () => {
      const response = await fetch(`${apiUrl}/api/collections`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch collections");
        return;
      }

      const data = await response.json();

      const collectionInfo = new Map<string, boolean>();

      data.forEach((collection: Collection) => {
        if (collection.posts.some((p: Post) => p.id === post?.id)) {
          collectionInfo.set(collection.id, true);
        } else {
          collectionInfo.set(collection.id, false);
        }
      });

      setCollections(data);
      setCollectionsInfo(collectionInfo);
    };

    fetchCollections();
  }, [apiUrl, token, post]);

  const handleApprove = async () => {
    if (!token) {
      return;
    }

    const response = await fetch(`${apiUrl}/api/posts/${post?.id}/approve`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return;
    }

    navigate(-1);
  };

  const handleAddTo = async () => {
    collections.forEach(async (collection) => {
      const isPostInCollection = collectionsInfo.get(collection.id);
      const action = isPostInCollection ? "add" : "remove";

      const response = await fetch(
        `${apiUrl}/api/collections/${collection.id}/${action}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            postId: post?.id,
          }),
        }
      );

      if (!response.ok) {
        console.error("Failed to add post to collection");
        return;
      }
    });

    setIsAddToModalOpen(false);
  };

  const handlePinTo = async () => {
    setIsPinToModalOpen(false);

    if (!token) {
      return;
    }

    if (pinToCollection) {
      const response = await fetch(
        `${apiUrl}/api/collections/pin`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            postId: post?.id,
            collectionId: pinToCollection?.id,
          }),
        }
      );

      console.log(response);
    } else {
      const response = await fetch(
        `${apiUrl}/api/collections/unpin`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            postId: post?.id,
          }),
        }
      );
    }

    const postResponse = await fetch(`${apiUrl}/api/posts/${id}`);

      if (!postResponse.ok) {
        console.error("Failed to fetch post");
        return;
      }

      const favoriteCollectionResponse = await fetch(
        `${apiUrl}/api/collections/favorite`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!favoriteCollectionResponse.ok) {
        console.error("Failed to fetch favorite collection");
        return;
      }

      const newPost = await postResponse.json();
      const favoriteCollection = await favoriteCollectionResponse.json();
      if (favoriteCollection.posts.some((p: Post) => p.id === newPost.id)) {
        newPost.favorite = true;
      }

      setPost(newPost);

      console.log(response);
  };

  const handlePinToSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCollectionId = e.target.value;

    if (selectedCollectionId === "null") {
      setPinToCollection(null);
      return;
    }

    const selectedCollection = collections.find(
      (collection) => collection.id === selectedCollectionId
    );

    setPinToCollection(selectedCollection || null);
  };

  const toggleFavorite = async () => {
    if (!token) {
      return;
    }

    const action = post?.favorite ? "remove" : "add";

    const response = await fetch(
      `${apiUrl}/api/collections/favorite/${post?.id}/${action}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to add post to favorite collection");
      return;
    }

    post.favorite = !post.favorite;
    setPost({ ...post });
  };

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
              {t("pending")}
            </div>
          )}
        </div>

        <div className="px-6 pb-4">
          <div className="p-6 flex justify-between items-start gap-6">
            <div className="w-xl">
              <h1 className="text-2xl font-bold text-gray-800">
                {post?.title}
              </h1>
              <p className="text-gray-500 text-sm">
                {t("by")} {post?.author.username}
              </p>

              <div className="mb-4 tag-container">
                {post?.tags?.map((tag) => (
                  <span key={tag.id} className="tag">
                    {tag.name}
                  </span>
                ))}
              </div>

              <div className="mt-4 mb-4">{post?.description}</div>

              <div className="flex justify-end items-center gap-4 mt-4">
                {(user.role === "admin" ||
                  user.role === "moderator" ||
                  user.id === post?.author.id) && (
                  <button
                    className="px-4 py-2 inline-block font-semibold text-white bg-purple-500 rounded-lg
                              hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    onClick={() => setIsPinToModalOpen(true)}
                  >
                    {t("pinTo")}
                  </button>
                )}

                <button
                  className="px-4 py-2 inline-block font-semibold text-white bg-purple-500 rounded-lg
                              hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  onClick={() => setIsAddToModalOpen(true)}
                >
                  {t("addTo")}
                </button>

                <button
                  className="font-bold text-lg px-4 py-2 bg-purple-500 text-white 
                              rounded-full shadow-md hover:bg-purple-600 active:scale-95 
                              transition-all duration-200"
                  onClick={toggleFavorite}
                >
                  {post?.favorite ? "❤️" : "🤍"}
                </button>
              </div>
            </div>

            {post?.linkedColl && (
              <div
                className="py-4 px-6 bg-purple-400 text-white shadow-lg shadow-purple-600/30 rounded-xl 
                              hover:shadow-xl hover:bg-purple-500 transition-shadow transition-color flex flex-col items-center 
                              text-center cursor-pointer"
                onClick={() => navigate(`/collections/${post.linkedColl.id}`)}
              >
                <span className="text-sm font-semibold tracking-wide">
                  {t("discoverMore")}
                </span>

                <img
                  src={`${apiUrl}${post.linkedColl.imageUrl}`}
                  alt="Linked collection image"
                  className="w-48 h-28 object-cover rounded-lg mt-4 mb-4"
                />

                <span className="text-lg font-semibold">
                  {post.linkedColl.name}
                </span>
              </div>
            )}

            <div className="flex flex-col items-end gap-4">
              <div className="w-full">
                <Link
                  to="./learn"
                  className="w-full text-center px-3 py-2 font-semibold inline-block text-white
                bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  {t("startLearning")}
                </Link>
              </div>

              {(user.role === "admin" ||
                user.role === "moderator" ||
                user.id === post?.author.id) && (
                <div className="flex gap-4 items-center flex-row-reverse">
                  {(user.role === "admin" ||
                    user.role === "moderator" ||
                    user.id === post?.author.id) && (
                    <div>
                      <button
                        className="red-button cursor-pointer"
                        onClick={() => setIsDeleteModalOpen(true)}
                      >
                        {t("delete")}
                      </button>
                    </div>
                  )}

                  {(user.role === "admin" ||
                    user.role === "moderator" ||
                    user.id === post?.author.id) && (
                    <div>
                      <Link to="./edit" className="primary-button">
                        {t("edit")}
                      </Link>
                    </div>
                  )}

                  {post?.pending &&
                    (user.role === "admin" || user.role === "moderator") && (
                      <div>
                        <button
                          className="primary-button"
                          onClick={handleApprove}
                        >
                          {t("approve")}
                        </button>
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>

          {post?.cards && post.cards.length > 0 ? (
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-800">
                {t("vocabularyPreview")}
              </h1>
              <ul className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {post.cards.slice(0, 10).map((card) => (
                  <li key={card.word}>
                    <CardItem card={card} />
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-4 text-gray-500">{t("noWordsAvailable")}</p>
          )}
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-bold">{t("deleteTitle")}</h2>
            <span className="text-gray-600 block mb-4">{t("deleteSub")}</span>

            <div className="flex justify-center gap-4">
              <button className="red-button" onClick={handleDelete}>
                {t("yes")}
              </button>

              <button
                className="green-button"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                {t("no")}
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddToModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-bold mb-6">{t("chooseCollection")}</h2>
            {collections
              .filter((col) => col.name !== "Favorites")
              .map((collection) => (
                <div
                  key={collection.id}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    id={collection.id}
                    checked={collectionsInfo.get(collection.id)}
                    onChange={() => {
                      const newCollectionsInfo = new Map(collectionsInfo);
                      newCollectionsInfo.set(
                        collection.id,
                        !collectionsInfo.get(collection.id)
                      );
                      setCollectionsInfo(newCollectionsInfo);
                    }}
                    className="h-5 w-5 accent-purple-500 focus:ring-purple-400"
                  />
                  <label
                    htmlFor={collection.id}
                    className="text-lg font-medium text-gray-700"
                  >
                    {collection.name}
                  </label>
                </div>
              ))}

            <div className="flex justify-center gap-4 mt-6">
              <button className="green-button" onClick={handleAddTo}>
                {t("save")}
              </button>

              <button
                className="red-button"
                onClick={() => setIsAddToModalOpen(false)}
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {isPinToModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-lg font-bold mb-6">{t("chooseCollectionToPin")}</h2>

          <div className="space-y-4">
            <select
              onChange={handlePinToSelect}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              defaultValue={post?.linkedColl ? post.linkedColl.id : "null"}
            >
              <option value="null">
                {t("withoutPinnedCollection")}
              </option>

              {collections
                .filter((col) => col.name !== "Favorites")
                .map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button className="green-button" onClick={handlePinTo}>
              {t("save")}
            </button>

            <button
              className="red-button"
              onClick={() => setIsPinToModalOpen(false)}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      </div>
      )}
    </>
  );
};

export default PostDetail;
