<template>
  <section class="section products-section">
    <div class="container">
      <h2 class="title is-2 has-text-centered mb-6">Sản Phẩm Nổi Bật</h2>
      
      <div class="tabs is-centered mb-5">
        <ul>
          <li :class="{ 'is-active': activeCategory === 'all' }">
            <a @click="activeCategory = 'all'">Tất Cả</a>
          </li>
          <li :class="{ 'is-active': activeCategory === 'shopee' }">
            <a @click="activeCategory = 'shopee'">Shopee</a>
          </li>
          <li :class="{ 'is-active': activeCategory === 'tiki' }">
            <a @click="activeCategory = 'tiki'">Tiki</a>
          </li>
          <li :class="{ 'is-active': activeCategory === 'lazada' }">
            <a @click="activeCategory = 'lazada'">Lazada</a>
          </li>
        </ul>
      </div>

      <swiper
        :modules="[SwiperGrid, SwiperPagination]"
        :slides-per-view="3"
        :grid="{
          rows: 2,
          fill: 'row'
        }"
        :space-between="30"
        :pagination="{
          clickable: true
        }"
        :breakpoints="{
          '320': {
            slidesPerView: 1,
            grid: {
              rows: 1
            }
          },
          '768': {
            slidesPerView: 2,
            grid: {
              rows: 2
            }
          },
          '1024': {
            slidesPerView: 3,
            grid: {
              rows: 2
            }
          }
        }"
        class="products-swiper"
      >
        <swiper-slide v-for="product in filteredProducts" :key="product.id">
          <div class="product-card">
            <div class="product-image">
              <img :src="product.image" :alt="product.name">
              <div class="product-overlay">
                <button class="button is-primary is-rounded">
                  <span class="icon">
                    <i class="fas fa-eye"></i>
                  </span>
                  <span>Xem Chi Tiết</span>
                </button>
              </div>
              <div class="product-badge" :class="'is-' + product.platform">
                {{ product.platform.toUpperCase() }}
              </div>
            </div>
            <div class="product-content">
              <h3 class="title is-5">
                <NuxtLink :to="`/product/${product.slug}`" class="has-text-dark">
                  {{ product.name }}
                </NuxtLink>
              </h3>
              <p class="subtitle is-6 has-text-grey">{{ product.description }}</p>
              <div class="price-tag">
                {{ product.price }}
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Grid, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/pagination'

const SwiperGrid = Grid
const SwiperPagination = Pagination

const activeCategory = ref('all')

const products = [
  {
    id: 1,
    name: 'Template Shopee Basic',
    description: 'Giao diện cơ bản cho shop Shopee',
    price: '299.000đ',
    platform: 'shopee',
    slug: 'template-shopee-basic',
    image: 'https://img.freepik.com/free-vector/online-shopping-banner-mobile-app-templates-concept-flat-design_1150-34863.jpg'
  },
  {
    id: 2,
    name: 'Template Tiki Pro',
    description: 'Giao diện chuyên nghiệp cho Tiki',
    price: '399.000đ',
    platform: 'tiki',
    slug: 'template-tiki-pro',
    image: 'https://img.freepik.com/free-vector/ecommerce-web-page-concept-illustration_114360-8204.jpg'
  },
  {
    id: 3,
    name: 'Template Lazada Premium',
    description: 'Giao diện cao cấp cho Lazada',
    price: '499.000đ',
    platform: 'lazada',
    slug: 'template-lazada-premium',
    image: 'https://img.freepik.com/free-vector/shopping-online-landing-page_23-2148253001.jpg'
  },
  {
    id: 4,
    name: 'Template Shopee Plus',
    description: 'Giao diện nâng cao cho Shopee',
    price: '399.000đ',
    platform: 'shopee',
    slug: 'template-shopee-plus',
    image: 'https://img.freepik.com/free-vector/ecommerce-campaign-concept-illustration_114360-8432.jpg'
  },
  {
    id: 5,
    name: 'Template Tiki Basic',
    description: 'Giao diện đơn giản cho Tiki',
    price: '299.000đ',
    platform: 'tiki',
    slug: 'template-tiki-basic',
    image: 'https://img.freepik.com/free-vector/ecommerce-shop-category-page-illustration_23-2148400175.jpg'
  },
  {
    id: 6,
    name: 'Template Lazada Basic',
    description: 'Giao diện cơ bản cho Lazada',
    price: '299.000đ',
    platform: 'lazada',
    slug: 'template-lazada-basic',
    image: 'https://img.freepik.com/free-vector/online-shopping-concept-illustration_114360-1084.jpg'
  }
]

const filteredProducts = computed(() => {
  if (activeCategory.value === 'all') return products
  return products.filter(product => product.platform === activeCategory.value)
})
</script>

<style scoped>
.products-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 6rem 1.5rem;
}

.products-swiper {
  padding-bottom: 4rem;
}

.product-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-10px);
}

.product-image {
  position: relative;
  padding-top: 60%;
  overflow: hidden;
}

.product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.1);
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.product-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: white;
  font-weight: bold;
  font-size: 0.8rem;
}

.product-badge.is-shopee {
  background: #ee4d2d;
}

.product-badge.is-tiki {
  background: #1ba8ff;
}

.product-badge.is-lazada {
  background: #f36f21;
}

.product-content {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.price-tag {
  background: #4CAF50;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  align-self: flex-start;
  font-weight: bold;
  margin-top: auto;
}

.tabs li.is-active a {
  border-bottom-color: #3273dc;
  color: #3273dc;
}

:deep(.swiper-pagination-bullet) {
  background: #3273dc;
}

.title.is-2 {
  background: linear-gradient(45deg, #3273dc, #00d1b2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style> 