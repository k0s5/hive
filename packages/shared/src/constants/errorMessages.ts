export const ERROR_MESSAGES = {
  COMMON: {
    REQUIRED: (entityName: string) => `${entityName} is required`,
    MIN_LENGTH: (entityName: string, length: number) =>
      `${entityName} must be at least ${length} characters long`,
    MAX_LENGTH: (entityName: string, length: number) =>
      `${entityName} cannot exceed ${length} characters`,
    INVALID_FORMAT: (entityName: string) => `${entityName} has invalid format`,
  },
  AUTH: {
    USERNAME_MATCH: `Username can only contain letters, numbers, underscore, and dash`,
    PASSWORD_MATCH: `Password must contain at least one uppercase letter, one lowercase letter, and one number`,
  },
}
