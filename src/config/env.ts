import { z } from 'zod'

const envSchema = z.object({
  APPLICATION_JWT_SECRET: z.string().min(1),
})

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  throw new Error('Invalid enviroment variables ❌')
}

export const env = _env.data
