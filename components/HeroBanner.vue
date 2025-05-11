<template>
  <div class="hero-container">
    <swiper
      :modules="[SwiperAutoplay, SwiperEffectFade, SwiperNavigation, SwiperPagination]"
      :effect="'fade'"
      :autoplay="{
        delay: 3000,
        disableOnInteraction: false
      }"
      :navigation="true"
      :pagination="{
        clickable: true,
        dynamicBullets: true
      }"
      class="hero-swiper"
    >
      <swiper-slide v-for="intro in productIntros" :key="intro.id">
        <section class="hero is-fullheight-with-navbar hero-slide" :style="{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${intro.image_url})`
        }">
          <div class="hero-body has-text-centered">
            <div class="container animate__animated animate__fadeIn">
              <h1 class="title is-1 has-text-warning glow-text" style="font-size: 4.5rem;">
                {{ intro.title }}
              </h1>
              <h2 class="subtitle is-2 has-text-white text-shadow" style="font-size: 3rem; margin-top: 2rem;">
                {{ intro.subtitle }}
              </h2>
              <div class="buttons is-centered mt-6">
                <a v-if="intro.button1_text" 
                   :href="intro.button1_link" 
                   class="button is-warning is-large is-rounded animate__animated animate__pulse animate__infinite">
                  <span>{{ intro.button1_text }}</span>
                  <span class="icon">
                    <i class="fas fa-arrow-right"></i>
                  </span>
                </a>
                <a v-if="intro.button2_text" 
                   :href="intro.button2_link" 
                   class="button is-primary is-large is-rounded">
                  <span>{{ intro.button2_text }}</span>
                  <span class="icon">
                    <i class="fas fa-external-link-alt"></i>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </swiper-slide>
    </swiper>

    <!-- Loading State -->
    <div v-if="productIntroStore.loading" class="hero is-fullheight-with-navbar is-light">
      <div class="hero-body">
        <div class="container has-text-centered">
          <span class="icon is-large">
            <i class="fas fa-spinner fa-pulse fa-3x"></i>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules'
import { useProductIntroStore } from '~/stores/productIntroStore'
import { onMounted, computed } from 'vue'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const SwiperAutoplay = Autoplay
const SwiperEffectFade = EffectFade
const SwiperNavigation = Navigation
const SwiperPagination = Pagination

const productIntroStore = useProductIntroStore()
const productIntros = computed(() => {
  console.log('[HeroBanner] Current productIntros:', productIntroStore.productIntros)
  return productIntroStore.productIntros
})

onMounted(async () => {
  console.log('[HeroBanner] Component mounted')
  if (!productIntros.value.length) {
    console.log('[HeroBanner] No intros found, fetching...')
    await productIntroStore.fetchProductIntros()
    console.log('[HeroBanner] Fetch completed, productIntros:', productIntros.value)
  }
})
</script>

<style scoped>
.hero-container {
  height: 100vh;
  width: 100%;
}

.hero-swiper {
  height: 100%;
  width: 100%;
}

.hero-slide {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.text-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.glow-text {
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.8),
               0 0 20px rgba(255, 215, 0, 0.8),
               0 0 30px rgba(255, 215, 0, 0.8);
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: #ffd700;
  background: rgba(50, 115, 220, 0.8);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

:deep(.swiper-button-next:hover),
:deep(.swiper-button-prev:hover) {
  background: #3273dc;
}

:deep(.swiper-pagination-bullet) {
  background: #f5f5f5;
  opacity: 0.8;
}

:deep(.swiper-pagination-bullet-active) {
  background: #ffd700;
}

.hero.is-fullheight-with-navbar {
  min-height: calc(100vh - 3.25rem);
}

.buttons {
  gap: 1rem;
}

.button {
  transition: all 0.3s ease;
}

.button.is-warning {
  background-color: #ffd700;
  color: #363636;
}

.button.is-primary {
  background-color: #3273dc;
  color: white;
}

.button:hover {
  transform: scale(1.05);
}

.button.is-warning:hover {
  background-color: #ffed4a;
}

.button.is-primary:hover {
  background-color: #2366d1;
}
</style> 