import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Collection } from "../../types/Collection";
import CollectionItem from "../element/CollectionItem";

interface CollectionListProps {
  link: string;
  title: string;
  authorization?: boolean;
  createLink?: boolean;
  parameters?: Map<string, string>;
}

const CollectionList = ({ link, title, authorization = false, createLink = false, parameters = null }: CollectionListProps) => {
  const { t } = useTranslation();

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  
  const [collections, setCollections] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);

  const loadMore = () => {
    setVisibleCount(visibleCount + 6);
  };

  useEffect(() => {
    const url = new URL(`${apiUrl}${link}`);

    if (parameters) {
      parameters.forEach((value, key) => {
        url.searchParams.append(key, value);
      });
    }

    const fetchCollections = async () => {
      try {
        const response = authorization
          ? await fetch(`${url.toString()}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
          : await fetch(`${url.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch collections");
        }

        const data = await response.json();
        setCollections(data);
      }
      catch (error) {
        console.error("Error fetching collections: ", error);
      }
    };
  
    fetchCollections();
  }, [apiUrl, link, authorization, token, parameters]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">{title}</h1>

      {(collections && collections.length > 0) || createLink  ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.slice(0, visibleCount).map((collection: Collection) => (
            <CollectionItem key={collection.id} collection={collection} />
          ))}

          {createLink && (
            <div
              className="relative bg-purple-100 rounded-lg shadow-md flex flex-col justify-center items-center
                transition-transform duration-300 ease-out hover:scale-105 hover:shadow-xl
                cursor-pointer p-6 border-4 border-dashed border-purple-400 text-gray-500"
              onClick={() => navigate('/collections/create')}
            >
              <span className="text-4xl">➕</span>
              <span className="mt-2 font-semibold">{t('createNewCollection')}</span>
            </div>
          )}
        </div>
      ) : (
        <p className="text-white">{t('noCollectionsFound')}</p>
      )}
    </div>
  );
}

export default CollectionList;