import { FastifyInstance } from "fastify";
import { z } from 'zod'
import { db } from '../database.js'
import crypto, { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from '../middlewares/check-sessionId-exist.js'


export async function mealsRoutes (app :FastifyInstance) {

    //register meal
    app.post('/register', {
        preHandler: [checkSessionIdExists]
    } ,async (request, reply) => {
        
        try {
            //defined types
            const createMealsBodySchema = z.object({
                name: z.string(),
                description: z.string(),
                diet: z.enum(['onDiet', 'noDiet']),
            })
    
            const { name, description, diet} = createMealsBodySchema.parse(request.body)

            const userId = request.cookies.sessionId;
    
            await db('meal').insert({
                id: crypto.randomUUID(),
                name,
                description,
                diet,
                date: new Date().toISOString().slice(0, 10),  // yyyy-mm-dd
                hour: new Date().toTimeString().slice(0, 8),
                userId: userId,
            })
            
            return reply.status(201).send(JSON.stringify({message: 'meal registered successful'}))

        } 
        catch (error) {
            console.error(error)
            return reply.status(400).send(JSON.stringify({message: 'error registering meal'}))
        }
    })
}