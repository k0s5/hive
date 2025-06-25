import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common'
import { Response } from 'express'
import { ValidationError } from 'class-validator'
import { ValidationException } from '../exceptions/validation.exception'

interface ValidationErrorDetail {
  message: string
  constraint: string
}

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    // Extract ValidationError objects from our custom exception
    const validationErrors = exception.validationErrors

    // Format errors into the desired structure
    const formattedErrors = this.formatValidationErrors(validationErrors)

    return response.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      error: 'Bad Request',
      message: exception.message,
      details: formattedErrors,
    })
  }

  private formatValidationErrors(
    errors: ValidationError[]
  ): Record<string, ValidationErrorDetail[]> {
    const formattedErrors: Record<string, ValidationErrorDetail[]> = {}

    const processError = (error: ValidationError, parentPath = '') => {
      const fieldPath = parentPath
        ? `${parentPath}.${error.property}`
        : error.property

      // Extract error messages and constraint names from constraints
      if (error.constraints) {
        if (!formattedErrors[fieldPath]) {
          formattedErrors[fieldPath] = []
        }

        // Convert constraints object to array of ValidationErrorDetail objects
        Object.entries(error.constraints).forEach(
          ([constraintName, message]) => {
            formattedErrors[fieldPath].push({
              message: message,
              constraint: constraintName,
            })
          }
        )
      }

      // Handle nested validation errors (for objects and arrays)
      if (error.children && error.children.length > 0) {
        error.children.forEach((child: ValidationError) => {
          processError(child, fieldPath)
        })
      }
    }

    errors.forEach((error) => {
      processError(error)
    })

    return formattedErrors
  }
}
