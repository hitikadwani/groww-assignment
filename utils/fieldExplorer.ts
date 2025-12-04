import { FieldOption } from '@/types'

export const exploreFields = (
  data: any,
  path: string[] = [],
  showArraysOnly: boolean = false
): FieldOption[] => {
  const fields: FieldOption[] = []

  if (data === null || data === undefined) {
    return fields
  }

  if (Array.isArray(data)) {
    if (!showArraysOnly) {
      // Add array itself as a field
      fields.push({
        key: path.join('.') || 'root',
        label: path[path.length - 1] || 'Array',
        type: 'array',
        path: [...path],
        value: data,
      })
    }

    // Explore first item in array
    if (data.length > 0) {
      const itemFields = exploreFields(data[0], path, showArraysOnly)
      fields.push(...itemFields)
    }
  } else if (typeof data === 'object') {
    Object.keys(data).forEach((key) => {
      const newPath = [...path, key]
      const value = data[key]

      if (Array.isArray(value)) {
        if (showArraysOnly || value.length > 0) {
          fields.push({
            key: newPath.join('.'),
            label: key,
            type: 'array',
            path: newPath,
            value: value,
          })
          // Explore array items
          if (value.length > 0) {
            const itemFields = exploreFields(value[0], newPath, showArraysOnly)
            fields.push(...itemFields)
          }
        }
      } else if (typeof value === 'object' && value !== null) {
        // Nested object - explore recursively
        const nestedFields = exploreFields(value, newPath, showArraysOnly)
        fields.push(...nestedFields)
      } else {
        // Primitive value
        fields.push({
          key: newPath.join('.'),
          label: key,
          type: typeof value,
          path: newPath,
          value: value,
        })
      }
    })
  } else {
    // Primitive root value
    fields.push({
      key: path.join('.') || 'root',
      label: path[path.length - 1] || 'Value',
      type: typeof data,
      path: path,
      value: data,
    })
  }

  return fields
}

export const getFieldValue = (data: any, path: string[]): any => {
  let current = data
  for (const key of path) {
    if (current === null || current === undefined) {
      return undefined
    }
    if (Array.isArray(current)) {
      // If current is array, get from first item
      if (current.length > 0) {
        current = current[0][key]
      } else {
        return undefined
      }
    } else {
      current = current[key]
    }
  }
  return current
}

export const formatValue = (
  value: any,
  type?: 'string' | 'number' | 'date' | 'currency' | 'percentage'
): string => {
  if (value === null || value === undefined) {
    return '-'
  }

  switch (type) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(Number(value))
    case 'percentage':
      return `${Number(value).toFixed(2)}%`
    case 'date':
      return new Date(value).toLocaleDateString()
    case 'number':
      return Number(value).toLocaleString()
    default:
      return String(value)
  }
}

