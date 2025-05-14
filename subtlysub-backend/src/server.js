import express from 'express';
import cors from "cors";
import multer from "multer";
import path from "path";

import userRoutes from './user/user.routes.js';
import postRoutes from './routes/postRoutes.js';
import tagRoutes from './routes/tagRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import progressRoutes from './routes/learnRoutes.js';

const app = express();

app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});


const upload = multer({ storage: storage });

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true, 
};

app.use(cors(corsOptions));

app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("File don't uploaded");
  }

  res.json({ message: "File uploaded", filePath: `/uploads/${req.file.filename}` });
});

app.use("/uploads", express.static("uploads"));

app.use("/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/learn", progressRoutes)
app.use("/api/tags", tagRoutes)
app.use("/api/collections", collectionRoutes)

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});