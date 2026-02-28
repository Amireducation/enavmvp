import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Validation helpers
export const ValidationRules = {
  email: {
    required: "Email is required",
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    patternMessage: "Please enter a valid email address"
  },
  password: {
    required: "Password is required",
    minLength: { value: 8, message: "Password must be at least 8 characters" },
    pattern: /^(?=.*[A-Z])(?=.*\d)/,
    patternMessage: "Password must contain uppercase letter and number"
  },
  fullName: {
    required: "Full name is required",
    minLength: { value: 2, message: "Name must be at least 2 characters" }
  },
  phoneNumber: {
    pattern: /^(\+251|0)?9\d{8}$/,
    patternMessage: "Please enter a valid Ethiopian phone number"
  },
  file: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ["application/pdf", "image/png", "image/jpeg", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
  }
}

export function validateEmail(email: string): boolean {
  return ValidationRules.email.pattern.test(email)
}

export function validatePassword(password: string): boolean {
  return password.length >= 8 && ValidationRules.password.pattern.test(password)
}

export function validatePhoneNumber(phone: string): boolean {
  return ValidationRules.phoneNumber.pattern.test(phone)
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (file.size > ValidationRules.file.maxSize) {
    return { valid: false, error: "File size exceeds 10MB limit" }
  }
  if (!ValidationRules.file.allowedTypes.includes(file.type)) {
    return { valid: false, error: "File type not allowed" }
  }
  return { valid: true }
}

export interface FormErrorMap {
  [key: string]: string | string[]
}

export function formatValidationErrors(errors: any): FormErrorMap {
  const formatted: FormErrorMap = {}
  if (errors.fieldErrors) {
    Object.entries(errors.fieldErrors).forEach(([key, value]) => {
      formatted[key] = Array.isArray(value) ? value[0] : value
    })
  }
  return formatted
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'An unexpected error occurred'
}
