<template>
  <div class="section">
    <div class="container">
      <h2 class="title is-4 mb-5">Kết quả tìm kiếm cho "{{ route.params.query }}"</h2>
      <div class="columns is-multiline">
        <div
          v-for="product in categories"
          :key="product.product_id"
          class="column is-12-mobile is-6-tablet is-4-desktop"
        >
          <router-link :to="`/product/${product.product_name}`" class="card product-card" :class="{ 'inactive': product.is_active == 0 }">
            <div class="card-image has-text-centered pt-4">
              <figure class="image is-4by3">
                <img
                  :src="product.main_image_url"
                  :alt="product.product_name"
                  class="product-img"
                  @error="e => e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'"
                />
              </figure>
              <span v-if="product.is_active == 0" class="tag is-danger badge-bulma">Ngừng bán</span>
              <span v-else-if="product.stock === 0" class="tag is-dark badge-bulma">Hết hàng</span>
            </div>
            <div class="card-content p-4">
              <div class="media-content has-text-centered">
                <p class="title is-6 mb-1">{{ product.product_name }}</p>
                <p class="subtitle is-7 mb-2">Mã SP: <b>{{ product.sku }}</b></p>
                <p class="has-text-weight-bold has-text-link mb-1">{{ formatPrice(product.price) }}</p>
                <p class="mb-1" :class="{'has-text-danger': product.stock === 0, 'has-text-success': product.stock > 0}">
                  Tồn kho: <b>{{ product.stock }}</b>
                </p>
              </div>
            </div>
          </router-link>
        </div>
        <div v-if="!categories.length" class="has-text-centered is-size-5 py-6">
          Không tìm thấy sản phẩm phù hợp
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSearchStore } from '~/stores/searchStore'
import { storeToRefs } from 'pinia'
const route = useRoute()
const searchStore = useSearchStore()
const { categories } = storeToRefs(searchStore)
onMounted(async () => {
  await searchStore.searchProducts(route.params.query)
})
const formatPrice = (price) => {
  const numericPrice = parseFloat(price)
  if (isNaN(numericPrice)) return '—'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numericPrice)
}
</script>
<style scoped>
.product-card {
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(50,115,220,0.10);
  transition: box-shadow 0.22s, transform 0.22s;
  border: 1.5px solid #f2f2f2;
  background: #fff;
  margin-bottom: 24px;
  height: 100%;
  display: block;
  text-decoration: none;
}
.product-card:hover {
  box-shadow: 0 8px 36px rgba(50,115,220,0.18);
  transform: translateY(-6px) scale(1.04);
  border-color: #3273dc33;
}
.product-card.inactive {
  opacity: 0.7;
  filter: grayscale(0.2);
}
.badge-bulma {
  position: absolute;
  top: 16px;
  left: 16px;
  font-size: 1em;
  font-weight: 700;
  border-radius: 10px;
  z-index: 2;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px #ff386055;
  padding: 6px 18px;
}
.product-img {
  object-fit: cover;
  width: 100%;
  height: 200px;
  border-radius: 18px;
  background: #f5f5f5;
}
</style> 