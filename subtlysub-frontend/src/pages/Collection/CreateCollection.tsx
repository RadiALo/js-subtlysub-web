import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageChoose from "../../components/ImageChoose";

const CreateCollection = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleCreate = async () => {
    if (!name || !description) {
      setError("Name and description is required");
      return;
    }

    if (!imageUrl) {
      setError("Image is required");
      return;
    }

    if (!token) {
      setError("User not authenticated");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/collections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, imageUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const data = await response.json();
      navigate(`/collections/${data.id}`);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something get wrong");
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 p-6 bg-white rounded-lg shadow-md space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Create Collection</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field"
        />

        <ImageChoose
          onUpload={(path) => {
            console.log("norm");
            setImageUrl(path);
          }}
        />

        <button type="button" onClick={handleCreate} className="primary-button">
          Create Collection
        </button>
      </div>
    </div>
  );
};

export default CreateCollection;
