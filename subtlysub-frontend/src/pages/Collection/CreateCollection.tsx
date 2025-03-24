import { useState } from "react";

const CreateCollection = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description) {
      setError("Name and description is required");
      return;
    }

    if (!imageUrl) {
      setError("Image is required");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("User not authenticated");
      return;
    }
    
    try {
      const response = await fetch(`${apiUrl}/api/collections`, {      
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, description, imageUrl }
      )});

      if (!response.ok) {
        throw new Error("Failed to create post");
      }
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
      
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <input type="file" onChange={(e) => { if (e.target.files) uploadImage(e.target.files[0]) }} />
        {imageUrl && <img src={`${apiUrl}${imageUrl}`} alt="Collection icon" className="rounded w-full max-h-32 object-cover" />}

        <button 
          type="submit" 
          className="primary-button"
        >Create Collection</button>
      </form>
    </div>
  );
};

export default CreateCollection;