import PostList from "../components/list/PostList";
import { useTranslation } from 'react-i18next';
import CollectionList from "../components/list/CollectionList";

const Home = () => {
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col gap-12">
      <PostList title={t('continueStudying')} link="/api/posts/recent" authorization={true} />

      <CollectionList title={t('yourCollections')} link="/api/collections" authorization={true} createLink={true} />

      <PostList title={t('yourPosts')} link={`/api/posts`} authorization={true} createLink={true} parameters={new Map([['authorId', user.id]])}/>
    </div>
  );
};

export default Home;
