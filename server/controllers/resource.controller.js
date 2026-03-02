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
      message: "Resources retrieved successfully!",
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

// Get a single resource by its slug and increment the view count
export const getResourceBySlug = async (req, res) => {
  try {
    // Find the resource by its slug
    const resource = await Resource.findOne({
      slug: req.params.slug,
    });

    // If the resource is not found, return a 404 error
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found!",
      });
    }

    // Increment the view count of the resource
    resource.views += 1;

    // Save the updated resource back to the database
    await resource.save();

    res.json({
      success: true,
      message: "Resource retrieved and view count incremented!",
      resource,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};
