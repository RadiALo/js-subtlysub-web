import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createPost = async (req, res) => {
  try {
    const { title, description, tags, cards } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!cards || cards.length === 0) {
      return res.status(400).json({ message: "Cards are required" });
    }

    const existingTags = await prisma.tag.findMany({
      where: {
        name: {
          in: tags,
        },
      },
    });

    const existingTagNames = existingTags.map((tag) => tag.name);

    const newTags = tags.filter((tag) => !existingTagNames.includes(tag));

    const createdTegs = await Promise.all(newTags.map(async (tag) => {
      return await prisma.tag.create({
        data: {
          name: tag
        },
      });
    }));

    const allTags = [...existingTags, ...createdTegs];

    const post = await prisma.post.create({
      data: {
        title,
        description,
        authorId: req.user.id,
        tags: {
          connect: allTags.map((tag) => ({ id: tag.id })),
        },
        words: {
          create: cards.map((card) => ({
            word: card.word,
            translation: card.translation,
          })),
        },
      }
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error });
  }
}

export const getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({ include: {tags: true, author: true} });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
}

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error });
  }
}