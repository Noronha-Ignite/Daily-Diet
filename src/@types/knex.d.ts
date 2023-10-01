import 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      password_hash: string
    }

    meals: {
      id: string
      user_id: string
      name: string
      description?: string
      is_within_diet: boolean
      created_at: string
    }
  }
}
