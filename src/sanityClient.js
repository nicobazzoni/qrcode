import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'kb6bkho8',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-01-01',
  token: import.meta.env.VITE_SANITY_TOKEN
})