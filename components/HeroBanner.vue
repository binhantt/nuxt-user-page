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
      <swiper-slide>
        <section class="hero is-fullheight-with-navbar hero-slide" :style="{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://img.freepik.com/free-vector/gradient-technology-background-with-connecting-lines_23-2148874374.jpg)'
        }">
          <div class="hero-body has-text-centered">
            <div class="container animate__animated animate__fadeIn">
              <h1 class="title is-1 has-text-warning glow-text" style="font-size: 4.5rem;">
                TEMPLATE
              </h1>
              <h2 class="subtitle is-2 has-text-white text-shadow" style="font-size: 3rem; margin-top: 2rem;">
                TRANG TRÍ GIAN HÀNG TMĐT
              </h2>
              <h3 class="subtitle is-3 has-text-warning glow-text" style="font-size: 2.5rem; margin-top: 2rem;">
                SHOPEE • TIKI • LAZADA • TIKTOK
              </h3>
            </div>
          </div>
        </section>
      </swiper-slide>
      
      <swiper-slide>
        <section class="hero is-fullheight-with-navbar hero-slide" :style="{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://img.freepik.com/free-vector/gradient-network-connection-background_23-2148865393.jpg)'
        }">
          <div class="hero-body has-text-centered">
            <div class="container animate__animated animate__fadeIn">
              <h1 class="title is-1 has-text-white text-shadow" style="font-size: 4.5rem;">
                THIẾT KẾ CHUYÊN NGHIỆP
              </h1>
              <h2 class="subtitle is-2 has-text-warning glow-text" style="font-size: 3rem; margin-top: 2rem;">
                NÂNG TẦM THƯƠNG HIỆU
              </h2>
              <a href="#features" class="button is-warning is-large is-rounded mt-6 animate__animated animate__pulse animate__infinite">
                <span>Khám Phá Ngay</span>
                <span class="icon">
                  <i class="fas fa-arrow-right"></i>
                </span>
              </a>
            </div>
          </div>
        </section>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
// import 'animate.css'

const SwiperAutoplay = Autoplay
const SwiperEffectFade = EffectFade
const SwiperNavigation = Navigation
const SwiperPagination = Pagination
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
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8),
               0 0 20px rgba(255, 255, 255, 0.8),
               0 0 30px rgba(255, 255, 255, 0.8);
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: white;
  background: rgba(0, 0, 0, 0.5);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

:deep(.swiper-button-next:hover),
:deep(.swiper-button-prev:hover) {
  background: rgba(0, 0, 0, 0.8);
}

:deep(.swiper-pagination-bullet) {
  background: white;
  opacity: 0.8;
}

:deep(.swiper-pagination-bullet-active) {
  background: #ffd700;
}

.hero.is-fullheight-with-navbar {
  min-height: calc(100vh - 3.25rem);
}

.button.is-warning {
  transition: all 0.3s ease;
}

.button.is-warning:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(255, 224, 138, 0.5);
}
</style> 