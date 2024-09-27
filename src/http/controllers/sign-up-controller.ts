import type { FastifyReply, FastifyRequest } from 'fastify'

import { z } from 'zod'
import { hash } from 'bcryptjs'

import { prisma } from '@/lib/prisma'

const signUpBodySchema = z.object({
  name: z.string().min(3),
  avatarUrl: z.string().nullable().optional(),
  email: z.string().email(),
  password: z.string().min(6),
})

export class SignUpController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { name, email, password, avatarUrl = null } = 
      signUpBodySchema.parse(request.body)

    const emailAlreadyRegistered = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (emailAlreadyRegistered) {
      return reply.status(409).send({
        error: 'EMAIL_ALREADY_REGISTERED',
        message: 'Email already registered'
      })
    }

    await prisma.user.create({
      data: {
        name,
        email,
        avatarUrl,
        passwordHash: await hash(password, 6),
      }
    })

    return reply.status(201).send()
  }
}