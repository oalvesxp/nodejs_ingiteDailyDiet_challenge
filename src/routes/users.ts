import { FastifyInstance } from "fastify"
import { knex } from "../database"
import { z } from "zod"

export async function usersRoutes(app: FastifyInstance) {
    app.get('/', async (req, rep) => {
        return rep.status(200).send({'Hello': 'World'})
    })
}
