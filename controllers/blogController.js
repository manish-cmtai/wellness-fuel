import OpenAI from "openai";
import dotenv from "dotenv";
import Blog from "../models/blogModel.js";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.openai.com/v1",
});


export function parseJsonString(jsonString) {
    try {
        // Step 1: Remove escaped newlines and extra spaces
        const cleanString = jsonString
            .replace(/\n/g, '')  // Remove literal newlines
            .replace(/\r/g, '')  // Remove carriage returns
            .trim();

        // Step 2: Parse into JSON object
        const jsonData = JSON.parse(cleanString);

        return jsonData;
    } catch (err) {
        console.error('Failed to parse JSON string:', err);
        console.log('Raw input:', jsonString);
        return null;
    }
}


export const blogGenerate = async (req, res) => {
  const { message } = req.body;

  try {
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content: `You are a blog writer. Generate a blog in JSON format based on the following requirements:

- Blog Title
- Category
- Excerpt
- Meta Description (max 120-130 characters)
- Read Time
- Status
- Author
- Tags (comma-separated)
- Meta Title
- Meta Keywords (comma-separated)
- Open Graph Title
- Open Graph Description

Example Output:
{
  "Blog Title": "The Ultimate Guide to Wellness and Healthy Living",
  "Category": "health & wellness",
  "Excerpt": "Discover the secrets to a healthier lifestyle with our comprehensive guide covering nutrition, exercise, and mental wellness.",
  "Meta Description": "Learn about wellness and healthy living with practical tips on nutrition, fitness, and mental health.",
  "Read Time": "8 min read",
  "Status": "Draft",
  "Author": "Dr. Sarah Johnson",
  "Tags": "wellness, health, lifestyle, nutrition, fitness",
  "Meta Title": "The Ultimate Guide to Wellness and Healthy Living | Wellness Fuel",
  "Meta Keywords": "wellness, health, lifestyle, nutrition, fitness, healthy living, wellness guide",
  "Open Graph Title": "The Ultimate Guide to Wellness and Healthy Living",
  "Open Graph Description": "Discover the secrets to a healthier lifestyle with practical tips covering nutrition, exercise, and mental health."
}

Now, generate a blog JSON .only JSON not "Here's a blog in JSON format based on the title \"Doctor\":  `,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    console.log(response.output_text);
    const parseJsonData=parseJsonString(response.output_text)

    if (!parseJsonData) {
        return res.status(500).json({
            message :"no Parse Data"
        })
    }
    
    res.status(200).json({
      reply: parseJsonData,
    });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({
      message: "sever Error",
      data: error.message,
    });
  }
};


export async function createBlog(req, res) {
  try {
    // Generate URL slug from title if not provided
    if (!req.body.urlSlug && req.body.title) {
      req.body.urlSlug = req.body.title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    const blog = new Blog(req.body);
    const savedBlog = await blog.save();
    
    // Populate author info
    await savedBlog.populate('author', 'firstName lastName email');
    
    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: savedBlog
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create blog',
      error: error.message
    });
  }
}


export async function getAllBlogs(req, res) {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      category, 
      author, 
      search 
    } = req.query;
    
    const query = {};
    
    if (status) query.status = status;
    if (category) query.category = new RegExp(category, 'i');
    if (author) query.author = author;
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { excerpt: new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') }
      ];
    }

    const blogs = await Blog.find(query)
      .populate('author', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Blog.countDocuments(query);

    res.json({
      success: true,
      data: {
        blogs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalBlogs: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to fetch blogs',
      error: error.message
    });
  }
}


export async function getBlogById(req, res) {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'firstName lastName email');
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to fetch blog',
      error: error.message
    });
  }
}

// Get blog by URL slug
export async function getBlogBySlug(req, res) {
  try {
    const blog = await Blog.findOne({ urlSlug: req.params.slug })
      .populate('author', 'firstName lastName email');
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Increment views
    await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });
    blog.views += 1;
    
    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to fetch blog',
      error: error.message
    });
  }
}


export async function updateBlog(req, res) {
  try {
    // Update URL slug if title is changed
    if (req.body.title && !req.body.urlSlug) {
      req.body.urlSlug = req.body.title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'firstName lastName email');
    
    if (!updatedBlog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Blog updated successfully',
      data: updatedBlog
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update blog',
      error: error.message
    });
  }
}


export async function deleteBlog(req, res) {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    
    if (!deletedBlog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Blog deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to delete blog',
      error: error.message
    });
  }
}


export async function updateBlogStatus(req, res) {
  try {
    const { status } = req.body;
    
    if (!['draft', 'published', 'archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be draft, published, or archived'
      });
    }
    
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('author', 'firstName lastName email');
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    res.json({
      success: true,
      message: `Blog status updated to ${status}`,
      data: blog
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update blog status',
      error: error.message
    });
  }
}

export async function toggleBlogLike(req, res) {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Blog liked successfully',
      data: { likes: blog.likes }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to like blog',
      error: error.message
    });
  }
}

// Get published blogs (public endpoint)
export async function getPublishedBlogs(req, res) {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const query = { status: 'published' };
    
    if (category) query.category = new RegExp(category, 'i');
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { excerpt: new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const blogs = await Blog.find(query)
      .populate('author', 'firstName lastName')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-content'); // Exclude content for listing

    const total = await Blog.countDocuments(query);

    res.json({
      success: true,
      data: {
        blogs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalBlogs: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to fetch published blogs',
      error: error.message
    });
  }
}

// Get blog statistics
export async function getBlogStats(req, res) {
  try {
    const stats = await Blog.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalViews: { $sum: '$views' },
          totalLikes: { $sum: '$likes' }
        }
      }
    ]);

    const totalBlogs = await Blog.countDocuments();
    const categories = await Blog.distinct('category');

    res.json({
      success: true,
      data: {
        totalBlogs,
        statusStats: stats,
        totalCategories: categories.length,
        categories
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to fetch blog statistics',
      error: error.message
    });
  }
}

