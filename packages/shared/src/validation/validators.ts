import { z } from 'zod'
import { VALIDATION_RULES } from '../constants'

export const emailSchema = z.string().email('Invalid email format')

export const usernameSchema = z
  .string()
  .min(
    VALIDATION_RULES.AUTH.USERNAME_MIN_LENGTH,
    `Username too short. Minimum ${VALIDATION_RULES.AUTH.USERNAME_MIN_LENGTH} characters long.`
  )
  .max(
    VALIDATION_RULES.AUTH.USERNAME_MAX_LENGTH,
    `Username too long. Maximum ${VALIDATION_RULES.AUTH.USERNAME_MAX_LENGTH} characters long.`
  )
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    'Username can only contain letters, numbers, underscore, and dash'
  )

export const passwordSchema = z
  .string()
  .min(
    VALIDATION_RULES.AUTH.PASSWORD_MIN_LENGTH,
    `Password must be at least ${VALIDATION_RULES.AUTH.PASSWORD_MIN_LENGTH} characters long`
  )
  .max(
    VALIDATION_RULES.AUTH.PASSWORD_MAX_LENGTH,
    `Password cannot exceed ${VALIDATION_RULES.AUTH.PASSWORD_MAX_LENGTH} characters`
  )
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  )

export const firstNameSchema = z
  .string()
  .min(
    VALIDATION_RULES.AUTH.NAME_MIN_LENGTH,
    `First name must be at least ${VALIDATION_RULES.AUTH.NAME_MIN_LENGTH} characters long`
  )
  .max(
    VALIDATION_RULES.AUTH.NAME_MAX_LENGTH,
    `First name cannot exceed ${VALIDATION_RULES.AUTH.NAME_MAX_LENGTH} characters`
  )

export const lastNameSchema = z
  .string()
  .min(
    VALIDATION_RULES.AUTH.NAME_MIN_LENGTH,
    `Last name must be at least ${VALIDATION_RULES.AUTH.NAME_MIN_LENGTH} characters long`
  )
  .max(
    VALIDATION_RULES.AUTH.NAME_MAX_LENGTH,
    `Last name cannot exceed ${VALIDATION_RULES.AUTH.NAME_MAX_LENGTH} characters`
  )
