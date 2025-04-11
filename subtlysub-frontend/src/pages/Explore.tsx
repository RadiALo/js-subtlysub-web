import PostList from "../components/list/PostList";
import { useTranslation } from "react-i18next";
const Explore = () => {
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col gap-12">
      <PostList link="/api/posts/trending" title={t("trendingPosts")} />
      <PostList link="/api/posts" title={t("newestPosts")} />

      {(user.role === "admin" || user.role == "moderator") && (
        <PostList link="/api/posts/pending" title={t("pendingPosts")} authorization={true} />
      )}
    </div>
  );
};

export default Explore;
