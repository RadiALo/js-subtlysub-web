import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function syncTags(tags) {
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
    const { title, description, tags, cards, imageUrl } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!cards || cards.length === 0) {
      return res.status(400).json({ message: "Cards are required" });
    }

    const syncedTags = await syncTags(tags);
    const post = await prisma.post.create({
      data: {
        title,
        description,
        imageUrl,
        authorId: req.user.id,
        tags: {
          connect: syncedTags.map((tag) => ({ id: tag.id })),
        },
        cards: {
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
    console.error(error);
  }
}

export const getPosts = async (req, res) => {
  try {
    const { authorId } = req.query;

    if (authorId) {
      console.log(authorId)
      const posts = await prisma.post.findMany({
        where: {authorId},
        include: {tags: true, author: true },
        orderBy: {createdAt: "desc"}
      });

      res.json(posts);
    } else {
      const posts = await prisma.post.findMany({
        where: {pending: false},
        include: {tags: true, author: true },
        orderBy: {createdAt: "desc"}
      });
      res.json(posts);
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
}

export const getPendingPosts = async (req, res) => {
  try {
    const { user } = req;

    if (user.role !== "admin" && user.role !== "moderator") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const posts = await prisma.post.findMany({
      where: { pending },
      include: {tags: true, author: true }
    });
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
      include: {
        tags: true,
        author: true,
        cards: true,
        linkedColl: true
      }
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching post", error });
  }
}

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, cards } = req.body;
    const { user } = req;

    const existingPost = await prisma.post.findUnique({
      where: { id },
      include: { tags: true, cards: true },
    });

    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (existingPost.authorId !== user.id && user.role !== "admin" && user.role !== "moderator") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const syncedTags = await syncTags(tags);
    const pending = (user.role !== "admin" && user.role !== "moderator");

    const currentCards = existingPost.cards.map(card => card.id);
    const newCards = cards.map(card => ({ word: card.word, translation: card.translation }));
    const cardsToDelete = existingPost.cards.filter(card => !cards.some(newCard => newCard.word === card.word)).map(card => card.id);
    const cardsToCreate = newCards.filter(newCard => !existingPost.cards.some(card => card.word === newCard.word));

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        description,
        pending,
        tags: {
          set: syncedTags.map((tag) => ({ id: tag.id }))
        },
        cards: {
          deleteMany: {
            id: { in: cardsToDelete }
          },
          create: cardsToCreate
        }
      }
    });

    res.json(updatedPost);

  } catch (error) {
    res.status(500).json({ message: "Error updating post", error });
    console.error(error);
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

    if (existingPost.authorId !== req.user.id && req.user.role !== "admin" && req.user.role !== "moderator") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await prisma.card.deleteMany({
      where: { postId: id },
    });

    await prisma.post.delete({
      where: { id },
    });

    res.json({ message: "Post deleted" });

  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
    console.error(error);
  }
}

export const approvePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;
    
    if (user.role !== "admin" && user.role !== "moderator") {
      return res.status(403).json({ message: "Unauthorized" });
    };

    await prisma.post.update({
      where: { id },
      data: {
        pending: false,
      }
    });

  } catch (error) {
    res.json(error);
  }
}

export const getRecentLearnedPosts = async (req, res) => {
  try {
    const { user } = req;

    const learns = await prisma.learn.findMany({
      where: { userId: user.id },
      orderBy: { lastViewed: "desc" },
      include: { 
        post: {
          include: {
            tags: true, 
            author: true
          }
        }
      }
    });

    const posts = learns.map(learn => learn.post);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
    console.error(error);
  }
}

export const getTrendingPosts = async (req, res) => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const posts = await prisma.post.findMany({
      where: {
        pending: false,
        learns: {
          some: {
            lastViewed: {
              gte: oneMonthAgo,
            },
          },
        },
      },
      include: {
        learns: true,
        tags: true,
        author: true,
        _count: {
          select: {
            learns: true, 
          },
        },
      },
      orderBy: {
        learns: {
          _count: "desc",
        },
      },
    });
    return res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
    console.error(error);
  }
}