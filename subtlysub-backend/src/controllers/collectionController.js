import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createCollection = async (req, res) => {
  try {
    const { user } = req;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const collection = await prisma.collection.create({
      data: {
        name,
        ownerId: user.id,
      },
    });

    res.status(201).json(collection);
  } catch (error) {
    res.status(500).json({ message: "Error creating collection", error });
  }
};

export const getCollectionsByUser = async (req, res) => {
  try {
    const { user } = req;
    const collections = await prisma.collection.findMany({
      where: {
        ownerId: user.id,
      },
    });
    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({ message: "Error getting collections", error });
  }
};

export const getCollectionById = async (req, res) => {
  try {
    const { id } = req.params;

    const collection = await prisma.collection.findUnique({
      where: {
        id,
      },
    });

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    res.status(200).json(collection);
  } catch (error) {
    res.status(500).json({ message: "Error getting collection", error });
  }
};

export const updateCollectionName = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const { user } = req;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const collection = await prisma.collection.findUnique({
      where: { id },
    });
    
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }
    
    if (collection.ownerId !== user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedCollection = await prisma.collection.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    return res.status(200).json(updatedCollection);
  } catch (error) {
    res.status(500).json({ message: "Error updating collection", error });
  }
};

export const addPostToCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { postId } = req.body;
    const { user } = req;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    const collection = await prisma.collection.findUnique({
      where: {
        id,
      },
    });

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    if (collection.ownerId !== user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedCollection = await prisma.collection.update({
      where: {
        id,
      },
      data: {
        posts: {
          connect: { id: postId },
        },
      },
    });

    return res.status(200).json(updatedCollection);
  } catch (error) {
    res.status(500).json({ message: "Error adding post to collection", error });
  }
};


export const removePostFromCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { postId } = req.body;
    const { user } = req;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    const collection = await prisma.collection.findUnique({
      where: {
        id,
      },
    });

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    if (collection.ownerId !== user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedCollection = await prisma.collection.update({
      where: {
        id,
      },
      data: {
        posts: {
          disconnect: { id: postId },
        },
      },
    });

    return res.status(200).json(updatedCollection);
  } catch (error) {
    res.status(500).json({ message: "Error removing post from collection", error });
  }
};

export const deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { user, role } = req;

    const collection = await prisma.collection.findUnique({
      where: {
        id,
      },
    });

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    if (collection.ownerId !== user.id && role !== "admin" && role !== "moderator") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await prisma.collection.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({ message: "Collection deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting collection", error });
  }
};