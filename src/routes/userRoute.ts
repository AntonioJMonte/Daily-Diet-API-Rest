import { FastifyInstance } from 'fastify'
import { db } from '../database.js'
import { z } from 'zod'
import crypto, { randomUUID } from 'node:crypto'
import bcrypt from 'bcrypt'

//salts
const saltsRound  = 10

export async function userRoutes(app: FastifyInstance) {

    app.post('/create', async (request, reply) => {

        try {
            //defined types
            const createUsersBodySchema = z.object({
                name: z.string(),
                email: z.email(),
                password: z.string(),
            })

            const { name, email, password } = createUsersBodySchema.parse(request.body)

            // hashing a password
            const passwordHash = await bcrypt.hash(password, saltsRound)

            //inserting into the data base
            await db('users').insert({
                id: crypto.randomUUID(),
                name,
                email,
                password: passwordHash
            })

            return reply.status(201).send(JSON.stringify({message: 'user created successfully'}))
        }
        catch(error) {
            console.error(error)
            return reply.status(400).send(JSON.stringify({message: 'error creating user'}))
        }
    })

    app.post('/login', async (request, reply) => {
        try {
            //defined types
            const createUsersBodySchema = z.object({
            email: z.email(),
            password: z.string(),
            })

            const { email, password } = createUsersBodySchema.parse(request.body)

            //checking it the user exists
            const user = await db('users').where('email', email).first()
            if (!user) return reply.status(404).send(JSON.stringify({message: 'email not found'}))

            //checking if the password is valid
            const verifiPasswordExists = await bcrypt.compare(password, user.password)
            if (!verifiPasswordExists) {
                return reply.status(404).send(JSON.stringify({message: 'invalid password'}))
            }


            //creating session id
            reply.setCookie('sessionId', user.id, {
                path: '/', //availabre on all routes
                maxAge: 60 * 60 * 24 *7, // 7 days
            })

            return reply.status(201).send(JSON.stringify({message: 'login successful'}))

        }
        catch(error) {
            console.error(error)
            return reply.status(400).send(JSON.stringify({message: 'error when logging in'}))
        }
    })


    // app.get('/listUsers', async (request, reply) => {

    //     const allUsers = await db('users').select('*')
    //     return reply.status(201).send({users: allUsers})
    // })

    // app.delete('/delete', async (request, reply) => {
    //     await db('users').delete('*')
    // })
}