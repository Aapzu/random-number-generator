import { Query } from 'express-serve-static-core'
import { ApiError } from './ApiError'

type Parser<T> = {
  (value: Query[string], name: string, allowMissing?: boolean): T | undefined
  (value: Query[string], name: string, allowMissing: false): T
}

export const parseNumber: Parser<number> = (value, name, allowMissing = true) => {
  if (value === undefined || value === null) {
    if (!allowMissing) {
      throw new ApiError(`Query parameter ${name} is missing`, 400)
    }
    return undefined
  }
  if (typeof value !== 'string') {
    throw new ApiError(`Query parameter ${name} must be a plain string`, 400)
  } else {
    return parseFloat(value)
  }
}

export const parseBoolean: Parser<boolean> = (value, name, allowMissing = true) => {
  if (value === undefined || value === null) {
    if (!allowMissing) {
      throw new ApiError(`Query parameter ${name} is missing`, 400)
    }
    return undefined
  }
  if (typeof value !== 'string') {
    throw new ApiError(`Query parameter ${name} must be a boolean`, 400)
  } else {
    return value && value !== 'false'
  }
}

export const parseStringList: Parser<string[]> = (value, name, allowMissing = true) => {
  if (value === undefined || value === null) {
    if (!allowMissing) {
      throw new ApiError(`Query parameter ${name} is missing`, 400)
    }
    return undefined
  }
  if (typeof value === 'string') {
    return [value]
  } else if (Array.isArray(value) && !value.some((item) => typeof item !== 'string')) {
    return value as string[]
  } else {
    throw new ApiError(`Query parameter ${name} must be a string or a string list`, 400)
  }
}

type EnumParser = {
  (value: Query[string], enumRef: Record<string, string>, name: string): string | undefined
  (value: Query[string], enumRef: Record<string, string>, name: string, allowMissing: true): string | undefined
  (value: Query[string], enumRef: Record<string, string>, name: string, allowMissing: false): string
}

export const parseEnum: EnumParser = (value, enumRef, name, allowMissing: boolean = true) => {
  if (value === undefined || value === null) {
    if (!allowMissing) {
      throw new ApiError(`Query parameter ${name} is missing`, 400)
    }
    return undefined
  }
  if (typeof value === 'string' && Object.values(enumRef).includes(value)) {
    return value
  } else {
    throw new ApiError(`Query parameter ${name} must be one of ${Object.values(enumRef).join(', ')}`, 400)
  }
}

export const parseString: Parser<string> = (value, name, allowMissing = true) => {
  if (value === undefined || value === null) {
    if (!allowMissing) {
      throw new ApiError(`Query parameter ${name} is missing`, 400)
    }
    return undefined
  }
  if (typeof value === 'string') {
    return value
  } else {
    throw new ApiError(`Query parameter ${name} must be a string`, 400)
  }
}