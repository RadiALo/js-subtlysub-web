import LearnRepository from "./learn.repository.js";

const LearnService = {
  toResponseDTO: (learn) => {
    return {
      progress: learn.progress,
      createdAt: learn.createdAt,
      updatedAt: learn.updatedAt
    };
  },

  getLearn: async (userId, postId) => {
    const learn = await LearnRepository.find(userId, postId);

    return LearnRepository.toResponseDTO(learn);
  },

  createLearn: async (userId, postId) => {
    const newLearn = await LearnRepository.create(userId, postId);

    return LearnRepository.toResponseDTO(newLearn);
  },

  updateLearn: async (userId, postId, progress) => {
    const learn = await LearnRepository.find(userId, postId);

    if (!learn) {
      throw new Error("Learn record not found");
    }

    learn.progress = progress;
    const updatedLearn = await LearnRepository.update(learn);

    return LearnRepository.toResponseDTO(updatedLearn);
  }
};

export default LearnService;