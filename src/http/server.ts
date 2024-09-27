import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'

import { env } from '@/config/env'

import { applicationRoutes } from './routes'

const app = fastify()

app.register(fastifyJwt, {
  secret: env.APPLICATION_JWT_SECRET,
})

app.register(applicationRoutes)

app
  .listen({
    host: '0.0.0.0',
    port: 3000,
  })
  .then(() => {
    console.log('[LOG] Server is running')
  })
