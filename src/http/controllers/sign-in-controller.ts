import type { FastifyReply, FastifyRequest } from 'fastify'

import { z } from 'zod'
import { compare } from 'bcryptjs'

import { prisma } from '@/lib/prisma'

const signInBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export class SignInController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = signInBodySchema.parse(request.body)

    const userByProvidedEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!userByProvidedEmail) {
      return reply.status(401).send({
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials provided',
      })
    }

    const passwordsMatch = 
      await compare(password, userByProvidedEmail.passwordHash)

    if (!passwordsMatch) {
      return reply.status(401).send({
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials provided',
      })
    }

    const accessTokenPayload = {
      sub: userByProvidedEmail.id,
    }

    const accessToken = await reply.jwtSign(accessTokenPayload, {
      expiresIn: '7d',
    })

    return reply.status(200).send({
      accessToken,
    })
  }
}