<template>
  <section id="features" class="section features-section">
    <div class="container">
      <h2 class="title is-2 has-text-centered mb-6">Tính Năng Nổi Bật</h2>
      
      <!-- Loading State -->
      <div v-if="productIntroStore.loading" class="has-text-centered py-6">
        <span class="icon is-large">
          <i class="fas fa-spinner fa-pulse fa-3x"></i>
        </span>
      </div>

      <swiper
        v-else
        :effect="'cards'"
        :grabCursor="true"
        :modules="[SwiperEffectCards, SwiperAutoplay]"
        :autoplay="{
          delay: 2000,
          disableOnInteraction: false
        }"
        class="features-swiper"
      >
        <swiper-slide v-for="intro in productIntros" :key="intro.id">
          <div class="feature-card">
            <div class="feature-image">
              <img :src="intro.image_url" :alt="intro.title">
            </div>
            <div class="feature-content">
              <div class="icon">
                <i class="fas fa-star has-text-warning fa-3x"></i>
              </div>
              <h3 class="title is-4 has-text-primary mt-4">{{ intro.title }}</h3>
              <p class="subtitle is-6">{{ intro.subtitle }}</p>
              <div class="buttons is-centered mt-4">
                <a v-if="intro.button1_text" 
                   :href="intro.button1_link" 
                   class="button is-warning is-rounded">
                  <span>{{ intro.button1_text }}</span>
                  <span class="icon">
                    <i class="fas fa-arrow-right"></i>
                  </span>
                </a>
                <a v-if="intro.button2_text" 
                   :href="intro.button2_link" 
                   class="button is-primary is-rounded">
                  <span>{{ intro.button2_text }}</span>
                  <span class="icon">
                    <i class="fas fa-external-link-alt"></i>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </section>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { EffectCards, Autoplay } from 'swiper/modules'
import { useProductIntroStore } from '~/stores/productIntroStore'
import { onMounted, computed } from 'vue'
import 'swiper/css'
import 'swiper/css/effect-cards'

const SwiperEffectCards = EffectCards
const SwiperAutoplay = Autoplay

const productIntroStore = useProductIntroStore()
const productIntros = computed(() => productIntroStore.productIntros)

onMounted(async () => {
  if (!productIntros.value.length) {
    await productIntroStore.fetchProductIntros()
  }
})
</script>

<style scoped>
.features-section {
  background-color: #f5f5f5;
  padding: 6rem 1.5rem;
  position: relative;
  overflow: hidden;
}

.features-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(50, 115, 220, 0.1) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(50, 115, 220, 0.1) 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, rgba(50, 115, 220, 0.1) 75%),
              linear-gradient(-45deg, transparent 75%, rgba(50, 115, 220, 0.1) 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  z-index: 0;
}

.features-swiper {
  width: 300px;
  height: 500px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.feature-card {
  background: white;
  border-radius: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(50, 115, 220, 0.1);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(50, 115, 220, 0.2);
}

.feature-image {
  height: 200px;
  overflow: hidden;
}

.feature-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-image img {
  transform: scale(1.1);
}

.feature-content {
  padding: 2rem;
  text-align: center;
  background: white;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.icon {
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease;
}

.feature-card:hover .icon {
  transform: scale(1.2);
}

.title.is-2 {
  color: #3273dc;
  margin-bottom: 3rem;
}

.has-text-primary {
  color: #3273dc !important;
}

.has-text-warning {
  color: #ffd700 !important;
}

.buttons {
  gap: 0.5rem;
}

.button {
  transition: all 0.3s ease;
}

.button:hover {
  transform: scale(1.05);
}

.button.is-warning {
  background-color: #ffd700;
  color: #363636;
}

.button.is-warning:hover {
  background-color: #ffed4a;
}

.button.is-primary {
  background-color: #3273dc;
  color: white;
}

.button.is-primary:hover {
  background-color: #2366d1;
}
</style> 