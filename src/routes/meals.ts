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
    const meals = await knex('meals')
      .where({ user_id: req.user?.id })
      .orderBy('date', 'desc')

    return rep.status(200).send({ meals })
  })

  app.get('/:id', { preHandler: [checkSessionIdExists] }, async (req, rep) => {
    const paramsSchema = z.object({ id: z.string().uuid() })
    const { id } = paramsSchema.parse(req.params)

    const meal = await knex('meals').where({ id }).first()
    if (!meal) return rep.status(404).send({ error: 'Meal not found' })

    return rep.status(200).send({ meal })
  })

  app.put('/:id', { preHandler: [checkSessionIdExists] }, async (req, rep) => {
    const paramsSchema = z.object({ id: z.string().uuid() })
    const { id } = paramsSchema.parse(req.params)

    const bodySchema = z.object({
      name: z.string(),
      description: z.string(),
      isOnDiet: z.boolean(),
      date: z.coerce.date(),
    })

    const { name, description, isOnDiet, date } = bodySchema.parse(req.body)

    const meal = await knex('meals').where({ id }).first()
    if (!meal) return rep.status(404).send({ error: 'Meal not found' })

    await knex('meals').where({ id }).update({
      name,
      description,
      is_on_diet: isOnDiet,
      date: date.getTime(),
    })

    return rep.status(204).send()
  })

  app.delete(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (req, rep) => {
      const paramsSchema = z.object({ id: z.string().uuid() })
      const { id } = paramsSchema.parse(req.params)

      const getMealResponse = await knex('meals').where({ id }).first()
      if (!getMealResponse)
        return rep.status(404).send({ error: 'Meal not found' })

      await knex('meals').where({ id }).delete()

      return rep.status(204).send()
    },
  )
}
