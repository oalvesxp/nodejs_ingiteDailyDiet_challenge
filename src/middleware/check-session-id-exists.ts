import { FastifyRequest, FastifyReply } from 'fastify'
import { knex } from '../database'

export async function checkSessionIdExists(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  const message = 'Unauthorized'

  const { sessionId } = req.cookies
  if (!sessionId) return rep.status(401).send({ error: message })

  const user = await knex('users').where({ session_id: sessionId }).first()
  if (!user) return rep.status(401).send({ error: message })

  req.user = user
}
