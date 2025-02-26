import express from 'express';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

app.use(express.json());

app.use("/auth", authRoutes)
app.use("/api", userRoutes)

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});