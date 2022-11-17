const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

describe('addition of a new user',  () => {
    test('user without username or password is not added', async () => {
        const newUser = {
            name: "Harvey Specter"
        }

        const result =  await api.post('/api/users')
        .send(newUser)
        .expect(400)
        expect(result.body.error).toContain('required')
    })

    test('user with username lenght is shorter', async () => {
        const newUser = {
            name: "Harvey Specter",
            username: "h",
            password: "123123"
        }

        const result = await api.post('/api/users')
        .send(newUser)
        .expect(400)
        expect(result.body.error).toContain('is shorter than the minimum allowed length (3)')
    })

    test('user with password lenght is shorter', async () => {
        const newUser = {
            name: "Harvey Specter",
            username: "harvey",
            password: "12"
        }

        const result = await api.post('/api/users')
        .send(newUser)
        .expect(400)

        expect(result.body.error).toContain('is shorter than the minimum allowed length (3)')
    })
})


afterAll(() => {
    mongoose.connection.close()
})