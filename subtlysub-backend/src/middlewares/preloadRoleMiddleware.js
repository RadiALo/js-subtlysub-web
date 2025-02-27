import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const preloadRoleMiddleware = async (req, res, next) => {
  try {
    const { user } = req;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userData = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        role: true,
      },
    })

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    req.role = userData.role;
    return next();    
  } catch (error) {
    res.status(500).json({ message: "Error getting user role", error });
  }
};

export default preloadRoleMiddleware;