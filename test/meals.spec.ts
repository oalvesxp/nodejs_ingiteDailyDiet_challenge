import { it, describe, beforeAll, beforeEach, afterAll } from 'vitest'
import { execSync } from 'node:child_process'
import { app } from '../src/app'
import request from 'supertest'

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
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
})
