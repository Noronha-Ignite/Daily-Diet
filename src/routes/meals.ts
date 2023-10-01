import { FastifyInstance, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { knexClient } from '../libs/knexClient'

export const mealsRoutes = async (app: FastifyInstance) => {
  app.addHook('preHandler', async (req) => {
    await req.jwtVerify()
  })

  app.post('/', async (req, reply) => {
    const { user, body } = req as InjectUser<FastifyRequest>

    const createMealBodySchema = z.object({
      name: z.string().min(3),
      description: z.string().optional(),
      mealDate: z.string().datetime().optional(),
      isWithinDiet: z.boolean(),
    })

    const { name, isWithinDiet, description, mealDate } =
      createMealBodySchema.parse(body)

    const [createMealResponse] = await knexClient('meals')
      .insert({
        name,
        description,
        is_within_diet: isWithinDiet,
        meal_date: mealDate,
        user_id: user.id,
      })
      .returning('id')

    return reply.status(201).send({ mealId: createMealResponse.id })
  })

  app.patch('/:mealId', async (req, reply) => {
    const { user, body, params } = req as InjectUser<FastifyRequest>

    const updateMealParamsSchema = z.object({
      mealId: z.string(),
    })

    const { mealId } = updateMealParamsSchema.parse(params)

    const updateMealBodySchema = z.object({
      name: z.string().min(3).optional(),
      description: z.string().optional(),
      isWithinDiet: z.boolean().optional(),
      mealDate: z.string().datetime().optional(),
    })

    const { name, isWithinDiet, description, mealDate } =
      updateMealBodySchema.parse(body)

    await knexClient('meals')
      .update({
        name,
        description,
        is_within_diet: isWithinDiet,
        meal_date: mealDate,
      })
      .where({
        user_id: user.id,
        id: mealId,
      })

    return reply.status(200).send({ data: body })
  })
}
