import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { checkSessionIdExists } from '../middleware/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', { preHandler: [checkSessionIdExists] }, async (req, rep) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      isOnDiet: z.boolean(),
      date: z.coerce.date(),
    })

    const { name, description, isOnDiet, date } = createMealBodySchema.parse(
      req.body,
    )

    await knex('meals').insert({
      id: randomUUID(),
      user_id: req.user?.id,
      name,
      description,
      is_on_diet: isOnDiet,
      date: date.getTime(),
    })

    return rep.status(201).send()
  })

  app.get('/', { preHandler: [checkSessionIdExists] }, async (req, rep) => {
    const meals = await knex('meals').where({ user_id: req.user?.id })

    return rep.status(200).send({ meals })
  })
}
