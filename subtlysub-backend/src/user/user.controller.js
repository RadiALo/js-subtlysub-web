import UserService from './user.service.js';
import validator from "validator";

const UserController = {
  getUsers: async (req, res) => {
    try {
      const users = await UserService.getUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
      console.error(error);
    }
  },

  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user", error });
      console.error(error);
    }
  },

  sendVerifyCode: async (req, res) => {
    try {
      const { id } = req.user;
      const user = await UserService.sendVerifyCode(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      if (user.verified) {
        return res.status(400).json({ message: "User is already verified" });
      }
      
      UserService.sendVerificationCode(user.id);
      
      res.status(200).json({ message: "Verification code sent" });
    } catch (error) {
      res.status(500).json({ message: "Error sending code", error });
      console.error(error);
    }
  },

  verifyCode: async (req, res) => {
    try {
      const { id } = req.user;
      const { code } = req.body;
      
      const token = await UserService.verifyCode(id, code);
      
      if (!token) {
        return res.status(400).json({ message: "Invalid verification code" });
      }
      
      res.status(200).json({ message: "User verified successfully", token });
    } catch (error) {
      res.status(500).json({ message: "Error verifying code", error });
      console.error(error);
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const token = await UserService.login({ username, password });

      if (!token) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      console.log(token);
      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      res.status(500).json({ message: "Error logging in", error });
      console.error(error);
    }
  },

  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: "Username, email, and password are required" });
      }

      if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      const user = await UserService.register({ username, email, password });
      
      if (!user) {
        return res.status(400).json({ message: "User already exists" });
      }

      res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      res.status(500).json({ message: "Error registering user", error });
      console.error(error);
    }
  }
}

export default UserController;