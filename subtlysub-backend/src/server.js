import express from 'express';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import tagRoutes from './routes/tagRoutes.js';

const app = express();

app.use(express.json());

app.use("/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/routes", tagRoutes)

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});