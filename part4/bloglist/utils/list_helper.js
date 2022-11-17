const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {

    const reducer = (sum, blog) => {
        return sum + blog.likes
      }

    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const reducer = (preventBlog, currentBlog) => {
        return (preventBlog.likes > currentBlog.likes) ? preventBlog : currentBlog
    }

    return blogs.length === 0 ? {} : blogs.reduce(reducer)
}

const mostBlogs = (blogs) => {
    if(blogs.length === 0) return {}
    const blogsByAuthor = _.groupBy(blogs, (blog) => blog.author)
    const blogsCountByAuthor = _.mapValues(blogsByAuthor, blogs => blogs.length)
    const mostBlogsAuthor = Object.entries(blogsCountByAuthor).reduce((prevent, current) => 
    (prevent[1] > current[1]) ? prevent : current)
    return  {author: mostBlogsAuthor[0], blogs: mostBlogsAuthor[1]}
}

const mostLikes = (blogs) => {
    if(blogs.length === 0) return {}
    const blogsByAuthor = _.groupBy(blogs, (blog) => blog.author)
    const likesCountByAuthor = _.mapValues(blogsByAuthor, totalLikes)
   
    const mostLikesAuthor = Object.entries(likesCountByAuthor).reduce((prevent, current) => 
    (prevent[1] > current[1]) ? prevent : current)
    
    return  {author: mostLikesAuthor[0], likes: mostLikesAuthor[1]}
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}