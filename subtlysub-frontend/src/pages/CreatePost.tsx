import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [cards, setCards] = useState([{ word: "", translation: "" }]);
  const [imageUrl, setImageUrl] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/tags`);

        if (!response.ok) {
          throw new Error("Failed to fetch tags");
        }

        const data = await response.json();
        setAllTags(data.map((tag: { name: string }) => tag.name));
      } catch (error) {
        console.error("Error fetching tags: ", error);
      }
    };

    fetchTags();
  }, [apiUrl]);

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleCreateNewTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag.trim()]);
      setNewTag("");
    }
  };

  const handleAddCard = () => {
    setCards([...cards, { word: "", translation: "" }]);
  };

  const handRemoveCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const handleChangeWord = (index: number, newWord: string) => {
    const newCards = [...cards];
    newCards[index].word = newWord;
    setCards(newCards);
  };

  const handleChangeTranslation = (index: number, newTranslation: string) => {
    const newCards = [...cards];
    newCards[index].translation = newTranslation;
    setCards(newCards);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description) {
      setError("Title and description is required");
      return;
    };

    if (cards.some((card) => !card.word || !card.translation)) {
      setError("Fill all words");
      return;
    };

    const token = localStorage.getItem("token");

    if (!token) {
      setError("User not authenticated");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, imageUrl, cards, tags })
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const data = await response.json();
      navigate(`/posts/${data.id}`);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something get wrong");
      }
    }
  };

  const uploadImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      setImageUrl(data.filePath);
      console.log("Uploaded file: ", data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-6 p-6 bg-white rounded-lg shadow-md space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Create Post</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text" 
          placeholder="Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          className="input-field"
        />

        <textarea 
          placeholder="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          className="input-field"
        />
        <input type="file" onChange={(e) => { if (e.target.files) uploadImage(e.target.files[0]) }} />
        <h2 className="text-lg font-semibold">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span 
              key={tag} 
              onClick={() => handleRemoveTag(tag)} 
              className="hover:text-green-200 tag cursor-pointer"
            >
              {tag} ✕
            </span>
          ))}
        </div>

        <div>
          <select 
            onChange={(e) => handleAddTag(e.target.value)} 
            className="input-field"
          >
            <option value="">Select a tag</option>
            {allTags.filter((tag) => !tags.includes(tag)).map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="New tag" 
            value={newTag} 
            onChange={(e) => setNewTag(e.target.value)} 
            className="flex-grow input-field"
          />
          <button 
            type="button" 
            onClick={() => handleCreateNewTag(newTag)}
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
          >+
          </button>
        </div>

        <h2 className="text-lg font-semibold">Cards</h2>
        <div className="space-y-2">
          {cards.map((card, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input 
                type="text" 
                placeholder="Word" 
                value={card.word}
                onChange={(e) => {handleChangeWord(index, e.target.value)}}
                className="flex-grow input-field"
              />
              <input 
                type="text" 
                placeholder="Translation" 
                value={card.translation} 
                onChange={(e) => {handleChangeTranslation(index, e.target.value)}}
                className="flex-grow input-field"
              />
              <button 
                type="button" 
                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={() => {handRemoveCard(index)}}
              >✕
              </button>
            </div>
          ))}
        </div>

        <button 
          type="button" 
          className="green-button"
          onClick={handleAddCard}
        >+ Add Card</button>
        <button 
          type="submit" 
          className="primary-button"
        >Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
