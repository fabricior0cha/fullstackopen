const blogsRouter = require('express').Router()
const { response } = require('../app')
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')



blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate("user",{username:1, name:1})
  response.json(blogs)

})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  if(!body.title || !body.url){
    return response.status(400).json({
      error: 'Title or URL missing'
    })
  }

  
  
  const blog = new Blog({
    ...body, 
    likes: body.likes ? body.likes : 0,
    user: user._id
  })


  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  const user = request.user
  
  if(blog.user.toString() === user.id){
    blog.delete()
    response.status(204).end()
  }
  else {
    response.status(400).json({error: 'only user owner can delete blog'})
  }
  
  
})

blogsRouter.put('/:id', async (request, response) => {
  
    const body = request.body
  
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    }
  
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    
    response.json(updatedBlog)
  })


module.exports = blogsRouter