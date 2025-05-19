<template>

  <div class="columns is-multiline is-mobile">
    <div
      class="column is-12-mobile is-6-tablet is-3-desktop has-text-centered"
      v-for="product in products"
      :key="product.id"
    >
      <router-link :to="`/product/${product.name}`" class="card product-card-bulma" :class="{ 'inactive': product.is_active == 0 }">
        <div class="card-image has-text-centered pt-4">
          <div class="image-wrapper">
          
              <img
                :src="product.main_image_url "
                :alt="product.name"
                @error="onImgError($event)"
              />
            
            <span v-if="product.is_active == 0" class="tag is-danger badge-bulma">Ngừng bán</span>
            <span v-else-if="product.stock === 0" class="tag is-dark badge-bulma">Hết hàng</span>
          </div>
        </div>
        <div class="card-content p-4">
          <div class="media-content has-text-centered">
            <p class="title is-5 mb-1 product-title" :title="product.name">{{ product.name }}</p>
            <p class="subtitle is-7 mb-2">Mã SP: <b>{{ product.sku }}</b></p>
            <p class="has-text-weight-bold has-text-link mb-1 product-price">{{ formatPrice(product.price) }}</p>
            <p class="mb-1 product-stock" :class="{'has-text-danger': product.stock === 0, 'has-text-success': product.stock > 0}">
              Tồn kho: <b>{{ product.stock }}</b>
            </p>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProductStore } from '~/stores/productStore'

const productStore = useProductStore()
const {products  } = storeToRefs(productStore)
onMounted(async () => {
  await productStore.getProduct()
  console.log('Products data structure:', products.value)
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
function onImgError(e) {
  e.target.src = defaultImage
}
</script>

<style scoped>
.product-card-bulma {
  border-radius: 22px;
  box-shadow: 0 8px 32px rgba(50,115,220,0.10);
  transition: box-shadow 0.22s, transform 0.22s;
  border: 1.5px solid #f2f2f2;
  text-decoration: none;
  cursor: pointer;
  display: block;
  height: 100%;
  background: #fff;
  margin-bottom: 24px;
  padding-bottom: 8px;
}
.product-card-bulma:hover {
  box-shadow: 0 16px 48px rgba(50,115,220,0.18);
  transform: translateY(-10px) scale(1.045);
  border-color: #3273dc33;
}
.product-card-bulma.inactive {
  opacity: 0.7;
  filter: grayscale(0.2);
}
.image-wrapper {
  position: relative;
  width: 92%;
  margin: 0 auto;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 2px 16px #3273dc22;
  background: #f5f5f5;
  min-height: 180px;
  max-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.image.is-4by3 img {
  object-fit: cover;
  width: 100%;
  height: 200px;
  border-radius: 18px;
  background: #f5f5f5;
  transition: filter 0.2s;
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
.product-title {
  font-size: 1.22rem;
  font-weight: 800;
  color: #222;
  margin-bottom: 10px;
  letter-spacing: 0.2px;
}
.product-price {
  font-size: 1.18rem;
}
.product-stock {
  font-size: 1.08rem;
}
.card-content {
  padding-bottom: 0 !important;
}
@media (max-width: 900px) {
  .product-card-bulma {
    margin-bottom: 18px;
  }
  .image-wrapper {
    min-height: 120px;
    max-height: 150px;
  }
  .image.is-4by3 img {
    height: 120px;
  }
}
@media (max-width: 600px) {
  .product-card-bulma {
    margin-bottom: 12px;
    padding-bottom: 4px;
  }
  .image-wrapper {
    min-height: 90px;
    max-height: 110px;
  }
  .image.is-4by3 img {
    height: 90px;
  }
}
</style>



