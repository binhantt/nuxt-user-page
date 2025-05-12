export interface UserData {
  id: number
  email: string
  name: string
  phone: string
  address: string
  balance: string
  is_active: number
  created_at: string
  updated_at: string
}

export interface OrderItem {
  product_id: number
  product_name: string
  quantity: number
  price: string | number
  main_image_url: string
}

export interface Order {
  id: number
  user_id: number
  total_amount: string | number
  status: string
  shipping_address: string
  created_at: string
  user_name: string
  user_email: string
  items: OrderItem[]
} 