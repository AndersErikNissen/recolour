import api from '@/api'

export function imageUrl(path) {
  if (!path) return ''
  return `${api.defaults.baseURL}${path}`
}
