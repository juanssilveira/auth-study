import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkAuthentication(
  request: FastifyRequest, 
  reply: FastifyReply,
) {
  try {
    await request.jwtVerify()
  } catch {
    return reply.status(401).send({
      error: 'UNAUTHORIZED',
      message: 'Invalid access token provided',
    })
  }
}