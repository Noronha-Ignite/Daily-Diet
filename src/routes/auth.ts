import bcrypt from 'bcrypt'
import { FastifyInstance } from 'fastify'

import { z } from 'zod'
import { knexClient } from '../libs/knexClient'

export const authRoutes = async (app: FastifyInstance) => {
  app.post('/sign-up', async (request, reply) => {
    const createUserSchema = z.object({
      name: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(6),
    })

    const { email, name, password } = createUserSchema.parse(request.body)

    const salt = await bcrypt.genSalt(16)

    const passwordHash = await bcrypt.hash(password, salt)

    const [createUserResponse] = await knexClient('users')
      .insert({
        email,
        name,
        password_hash: passwordHash,
      })
      .returning('id')

    if (!createUserResponse) {
      throw new Error('Error while creating user.')
    }

    const token = app.jwt.sign({ id: createUserResponse.id })

    return reply.status(201).send({ token })
  })

  app.post('/sign-in', async (request, reply) => {
    const signUserInSchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })

    const { email, password } = signUserInSchema.parse(request.body)

    const user = await knexClient('users').select('*').where({ email }).first()

    if (!user) {
      throw new Error('User not found.')
    }

    const doesPasswordMatch = await bcrypt.compare(password, user.password_hash)

    if (!doesPasswordMatch) {
      throw new Error('Invalid email or password.')
    }

    const token = app.jwt.sign({ id: user.id })

    return reply.status(201).send({ token })
  })
}
