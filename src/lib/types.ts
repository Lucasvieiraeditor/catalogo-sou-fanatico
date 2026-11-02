export interface Product {
  id: string
  team: string
  name: string
  season: string
  type: string
  quality: string
  material: string
  price: number
  old_price: number | null
  cost_price: number
  image_url: string | null
  sizes: string[]
  in_stock: boolean
  stock_quantity: number
  delivery_date: string | null
  is_new: boolean
  category: string
  active: boolean
  created_at: string
}

export interface Order {
  id: string
  product_id: string | null
  product_name: string
  size: string
  customer_name: string | null
  customer_phone: string | null
  status: string
  price: number
  cost_price: number
  created_at: string
}

export interface StoreConfig {
  id: number
  store_name: string
  owner_name: string
  whatsapp: string
  tagline: string
  profile_image: string | null
  cover_image: string | null
  banner_images: string[]
}
