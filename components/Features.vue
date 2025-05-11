<template>
  <section id="features" class="section features-section">
    <div class="container">
      <h2 class="title is-2 has-text-centered mb-6">Tính Năng Nổi Bật</h2>
      <swiper
        :effect="'cards'"
        :grabCursor="true"
        :modules="[SwiperEffectCards, SwiperAutoplay]"
        :autoplay="{
          delay: 2000,
          disableOnInteraction: false
        }"
        class="features-swiper"
      >
        <swiper-slide>
          <div class="feature-card">
            <div class="feature-image">
              <img src="https://img.freepik.com/free-vector/speed-performance-level-illustration_23-2148889275.jpg" alt="Tiện Lợi">
            </div>
            <div class="feature-content">
              <div class="icon">
                <i class="fas fa-bolt has-text-warning fa-3x"></i>
              </div>
              <h3 class="title is-4 has-text-info mt-4">TIỆN LỢI</h3>
              <p class="subtitle is-6 has-text-grey">Dễ dàng sử dụng, tùy chỉnh nhanh chóng</p>
            </div>
          </div>
        </swiper-slide>

        <swiper-slide>
          <div class="feature-card">
            <div class="feature-image">
              <img src="https://img.freepik.com/free-vector/rocket-launch-clouds-illustration_23-2148889263.jpg" alt="Nhanh Chóng">
            </div>
            <div class="feature-content">
              <div class="icon">
                <i class="fas fa-rocket has-text-danger fa-3x"></i>
              </div>
              <h3 class="title is-4 has-text-info mt-4">NHANH CHÓNG</h3>
              <p class="subtitle is-6 has-text-grey">Tối ưu thời gian thiết kế và triển khai</p>
            </div>
          </div>
        </swiper-slide>

        <swiper-slide>
          <div class="feature-card">
            <div class="feature-image">
              <img src="https://img.freepik.com/free-vector/magic-wand-concept-illustration_23-2148889234.jpg" alt="Dễ Dàng">
            </div>
            <div class="feature-content">
              <div class="icon">
                <i class="fas fa-magic has-text-success fa-3x"></i>
              </div>
              <h3 class="title is-4 has-text-info mt-4">DỄ DÀNG</h3>
              <p class="subtitle is-6 has-text-grey">Giao diện thân thiện, dễ sử dụng</p>
            </div>
          </div>
        </swiper-slide>

        <swiper-slide>
          <div class="feature-card">
            <div class="feature-image">
              <img src="https://img.freepik.com/free-vector/saving-money-concept-illustration_23-2148889241.jpg" alt="Tiết Kiệm">
            </div>
            <div class="feature-content">
              <div class="icon">
                <i class="fas fa-piggy-bank has-text-primary fa-3x"></i>
              </div>
              <h3 class="title is-4 has-text-info mt-4">TIẾT KIỆM</h3>
              <p class="subtitle is-6 has-text-grey">Chi phí hợp lý, hiệu quả cao</p>
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
import 'swiper/css'
import 'swiper/css/effect-cards'

const SwiperEffectCards = EffectCards
const SwiperAutoplay = Autoplay
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
  background: linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(255,255,255,0.2) 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.2) 75%),
              linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.2) 75%);
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
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
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
  background: linear-gradient(45deg, #00d4ff, #00ff87);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 3rem;
}
</style> 