import { z } from 'zod'
import { VALIDATION_RULES } from '../constants'
import {
  emailSchema,
  firstNameSchema,
  lastNameSchema,
  passwordSchema,
  usernameSchema,
} from './entities'

// User validation schemas
export const SigninSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export const SignupSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
})

export const UpdateUserSchema = z.object({
  firstName: firstNameSchema.optional(),
  lastName: lastNameSchema.optional(),
  avatar: z.string().url().optional(),
})

// Chat validation schemas
export const CreateChatSchema = z.object({
  type: z.enum(['direct', 'group']),
  name: z
    .string()
    .min(VALIDATION_RULES.CHAT.NAME_MIN_LENGTH)
    .max(VALIDATION_RULES.CHAT.NAME_MAX_LENGTH)
    .optional(),
  description: z
    .string()
    .max(VALIDATION_RULES.CHAT.DESCRIPTION_MAX_LENGTH)
    .optional(),
  participantIds: z
    .array(z.string())
    .min(1, 'At least one participant required'),
})

export const UpdateChatSchema = z.object({
  name: z
    .string()
    .min(VALIDATION_RULES.CHAT.NAME_MIN_LENGTH)
    .max(VALIDATION_RULES.CHAT.NAME_MAX_LENGTH)
    .optional(),
  description: z
    .string()
    .max(VALIDATION_RULES.CHAT.DESCRIPTION_MAX_LENGTH)
    .optional(),
  avatar: z.string().url().optional(),
})

// Message validation schemas
export const SendMessageSchema = z.object({
  chatId: z.string().min(1, 'Chat ID required'),
  content: z
    .string()
    .min(1, 'Message content required')
    .max(VALIDATION_RULES.MESSAGE.CONTENT_MAX_LENGTH, 'Message too long'),
  type: z.enum(['text', 'image', 'file', 'audio', 'video']).default('text'),
  replyTo: z.string().optional(),
})

export const UpdateMessageSchema = z.object({
  content: z
    .string()
    .min(1, 'Message content required')
    .max(VALIDATION_RULES.MESSAGE.CONTENT_MAX_LENGTH, 'Message too long'),
})

// Pagination schema
export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type SigninSchema = z.infer<typeof SigninSchema>
export type SignupSchema = z.infer<typeof SignupSchema>
export type UpdateUserSchema = z.infer<typeof UpdateUserSchema>
export type CreateChatSchema = z.infer<typeof CreateChatSchema>
export type UpdateChatSchema = z.infer<typeof UpdateChatSchema>
export type SendMessageSchema = z.infer<typeof SendMessageSchema>
export type UpdateMessageSchema = z.infer<typeof UpdateMessageSchema>
export type PaginationSchema = z.infer<typeof PaginationSchema>
