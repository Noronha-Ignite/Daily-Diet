type InjectUser<T> = {
  user: {
    id: string
    iat: number
  }
} & Omit<T, 'user'>
