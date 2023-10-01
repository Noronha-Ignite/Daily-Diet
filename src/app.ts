import jwtPlugin from '@fastify/jwt'
import fastify from 'fastify'

import { env } from './env'
import { authRoutes } from './routes/auth'

export const app = fastify()

app.register(jwtPlugin, {
  secret: env.JWT_SECRET,
})

app.register(authRoutes)
