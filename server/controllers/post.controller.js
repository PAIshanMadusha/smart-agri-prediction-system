import Post from "../models/post.model.js";

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;

    // Validate input
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required!",
      });
    }

    // Create the post
    const post = await Post.create({
      user: req.userId,
      title,
      description,
      imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully!",
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

// Get all posts
export const getPosts = async (req, res) => {
  try {
    // Fetch all posts, populate user details, and sort by creation date
    const posts = await Post.find()
      .populate("user", "name email") // Populate user details (name and email)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};
