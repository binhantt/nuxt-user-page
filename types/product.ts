export interface Product {
  id: number
  name: string
  description?: string
  price: number
  is_active: number
  category_id: number
  main_image_url: string
  stock: number
  sku: string
  weight: string
  dimensions: string
  created_at: string
  updated_at: string
  images?: ProductImage[]
  category?: Category
  details?: ProductDetail[]
  warranties?: ProductWarranty[]
}

export interface ProductImage {
  id: number
  product_id: number
  image_url: string
  sort_order: number
  created_at: string
}

export interface Category {
  id: number
  name: string
  image: string
  created_at: string
  updated_at: string
}

export interface ProductDetail {
  id: number
  product_id: number
  spec_name: string
  spec_value: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ProductWarranty {
  id: number
  product_id: number
  warranty_period: string
  warranty_provider: string
  warranty_conditions: string
  created_at: string
  updated_at: string
}

export interface Pagination {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  pagination: Pagination
}

export interface ProductState {
  products: ApiResponse<Product[]>
  loading: boolean
  error: string | null
  filters: Record<string, any>
} 