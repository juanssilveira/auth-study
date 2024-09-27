import type { FastifyReply, FastifyRequest } from 'fastify'

import { prisma } from '@/lib/prisma'

export class ProfileController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { sub } = request.user

    const userById = await prisma.user.findUnique({
      where: {
        id: sub,
      }
    })

    if (!userById) {
      return reply.status(404).send({
        error: 'RESOURCE_NOT_FOUND',
        message: 'Resource not found'
      })
    }

    delete userById.passwordHash

    return reply.status(200).send({
      user: userById,
    })
  }
}