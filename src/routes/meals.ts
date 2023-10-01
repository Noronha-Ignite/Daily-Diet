import { FastifyInstance } from 'fastify'

export const mealsRoutes = async (app: FastifyInstance) => {
  app.addHook('preHandler', async (req) => {
    await req.jwtVerify()
  })

  app.post('/', (req, reply) => {
    // const user = req.user as UserTokenPayload

    return reply.status(201).send()
  })
}
