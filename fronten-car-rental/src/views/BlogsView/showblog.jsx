import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, List, ChevronRight, Clock, User } from 'lucide-react';
import axios from 'axios';
import BaseCard from '../../components/card';
import heroImage from "../../assets/Bannerimage.jpg";

const BlogPost = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate ID before making the request
      if (!id) {
        throw new Error('Blog ID is missing');
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/blogs/${id}`);
      
      if (response.data.success && response.data.data) {
        console.log('Blog data:', response.data.data); // Debug log
        setBlog(response.data.data);
      } else {
        throw new Error(response.data.message || 'Blog not found');
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError(
        error.response?.status === 404 
          ? 'Blog not found' 
          : error.response?.data?.message || 'Failed to load blog'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      console.log('Fetching blog with ID:', id); // Debug log
      fetchBlog();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl mb-4">{error || 'Blog not found'}</div>
        <Link 
          to="/home/blogs"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-black/40"> {/* Darkened overlay */}
          <div
            className="w-full h-full bg-cover bg-center blur-sm" // Added blur effect
            style={{
              backgroundImage: `url(${blog.image ? 
                `https://backendonlinecar.netlify.app/functions/express-server/uploads/blogs/${blog.image}` : 
                heroImage
              })`,
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm mb-4">
            {blog.category}
          </span>
          <h1 className="text-4xl font-bold text-white mb-4">{blog.title}</h1>
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              {blog.author.image ? (
                <img 
                  src={`https://backendonlinecar.netlify.app/functions/express-server/uploads/authors/${blog.author.image}`}
                  alt={blog.author.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white mr-2"
                  onError={(e) => {
                    console.log('Author image error:', blog.author.image);
                    e.target.src = "/default-avatar.jpg";
                  }}
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white mr-2">
                  <User size={24} className="text-gray-500" />
                </div>
              )}
              <span className="text-white text-sm font-medium">{blog.author.name}</span>
            </div>
            
            <div className="flex items-center text-white">
              <Calendar size={16} className="mr-1" />
              <span className="text-sm">
                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-3/4">
            <BaseCard width='w-auto' boxShadow={false} className='border border-gray-200 rounded-xl overflow-hidden' height='h-auto'>
              <div className="relative">
                <img 
                  src={`https://backendonlinecar.netlify.app/functions/express-server/uploads/blogs/${blog.image}`}
                  alt={blog.title}
                  className="w-full h-[500px] object-cover"
                  onError={(e) => {
                    console.log('Blog image error:', blog.image);
                    e.target.src = "/default-blog.jpg";
                  }}
                />
              </div>
              
              <div className="p-8">
                <div 
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </div>
            </BaseCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;