import { expect, it, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import { db } from '../src/database.js'
import request from 'supertest'
import { app } from '../src/app.js'
import { any } from 'zod'

describe('meals routes', () => {

    beforeAll(async () => {
        await app.ready()
        execSync('npm run knex migrate:rollback --all', { env: process.env, stdio: 'ignore' })
        execSync('npm run knex migrate:latest', { env: process.env, stdio: 'ignore' })
    })

    afterAll(async () => {
        await app.close()
    })

    beforeEach( async () => {
        await db('meal').delete()
        await db('users').delete()
        // execSync('npm run knex migrate:rollback --all', { 
        //     env: process.env, 
        //     stdio: 'ignore' 
        // })
        
        // execSync('npm run knex migrate:latest', { 
        //     env: process.env, 
        //     stdio: 'ignore' 
        // })
        // await db.migrate.rollback(undefined, true) 
        // // Refaz as migrações (recria as tabelas zeradas)
        // await db.migrate.latest()
    }, 40000)


    it('should be able to create a new user and login', async () => {
        await request(app.server)
            .post('/user/create')
            .send({
                name: "John Doe",
                email: "john@example.com",
                password: "123"
            })
            .expect(201)

        const loginResponse = await request(app.server)
            .post('/user/login')
            .send({
                email: "john@example.com",
                password: "123"
            })
            .expect(201)
        
        const cookies = loginResponse.get('Set-Cookie')
        expect(cookies).toBeTruthy()
    })


    it('should be able to create a new meal', async () => {

        
        await request(app.server).post('/user/create').send({ name: "John", email: "john@test.com", password: "123" })
        const loginResponse = await request(app.server).post('/user/login').send({ email: "john@test.com", password: "123" })
        const cookies = loginResponse.get('Set-Cookie') as string[]
        
        await request(app.server)
            .post('/meals/register')
            .set('Cookie', cookies)     
            .send({
                name: "Salada de fruta",
			    description: "salada com uva e banana",
                diet: "onDiet"
            })
            .expect(201)

    })

    it('should be able to list all meals', async () => {

        await request(app.server).post('/user/create').send({ name: "John", email: "john@test.com", password: "123" })
        const loginResponse = await request(app.server).post('/user/login').send({ email: "john@test.com", password: "123" })
        const cookies = loginResponse.get('Set-Cookie') as string[]
        
        await request(app.server)
            .post('/meals/register')
            .set('Cookie', cookies)     
            .send({
                name: "Salada de fruta",
			    description: "salada com uva e banana",
                diet: "onDiet"
            })
        
        const listMealResponse = await request(app.server)
            .get('/meals/list')
            .set('Cookie', cookies)
            .expect(201)

        expect(listMealResponse.body.mealsList).toEqual([
            expect.objectContaining({
                name: "Salada de fruta",
                diet: "onDiet",
            })
        ])
    })


    it('should be able to list specific meal', async () => {
        
        await request(app.server).post('/user/create').send({ 
            name: "John", email: "john@edit.com", password: "123" 
        })

        const loginResponse = await request(app.server).post('/user/login').send({ 
            email: "john@edit.com", password: "123" 
        })

        const cookies = loginResponse.get('Set-Cookie') as string[]

        await request(app.server)
            .post('/meals/register')
            .set('Cookie', cookies)
            .send({
                name: "Salada de fruta",
			    description: "salada com uva e banana",
                diet: "onDiet"
            })
        

        const listMealResponse = await request(app.server)
            .get('/meals/list')
            .set('Cookie', cookies)
            .expect(201)


        
        const mealId = listMealResponse.body.mealsList[0].id

        const getMealResponse = await request(app.server)
        .get(`/meals/list/${mealId}`)
        .set('Cookie', cookies)
        .expect(201)

        
        expect(getMealResponse.body.mealsList).toEqual(
            expect.objectContaining({
                name: "Salada de fruta",
                diet: "onDiet"
            })
        )
    })

    
    it('should be able to edit a meal', async () => {

        await request(app.server).post('/user/create').send({ 
            name: "John", email: "john@edit.com", password: "123" 
        })

        const loginResponse = await request(app.server).post('/user/login').send({ 
            email: "john@edit.com", password: "123" 
        })

        const cookies = loginResponse.get('Set-Cookie') as string[]

        await request(app.server)
            .post('/meals/register')
            .set('Cookie', cookies)
            .send({
                name: "Salada de fruta",
			    description: "salada com uva e banana",
                diet: "onDiet"
            })
        

        const listMealResponse = await request(app.server)
            .get('/meals/list')
            .set('Cookie', cookies)
            .expect(201)


        
        const mealId = listMealResponse.body.mealsList[0].id

        await request(app.server)
            .put(`/meals/edit/${mealId}`)
            .set('Cookie', cookies)
            .send({
                name: "Salada de fruta",
			    description: "salada com uva, banana e maçã",
                diet: "onDiet"
            })
            .expect(201)
    })

    
it('should be able to get user metrics', async () => {

        await request(app.server).post('/user/create').send({ name: "John", email: "john@test.com", password: "123" })
        const loginResponse = await request(app.server).post('/user/login').send({ email: "john@test.com", password: "123" })
        const cookies = loginResponse.get('Set-Cookie') as string[]

        await request(app.server).post('/meals/register').set('Cookie', cookies).send({
            name: "Café", description: "Café preto", diet: "onDiet"
        })

        await request(app.server).post('/meals/register').set('Cookie', cookies).send({
            name: "Almoço", description: "Arroz e frango", diet: "onDiet"
        })

        await request(app.server).post('/meals/register').set('Cookie', cookies).send({
            name: "Hamburguer", description: "Podrão", diet: "noDiet"
        })

        await request(app.server).post('/meals/register').set('Cookie', cookies).send({
            name: "Jantar", description: "Salada", diet: "onDiet"
        })

        const metricsResponse = await request(app.server)
            .get('/meals/metrics') 
            .set('Cookie', cookies)
            .expect(200)

        expect(metricsResponse.body).toEqual({
            totalMeals: 4,
            totalMealsOnDiet: 3,
            totalMealsOffDiet: 1,
            bestSequence: 2
        })
    })    
})

