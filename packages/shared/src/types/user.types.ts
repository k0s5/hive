export interface User {
  id: string
  email: string
  username: string
  firstName?: string
  lastName?: string
  avatar?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}
