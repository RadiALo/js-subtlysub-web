import LearnService from "./learn.service.js";

const LearnController = {
  getLearn: async (req, res) => {
    try {
      const { user } = req;
      const { id } = req.params;

      const learn = await LearnService.getLearn(user.id, id);

      if (!learn) {
        const newLearn = await LearnService.createLearn(user.id, id);
        return res.status(200).json(newLearn);
      }

      return res.status(200).json(learn);
    } catch (error) {
      res.status(500).json({ message: "Error getting progress", error });
      console.error(error);
    }
  },
  
  updateLearn: async (req, res) => {
    try {
      const { user } = req;
      const { id } = req.params;
      const { progress } = req.body;

      const updatedLearn = await LearnService.updateLearn(user.id, id, progress);
      
      return res.status(200).json(updatedLearn);
    } catch (error) {
      res.status(500).json({ message: "Error updating progress", error });
      console.error(error);
    }
  }
};

export default LearnController;