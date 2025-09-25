// Form validation utilities

export const validators = {
  required: (value) => {
    if (value === null || value === undefined || value === '') {
      return 'This field is required'
    }
    return null
  },

  email: (value) => {
    if (!value) return null
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address'
    }
    return null
  },

  minLength: (min) => (value) => {
    if (!value) return null
    if (value.length < min) {
      return `Must be at least ${min} characters long`
    }
    return null
  },

  maxLength: (max) => (value) => {
    if (!value) return null
    if (value.length > max) {
      return `Must be no more than ${max} characters long`
    }
    return null
  },

  password: (value) => {
    if (!value) return null
    
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(value)
    const hasLowerCase = /[a-z]/.test(value)
    const hasNumbers = /\d/.test(value)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value)

    if (value.length < minLength) {
      return `Password must be at least ${minLength} characters long`
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter'
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter'
    }
    if (!hasNumbers) {
      return 'Password must contain at least one number'
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character'
    }
    return null
  },

  confirmPassword: (originalPassword) => (value) => {
    if (!value) return null
    if (value !== originalPassword) {
      return 'Passwords do not match'
    }
    return null
  },

  name: (value) => {
    if (!value) return null
    const nameRegex = /^[a-zA-Z\s]+$/
    if (!nameRegex.test(value)) {
      return 'Name can only contain letters and spaces'
    }
    if (value.length < 2) {
      return 'Name must be at least 2 characters long'
    }
    if (value.length > 50) {
      return 'Name must be no more than 50 characters long'
    }
    return null
  }
}

// Validate a single field with multiple validators
export function validateField(value, validatorList) {
  for (const validator of validatorList) {
    const error = validator(value)
    if (error) return error
  }
  return null
}

// Validate an entire form
export function validateForm(formData, validationRules) {
  const errors = {}
  let hasErrors = false

  for (const [field, rules] of Object.entries(validationRules)) {
    const error = validateField(formData[field], rules)
    if (error) {
      errors[field] = error
      hasErrors = true
    }
  }

  return { errors, isValid: !hasErrors }
}

// Common validation rule sets
export const validationRules = {
  login: {
    email: [validators.required, validators.email],
    password: [validators.required]
  },

  register: {
    name: [validators.required, validators.name],
    email: [validators.required, validators.email],
    password: [validators.required, validators.password]
  },

  profile: {
    name: [validators.required, validators.name],
    email: [validators.required, validators.email]
  },

  changePassword: {
    currentPassword: [validators.required],
    newPassword: [validators.required, validators.password],
    confirmPassword: [validators.required]
  },

  forgotPassword: {
    email: [validators.required, validators.email]
  },

  resetPassword: {
    password: [validators.required, validators.password],
    confirmPassword: [validators.required]
  }
}