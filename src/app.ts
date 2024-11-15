import fastify from "fastify"
import cookie from '@fastify/cookie'
import { usersRoutes } from "./routes/users"

export const app = fastify()

app.register(cookie)

/** Log for requests API */
app.addHook('preHandler', async (req) => {
    console.log(`[${req.method}] ${req.url}`)
})

app.register(usersRoutes, {
    prefix: 'users',
})
