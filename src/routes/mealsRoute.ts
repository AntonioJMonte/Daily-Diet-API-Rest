import { FastifyInstance } from "fastify";
import { z } from 'zod'
import { db } from '../database.js'
import crypto, { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from '../middlewares/check-sessionId-exist.js'


export async function mealsRoutes (app :FastifyInstance) {

    //register meal
    app.post('/register', { preHandler: [checkSessionIdExists] } ,async (request, reply) => {
        
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

    //listing meals
    app.get('/list', { preHandler: [checkSessionIdExists] } ,async (request, reply) => {
        try {
            
            const userId = request.cookies.sessionId

            const mealsList = await db('meal').where('userId', userId).select('*')    
            return reply.status(201).send({mealsList})
        } 
        catch (error) {
            console.error(error)
            return reply.status(201).send(JSON.stringify( {message: 'error when listing meals' }))

        }
    })

    //list specific meal
    app.get('/list/:id', { preHandler: [checkSessionIdExists] } ,async (request, reply) => {
        try {

            const getMealsPamansSchema = z.object({
                id: z.uuid(),
            })

            const { id } = getMealsPamansSchema.parse(request.params)
            const userId = request.cookies.sessionId

            const mealsList = await db('meal').where({id: id, userId: userId}).first()
            return reply.status(201).send({mealsList})
        } 
        catch (error) {
            console.error(error)
            return reply.status(201).send(JSON.stringify( {message: 'error when listing specific meal' }))

        }
    })

    //edit specific meal
    app.put('/edit/:id', { preHandler: [checkSessionIdExists] } ,async (request, reply) => {
        try {
            //defined types
            const createMealsBodySchema = z.object({
                name: z.string(),
                description: z.string(),
                diet: z.enum(['onDiet', 'noDiet']),
            })

            const getMealsPamansSchema = z.object({
                id: z.uuid(),
            })
    
            const { name, description, diet} = createMealsBodySchema.parse(request.body)
            const { id } = getMealsPamansSchema.parse(request.params)

            const userId = request.cookies.sessionId;
    
            const mealUpdated = await db('meal').where({id: id, userId: userId}).update({
                name, 
                description,
                diet,
                updated_at: new Date().toISOString(),
            })

            if(!mealUpdated) return reply.status(404).send(JSON.stringify({message: 'meal not found'}))
            
            return reply.status(201).send(JSON.stringify({message: 'meal edited successful'}))

        } 
        catch (error) {
            console.error(error)
            return reply.status(400).send(JSON.stringify({message: 'error when editig meal'}))
        }
    })

    //fetching metrics 
    app.get('/metrics', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
        try {
            const userId = request.cookies.sessionId

            const meals = await db('meal')
                .where('userId', userId)
                .orderBy('date', 'asc') 
                .orderBy('hour', 'asc')
                .select()

            const totalMeals = meals.length
            
            const totalMealsOnDiet = meals.filter(meal => meal.diet === 'onDiet').length
            
            const totalMealsOffDiet = totalMeals - totalMealsOnDiet

            let bestSequence = 0
            let currentSequence = 0

            for (const meal of meals) {
                if (meal.diet === 'onDiet') {
                    currentSequence += 1
                } else {
                    if (currentSequence > bestSequence) {
                        bestSequence = currentSequence
                    }
                    currentSequence = 0
                }
            }

            if (currentSequence > bestSequence) {
                bestSequence = currentSequence
            }

            return reply.status(200).send({
                totalMeals,
                totalMealsOnDiet,
                totalMealsOffDiet,
                bestSequence
            })

        } catch (error) {
            console.error(error)
            return reply.status(500).send({ message: 'Erro when fetching metrics' })
        }
    })
}