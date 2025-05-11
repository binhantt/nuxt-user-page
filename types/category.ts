export interface Category {
  id: number
  name: string
  slug?: string
  image?: string
  description?: string
  created_at?: string
  updated_at?: string
}

export interface CategoryState {
  categories: Category[]
  loading: boolean
  error: string | null
} 