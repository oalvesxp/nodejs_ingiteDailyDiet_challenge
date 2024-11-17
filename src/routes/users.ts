import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (req, rep) => {
    const createUsersBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
    })

    /** Check if the user already have cookies */
    let { sessionId } = req.cookies
    if (!sessionId) {
      sessionId = randomUUID()
      rep.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    const { name, email } = createUsersBodySchema.parse(req.body)

    /** Checks if the user is already registered */
    const userByEmail = await knex('users').where({ email }).first()
    if (userByEmail) {
      return rep.status(400).send({ message: 'User already exists' })
    }

    await knex('users').insert({
      id: randomUUID(),
      session_id: sessionId,
      name,
      email,
    })

    return rep.status(201).send()
  })
}
