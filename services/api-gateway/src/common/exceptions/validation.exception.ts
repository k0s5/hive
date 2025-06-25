import { BadRequestException } from '@nestjs/common'
import { ValidationError } from 'class-validator'

export class ValidationException extends BadRequestException {
  public validationErrors: ValidationError[]

  constructor(validationErrors: ValidationError[]) {
    // Call parent constructor with a generic message
    super('Validation failed')
    this.validationErrors = validationErrors
  }

  // Optional: Override getResponse to provide custom structure
  getResponse(): string | object {
    return {
      message: this.message,
    }
  }
}
