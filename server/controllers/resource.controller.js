import Resource from "../models/resource.model.js";

// Get all resources with optional filters for category, difficulty, and featured status
export const getResources = async (req, res) => {
  try {
    // Extract query parameters for filtering
    const { category, difficulty, featured } = req.query;

    let filter = {};

    // Build the filter object based on provided query parameters
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (featured) filter.featured = featured === "true";

    // Fetch resources from the database based on the filter and sort by published date
    const resources = await Resource.find(filter).sort({ publishedAt: -1 });

    res.json({
      success: true,
      count: resources.length,
      resources,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};
