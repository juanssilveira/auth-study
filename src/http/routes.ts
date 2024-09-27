import type { FastifyInstance } from 'fastify'

import { checkAuthentication } from './middlewares/check-authentication'

import { SignUpController } from './controllers/sign-up-controller'
import { SignInController } from './controllers/sign-in-controller'
import { ProfileController } from './controllers/profile-controller'

export async function applicationRoutes(app: FastifyInstance) {
  app.post('/sign-up', new SignUpController().handle)
  app.post('/sign-in', new SignInController().handle)

  app.get('/me', 
    {
      preHandler: [checkAuthentication],
    },
    new ProfileController().handle,
  )
}