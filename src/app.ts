import jwtPlugin from '@fastify/jwt'
import fastify from 'fastify'

import { env } from './env'
import { authRoutes } from './routes/auth'
import { mealsRoutes } from './routes/meals'
import { usersRoutes } from './routes/users'

export const app = fastify()

app.register(jwtPlugin, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: '4h',
  },
})

app.register(authRoutes)
app.register(mealsRoutes, { prefix: 'meals' })
app.register(usersRoutes, { prefix: 'users' })
