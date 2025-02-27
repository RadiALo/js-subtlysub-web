import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fetchTags(tags) {
  const existingTags = await prisma.tag.findMany({
    where: {
      name: {
        in: tags,
      },
    },
  });

  const existingTagNames = existingTags.map((tag) => tag.name);
  const newTags = tags.filter((tag) => !existingTagNames.includes(tag));

  const createdTags = await Promise.all(
    newTags.map(async (tag) => {
      return await prisma.tag.create({ data: { name: tag } });
    })
  );

  const allTags = [...existingTags, ...createdTags];

  return allTags;
}

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

    tags = await fetchTags(tags);

    const post = await prisma.post.create({
      data: {
        title,
        description,
        authorId: req.user.id,
        tags: {
          connect: tags.map((tag) => ({ id: tag.id })),
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

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, cards } = req.body;

    const existingPost = await prisma.post.findUnique({
      where: { id },
      include: { tags: true, words: true },
    });

    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.authorId !== req.user.id && req.role !== "admin" && req.role !== "moderator") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    tags = await fetchTags(tags);

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        description,
        tags: {
          set: tags.map((tag) => ({ id: tag.id }))
        },
        words: {
          deleteMany: {},
          create: cards.map((card) => ({
            word: card.word,
            translation: card.translation,
          })),
        }
      }
    });

    res.json(updatedPost);

  } catch (error) {
    res.status(500).json({ message: "Error updating post", error });
  }
}

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    await prisma.post.delete({
      where: { id },
    });

    res.json({ message: "Post deleted" });

  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
}
