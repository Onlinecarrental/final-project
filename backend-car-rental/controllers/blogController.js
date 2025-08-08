const Blog = require('../models/Blog');
const fs = require('fs').promises;
const path = require('path');
const mongoose = require('mongoose');

// Detect Netlify Lambda by presence of LAMBDA_TASK_ROOT
const isServerless = !!process.env.LAMBDA_TASK_ROOT;

const blogController = {
  createBlog: async (req, res) => {
    try {
      // Validate required fields
      if (!req.files?.image) {
        return res.status(400).json({
          success: false,
          message: 'Blog image is required'
        });
      }

      const blogData = {
        ...req.body,
        image: isServerless 
          ? `uploads/blogs/placeholder-${Date.now()}.jpg`
          : req.files.image[0].path.replace(/\\/g, '/'),
        author: JSON.parse(req.body.author || '{}')
      };

      if (req.files.authorImage) {
        blogData.author.image = isServerless 
          ? `uploads/authors/placeholder-${Date.now()}.jpg`
          : req.files.authorImage[0].path.replace(/\\/g, '/');
      }

      const blog = new Blog(blogData);
      const savedBlog = await blog.save();

      res.status(201).json({
        success: true,
        message: 'Blog created successfully',
        data: savedBlog
      });
    } catch (error) {
      // Clean up uploaded files on error (only in local environment)
      if (req.files && !isServerless) {
        await Promise.all(
          Object.values(req.files)
            .flat()
            .map(file => fs.unlink(file.path).catch(console.error))
        );
      }
      
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  getAllBlogs: async (req, res) => {
    try {
      const blogs = await Blog.find().sort('-createdAt');
      res.json({
        success: true,
        count: blogs.length,
        data: blogs
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getBlogById: async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid blog ID format'
        });
      }

      const blog = await Blog.findById(req.params.id);
      
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
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  updateBlog: async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
      
      if (!blog) {
        return res.status(404).json({
          success: false,
          message: 'Blog not found'
        });
      }

      const updateData = {
        ...req.body,
        author: JSON.parse(req.body.author || '{}')
      };

      // Handle image updates
      if (req.files?.image) {
        if (!isServerless) {
          // Delete old image (only in local environment)
          if (blog.image) {
            await fs.unlink(blog.image).catch(console.error);
          }
          updateData.image = req.files.image[0].path.replace(/\\/g, '/');
        } else {
          // In serverless environment, use placeholder
          updateData.image = `uploads/blogs/placeholder-${Date.now()}.jpg`;
        }
      }

      if (req.files?.authorImage) {
        if (!isServerless) {
          // Delete old author image (only in local environment)
          if (blog.author?.image) {
            await fs.unlink(blog.author.image).catch(console.error);
          }
          updateData.author.image = req.files.authorImage[0].path.replace(/\\/g, '/');
        } else {
          // In serverless environment, use placeholder
          updateData.author.image = `uploads/authors/placeholder-${Date.now()}.jpg`;
        }
      }

      const updatedBlog = await Blog.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        message: 'Blog updated successfully',
        data: updatedBlog
      });
    } catch (error) {
      // Clean up uploaded files on error (only in local environment)
      if (req.files && !isServerless) {
        await Promise.all(
          Object.values(req.files)
            .flat()
            .map(file => fs.unlink(file.path).catch(console.error))
        );
      }
      
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  deleteBlog: async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
      
      if (!blog) {
        return res.status(404).json({
          success: false,
          message: 'Blog not found'
        });
      }

      // Delete associated images (only in local environment)
      if (!isServerless) {
        if (blog.image) {
          await fs.unlink(blog.image).catch(console.error);
        }
        if (blog.author?.image) {
          await fs.unlink(blog.author.image).catch(console.error);
        }
      }

      await blog.deleteOne();

      res.json({
        success: true,
        message: 'Blog deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = blogController;