import { FastifyInstance, FastifyRequest } from 'fastify'
import { knexClient } from '../libs/knexClient'

export const usersRoutes = async (app: FastifyInstance) => {
  app.addHook('preHandler', async (req) => {
    await req.jwtVerify()
  })

  app.get('/meals', async (req, reply) => {
    const { user } = req as InjectUser<FastifyRequest>

    const meals = await knexClient('meals')
      .select('*')
      .where({ user_id: user.id })

    return reply.status(200).send({ meals })
  })

  app.get('/metrics', async (req, reply) => {
    const { user } = req as InjectUser<FastifyRequest>

    const userMeals = await knexClient('meals')
      .select('is_within_diet')
      .where({
        user_id: user.id,
      })
      .orderBy('meal_date')

    let tempBestSequence = 0

    const metrics = userMeals.reduce(
      (acc, { is_within_diet: isWithinDiet }) => {
        acc.mealsAmount++

        if (isWithinDiet) {
          tempBestSequence++
          acc.mealsWithinDiet++
        } else {
          tempBestSequence = 0
          acc.mealsNotWithinDiet++
        }

        if (tempBestSequence > acc.bestSequence) {
          acc.bestSequence = tempBestSequence
        }

        return acc
      },
      {
        mealsAmount: 0,
        mealsWithinDiet: 0,
        mealsNotWithinDiet: 0,
        bestSequence: 0,
      },
    )

    return reply.status(200).send({ metrics })
  })
}
