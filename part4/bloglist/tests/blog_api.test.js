const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)


describe('when there is initially some blogs saved', () => {


  beforeEach(async () => {
    User.deleteMany({})
    const newUser = {
      username: 'usertest',
      name: 'test',
      password: 'test@123'
    }

    await api.post('/api/users')
    .send(newUser)
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })
  
  test('blogs are returned as json', async () => {
    const userLogin = {
      username: 'usertest',
      password: 'test@123'
    }

    const responseToken = await api.post('/api/login')
    .send(userLogin)
   
    await api
      .get('/api/blogs')
      .set('Authorization', `bearer ${responseToken.body.token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const userLogin = {
      username: 'usertest',
      password: 'test@123'
    }

    const responseToken = await api.post('/api/login')
    .send(userLogin)
   
    const response = await api.get('/api/blogs')
    .set('Authorization', `bearer ${responseToken.body.token}`)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const userLogin = {
      username: 'usertest',
      password: 'test@123'
    }

    const responseToken = await api.post('/api/login')
    .send(userLogin)
   
    const response = await api.get('/api/blogs')
    .set('Authorization', `bearer ${responseToken.body.token}`)

    const titles = response.body.map(r => r.title)
    expect(titles).toContain(
      'React patterns'
    )
  })


 
  
  test('blogs dentifier property of the blog posts is named id', async () => {
    const userLogin = {
      username: 'usertest',
      password: 'test@123'
    }

    const responseToken = await api.post('/api/login')
    .send(userLogin)
   
    const response = await api.get('/api/blogs')
    .set('Authorization', `bearer ${responseToken.body.token}`)
  
    expect(response.body[0].id).toBeDefined()
  })
  
  describe('addition of a new blog', () => {
    test('a valid blog can be added', async () => {

      const userLogin = {
        username: 'usertest',
        password: 'test@123'
      }

      const responseToken = await api.post('/api/login')
      .send(userLogin)
     
      const newBlog = {
        title: "Fullstack open is the best course",
        author: "Fabricio",
        url: "https://fullstackopen.com/",
        likes: 0,
      }
    
      await api.post('/api/blogs')
        .set('Authorization', `bearer ${responseToken.body.token}`)
        .send(newBlog)
        
    
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
      const titles = blogsAtEnd.map(n => n.title)
      expect(titles).toContain(
        'Fullstack open is the best course'
      )
    })
    test('a valid blog without like property can be added', async () => {

      const userLogin = {
        username: 'usertest',
        password: 'test@123'
      }

      const responseToken = await api.post('/api/login')
      .send(userLogin)
      
      const newBlog = {
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      }
    
      await api.post('/api/blogs')
        .set('Authorization', `bearer ${responseToken.body.token}`)
        .send(newBlog)
    
    
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    
      const titles = blogsAtEnd.map(n => n.title)
      expect(titles).toContain(
        'First class tests'
      )
    })
    test('a valid blog without token  cannot be added', async () => {

    
      
      const newBlog = {
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      }
    
      await api.post('/api/blogs')
        .send(newBlog)
        .expect(401)
    
    
    })
    
    test('blog without title or url is not added', async () => {

      const userLogin = {
        username: 'usertest',
        password: 'test@123'
      }

      const responseToken = await api.post('/api/login')
    
      .send(userLogin)
      

      const newBlog = {
        title: "Type wars",
        author: "Robert C. Martin",
        likes: 0,
      }
    
      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${responseToken.body.token}`)
        .send(newBlog)
        .expect(400)
    
      const blogsAtEnd = await helper.blogsInDb()
    
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
  
  })

  
 
  
  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      
      
      const userLogin = {
        username: 'usertest',
        password: 'test@123'
      }

      const responseToken = await api.post('/api/login')
      .send(userLogin)
      
      const newBlog = {
        title: "First class tests 13",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      }
    
      await api.post('/api/blogs')
        .set('Authorization', `bearer ${responseToken.body.token}`)
        .send(newBlog)

      
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart.find(blog => blog.title === newBlog.title)
      await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${responseToken.body.token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        blogsAtStart.length - 1
      )

      const titles = blogsAtEnd.map(r => r.title)

      expect(titles).not.toContain(blogToDelete.title)
    })
  })

  describe('update a blog', () =>{
    test('updated likes of blog with success', async () =>{
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = {...blogsAtStart[0], likes: blogsAtStart[0].likes += 1}
      
      const userLogin = {
        username: 'usertest',
        password: 'test@123'
      }

      const responseToken = await api.post('/api/login')
      .send(userLogin)

      await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `bearer ${responseToken.body.token}`)
      .send(blogToUpdate)
      .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlog =  blogsAtEnd.find(b => b.title === blogToUpdate.title)
      expect(updatedBlog.likes).toBe(blogToUpdate.likes)
    })
  })
})



afterAll(() => {
  mongoose.connection.close()
})