import { useState, useEffect, useCallback } from 'react';
import { Calendar, User, Tag, Search, Menu, X, ChevronRight, ChevronLeft } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BaseCard from '../../components/card';
import Button from '../../components/button';

const BlogCard = ({ blog, onImageLoad, onImageError, imageLoadingStates }) => (
  <BaseCard
    boxShadow={false}
    width="w-full"
    height="h-full"
    bgColor="bg-gray"
    padding="p-0"
    className="overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-md"
  >
    <div className="relative">
      {imageLoadingStates[`blog-${blog._id}`] && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
      <img 
        src={`http://localhost:5000/uploads/blogs/${blog.image}`}
        alt={blog.title} 
        className="w-full h-52 object-cover"
        onLoad={() => onImageLoad(`blog-${blog._id}`)}
        onError={(e) => {
          onImageError(blog._id, 'Blog', blog.image);
          e.target.src = "/default-blog.jpg";
        }}
      />
      <div className="absolute top-3 right-3">
        <span className="bg-Blue bg-opacity-90 text-white text-xs px-3 py-1.5 rounded-md">
          {blog.category}
        </span>
      </div>
    </div>

    <div className="p-5 flex flex-col justify-between flex-grow">
      <div>
        <h3 className="font-bold text-lg mb-3 hover:text-indigo-600 transition line-clamp-2">
          {blog.title}
        </h3>
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{blog.excerpt}</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
        <div className="flex items-center">
          <div className="relative w-10 h-10">
            {imageLoadingStates[`author-${blog._id}`] && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-full" />
            )}
            <img 
              src={blog.author.image 
                ? `http://localhost:5000/uploads/authors/${blog.author.image}`
                : "/default-avatar.jpg"
              }
              alt={blog.author.name}
              className="w-10 h-10 rounded-full mr-3 border-2 border-gray-100 object-cover"
              onLoad={() => onImageLoad(`author-${blog._id}`)}
              onError={(e) => {
                onImageError(blog._id, 'Author', blog.author.image);
                e.target.src = "/default-avatar.jpg";
              }}
            />
          </div>
          <div>
            <p className="text-sm font-medium">{blog.author.name}</p>
            <div className="flex items-center text-gray-500 text-xs">
              <Calendar size={12} className="mr-1" />
              {new Date(blog.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <Link
          to={`/home/blogs/${blog._id}`}
          className="inline-flex items-center bg-Blue text-white text-sm px-3 py-2 rounded hover:bg-opacity-90 transition-colors"
        >
          <span>Read</span>
          <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>
    </div>
  </BaseCard>
);

export default function BlogListPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  const postsPerPage = 9;

  const handleImageLoad = useCallback((id) => {
    setImageLoadingStates(prev => ({ ...prev, [id]: false }));
  }, []);

  const handleImageError = useCallback((id, type, imageUrl) => {
    console.error(`${type} image load error:`, imageUrl);
    setImageLoadingStates(prev => ({ ...prev, [id]: false }));
  }, []);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [blogsResponse, categoriesResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/blogs'),
        axios.get('http://localhost:5000/api/categories')
      ]);
      
      if (blogsResponse.data.success) {
        setBlogs(blogsResponse.data.data);
        const initialLoadingStates = {};
        blogsResponse.data.data.forEach(blog => {
          initialLoadingStates[`blog-${blog._id}`] = true;
          initialLoadingStates[`author-${blog._id}`] = true;
        });
        setImageLoadingStates(initialLoadingStates);
      } else {
        throw new Error(blogsResponse.data.message || 'Failed to fetch blogs');
      }
    } catch (error) {
      console.error('Fetch blogs error:', error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const categories = [
    { name: 'All', count: blogs.length },
    ...Object.entries(
      blogs.reduce((acc, blog) => {
        acc[blog.category] = (acc[blog.category] || 0) + 1;
        return acc;
      }, {})
    ).map(([name, count]) => ({ name, count }))
  ];

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = searchTerm === '' || 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'All' || blog.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredBlogs.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredBlogs.length / postsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchTerm]);

  const getPaginationRange = () => {
    const range = [];
    const maxButtons = 5;
    let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-red-500 text-xl mb-4">Error: {error}</div>
        <button 
          onClick={fetchBlogs}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 font-jakarta min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-sm"
          >
            <Menu size={24} />
            <span>Menu</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="hidden lg:block lg:w-1/4">
            <BaseCard height='h-auto' boxShadow={false} bgColor='bg-gray' className='sticky top-[5.5rem] z-1'>
              <div className="mb-6">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg py-2 px-4 pl-10 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <ul className="space-y-1">
                {categories.map(category => (
                  <li key={category.name}>
                    <button
                      onClick={() => setActiveCategory(category.name)}
                      className={`flex items-center justify-between w-full py-2.5 px-4 rounded-lg transition ${
                        activeCategory === category.name 
                          ? 'bg-indigo-50 text-indigo-700 font-medium' 
                          : 'hover:bg-white'
                      }`}
                    >
                      <span className="flex items-center">
                        <Tag size={16} className="mr-2" />
                        {category.name}
                      </span>
                      <div className="flex items-center">
                        <span className="bg-Blue text-white rounded-full text-xs px-2 py-1 mr-1">
                          {category.count}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </BaseCard>
          </div>

          <div className="lg:w-3/4">
            {currentPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">No blogs found</div>
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setActiveCategory('All');
                    }}
                    className="text-blue-500 hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentPosts.map(blog => (
                  <BlogCard 
                    key={blog._id} 
                    blog={blog}
                    onImageLoad={handleImageLoad}
                    onImageError={handleImageError}
                    imageLoadingStates={imageLoadingStates}
                  />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center mt-8 mb-8">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center px-3 py-2 bg-white border rounded-lg disabled:opacity-50"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  {getPaginationRange().map(number => (
                    <button
                      key={number}
                      onClick={() => setCurrentPage(number)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === number
                          ? 'bg-blue-500 text-white'
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      {number}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center px-3 py-2 bg-white border rounded-lg disabled:opacity-50"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
