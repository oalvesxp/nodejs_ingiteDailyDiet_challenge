import { it, describe, beforeAll, beforeEach, afterAll, expect } from 'vitest'
import { execSync } from 'node:child_process'
import { app } from '../src/app'
import request from 'supertest'

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    execSync('npm run knex -- migrate:rollback')
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex -- migrate:rollback')
    execSync('npm run knex -- migrate:latest')
  })

  it('Sould be able to create a new meal', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'Jhon Doe',
        email: 'jhon.doe@example.com',
      })
      .expect(201)

    const cookies: string[] | undefined = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies ?? [])
      .send({
        name: 'Breakfast',
        description: "It's a breakfast",
        isOnDiet: true,
        date: new Date(),
      })
      .expect(201)
  })

  it('Should be able to list all meals from a user', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'Jhon Doe',
        email: 'jhon.doe@example.com',
      })
      .expect(201)

    const cookies: string[] | undefined = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies ?? [])
      .send({
        name: 'Breakfast',
        description: "It's a breakfast",
        isOnDiet: true,
        date: new Date(),
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies ?? [])
      .send({
        name: 'Lunch',
        description: "It's a lunch",
        isOnDiet: false,
        date: new Date(Date.now() + 24 * 60 * 60), // 1 day after
      })
      .expect(201)

    const getMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies || [])
      .expect(200)

    expect(getMealsResponse.body.meals).toHaveLength(2)
    expect(getMealsResponse.body.meals[0].name).toBe('Lunch')
    expect(getMealsResponse.body.meals[1].name).toBe('Breakfast')
  })

  it('Should be able to list a meal from a user by ID', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
      })
      .expect(201)

    const cookies: string[] | undefined = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies || [])
      .send({
        name: 'Breakfast',
        description: "It's a breakfast",
        isOnDiet: true,
        date: new Date(),
      })
      .expect(201)

    const getMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies || [])
      .send()

    const id = getMealsResponse.body.meals[0].id

    const getMealResponse = await request(app.server)
      .get(`/meals/${id}`)
      .set('Cookie', cookies || [])
      .send()
      .expect(200)
    expect(getMealResponse.body).toEqual({
      meal: expect.objectContaining({
        name: 'Breakfast',
        description: "It's a breakfast",
        is_on_diet: 1,
        date: expect.any(Number),
      }),
    })
  })

  it('Should be able to update a meal from user', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
      })
      .expect(201)

    const cookies: string[] | undefined = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies || [])
      .send({
        name: 'Breakfast',
        description: "It's a breakfast",
        isOnDiet: true,
        date: new Date(),
      })
      .expect(201)

    const getMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies || [])
      .send()

    const id = getMealsResponse.body.meals[0].id

    await request(app.server)
      .put(`/meals/${id}`)
      .set('Cookie', cookies || [])
      .send({
        name: 'Lunch',
        description: "It's a lunch",
        isOnDiet: true,
        date: new Date(),
      })
      .expect(204)
  })

  it('Should be able to delete a meal from user', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'Jhon Doe',
        email: 'jhon.doe@example.com',
      })
      .expect(201)

    const cookies: string[] | undefined = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies || [])
      .send({
        name: 'Breakfast',
        description: "It's a breakfast",
        isOnDiet: true,
        date: new Date(),
      })
      .expect(201)

    const getMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies || [])
      .send()

    const id = getMealsResponse.body.meals[0].id
    console.log(id)

    await request(app.server)
      .delete(`/meals/${id}`)
      .set('Cookie', cookies || [])
      .send()
      .expect(204)
  })

  it('Should be able to list metrics from user', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'Jhon Doe',
        email: 'jhon.doe@example.com',
      })
      .expect(201)

    const cookies: string[] | undefined = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies ?? [])
      .send({
        name: 'Breakfast',
        description: "It's a breakfast",
        isOnDiet: true,
        date: new Date(),
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies ?? [])
      .send({
        name: 'Brunch',
        description: "It's a brunch",
        isOnDiet: false,
        date: new Date(Date.now() + 24 * 60 * 60), // 1 day after
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies ?? [])
      .send({
        name: 'Lunch',
        description: "It's a lunch",
        isOnDiet: true,
        date: new Date(Date.now() + 24 * 60 * 60), // 1 day after
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies ?? [])
      .send({
        name: 'Dinner',
        description: "It's a Dinner",
        isOnDiet: true,
        date: new Date(Date.now() + 24 * 60 * 60), // 1 day after
      })
      .expect(201)

    const getMetricsResponse = await request(app.server)
      .get('/meals/metrics')
      .set('Cookie', cookies || [])
      .expect(200)

    expect(getMetricsResponse.body.metrics).toEqual({
      totalMeals: 4,
      totalMealsOnDiet: 3,
      totalMealsOffDiet: 1,
      bestOnDietSequence: 2,
    })
  })
})
