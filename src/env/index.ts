import { config } from 'dotenv'
import { z } from 'zod'

/** Specific vars configured for TEST env */
if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test.local' })
} else {
  config()
}

/** Type for env VARS */
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']).default('sqlite'),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(9080),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variables!', _env.error.format())
  throw new Error('Invalid environment variables')
}

export const env = _env.data
