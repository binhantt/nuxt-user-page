<template>
  <div class="product-detail">
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-vcentered">
            <div class="column is-6">
              <h1 class="title is-2">{{ product.name }}</h1>
              <p class="subtitle is-4">{{ product.description }}</p>
              <div class="tags">
                <span class="tag is-medium" :class="'is-' + product.platform">
                  {{ product.platform.toUpperCase() }}
                </span>
              </div>
              <div class="price-box">
                <p class="price">{{ product.price }}</p>
                <button class="button is-white is-outlined is-large">
                  <span class="icon">
                    <i class="fas fa-shopping-cart"></i>
                  </span>
                  <span>Mua Ngay</span>
                </button>
              </div>
            </div>
            <div class="column is-6">
              <figure class="image">
                <img :src="product.image" :alt="product.name">
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column is-8">
            <div class="content">
              <h2 class="title is-3">Tính Năng</h2>
              <ul>
                <li>Giao diện tương thích hoàn toàn với {{ product.platform }}</li>
                <li>Thiết kế responsive trên mọi thiết bị</li>
                <li>Tối ưu SEO cho {{ product.platform }}</li>
                <li>Hỗ trợ tùy chỉnh màu sắc và layout</li>
                <li>Cập nhật miễn phí trong 6 tháng</li>
              </ul>

              <h2 class="title is-3 mt-6">Hướng Dẫn Sử Dụng</h2>
              <ol>
                <li>Tải template về máy</li>
                <li>Giải nén file template</li>
                <li>Làm theo hướng dẫn trong file README.md</li>
                <li>Upload template lên {{ product.platform }}</li>
              </ol>
            </div>
          </div>

          <div class="column is-4">
            <div class="box">
              <h3 class="title is-4">Thông Tin Hỗ Trợ</h3>
              <div class="support-info">
                <div class="support-item">
                  <span class="icon has-text-info">
                    <i class="fas fa-headset"></i>
                  </span>
                  <div>
                    <strong>Hỗ trợ kỹ thuật</strong>
                    <p>24/7 qua email và chat</p>
                  </div>
                </div>
                <div class="support-item">
                  <span class="icon has-text-success">
                    <i class="fas fa-sync"></i>
                  </span>
                  <div>
                    <strong>Cập nhật</strong>
                    <p>Miễn phí 6 tháng</p>
                  </div>
                </div>
                <div class="support-item">
                  <span class="icon has-text-warning">
                    <i class="fas fa-file-alt"></i>
                  </span>
                  <div>
                    <strong>Tài liệu</strong>
                    <p>Hướng dẫn chi tiết</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const route = useRoute()

// Simulated product data - in a real app, this would come from an API or store
const products = [
  {
    id: 1,
    slug: 'template-shopee-basic',
    name: 'Template Shopee Basic',
    description: 'Giao diện cơ bản cho shop Shopee',
    price: '299.000đ',
    platform: 'shopee',
    image: 'https://img.freepik.com/free-vector/online-shopping-banner-mobile-app-templates-concept-flat-design_1150-34863.jpg'
  },
  {
    id: 2,
    slug: 'template-tiki-pro',
    name: 'Template Tiki Pro',
    description: 'Giao diện chuyên nghiệp cho Tiki',
    price: '399.000đ',
    platform: 'tiki',
    image: 'https://img.freepik.com/free-vector/ecommerce-web-page-concept-illustration_114360-8204.jpg'
  },
  // Add more products as needed
]

const product = computed(() => {
  return products.find(p => p.slug === route.params.slug) || products[0]
})
</script>
