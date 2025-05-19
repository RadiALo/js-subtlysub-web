import TagRepository from "./tag.repository.js";

const TagController = {
  getTags: async (req, res) => {
    try {
      const tags = await TagRepository.getAll();
      res.status(200).json(tags);
    } catch (error) {
      res.status(500).json({ message: "Error getting tags", error });
      console.error("Error getting tags:", error);
    }
  },
};

export default TagController;