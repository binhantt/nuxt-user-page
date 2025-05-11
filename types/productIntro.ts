export interface ProductIntro {
  id: number
  image_url: string
  title: string
  subtitle: string
  button1_text?: string
  button1_link?: string
  button2_text?: string
  button2_link?: string
  created_at: string
  updated_at: string
}

export interface ProductIntroResponse {
  success: boolean
  data: {
    items: ProductIntro[]
    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }
} 