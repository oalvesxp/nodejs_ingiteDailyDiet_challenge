import { it, describe, beforeAll, beforeEach, afterAll } from 'vitest'
import { execSync } from 'node:child_process'
import { app } from '../src/app'
import request from 'supertest'

describe('Users routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(async () => {
    execSync('npm run knex -- migrate:rollback')
    execSync('npm run knex -- migrate:latest')
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should be able to create a new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Jhon Doe',
        email: 'jhon.doe@example.com',
      })
      .expect(201)
  })
})
