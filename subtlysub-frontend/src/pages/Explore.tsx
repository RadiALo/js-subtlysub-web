import PostList from "../components/PostList";
import { useTranslation } from "react-i18next";
const Explore = () => {
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col items-center gap-12">
      <PostList url="/api/posts/trending" title={t("trendingPosts")} />
      <PostList url="/api/posts" title={t("newestPosts")} />

      {(user.role === "admin" || user.role == "moderator") && (
        <PostList url="/api/posts/pending" title={t("pendingPosts")} />
      )}
    </div>
  );
};

export default Explore;
