import TagRepository from "./tag.repository";

const TagService = {
  toResponseDTO: (tag) => {
    return {
      name: tag.name,
    };
  },

  getTags: async () => {
    const tags = await TagRepository.getAll();
    return tags.map(TagService.toResponseDTO);
  },
};

export default TagService;