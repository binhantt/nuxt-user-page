<template>
    <div>
    <!-- Hero Section -->
    <HeroBanner />

    <!-- Features Section -->
    <Features />

    <!-- Products Section -->
    <Category />

    <!-- Wave Divider -->
    <div class="wave-container">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="#3273dc" fill-opacity="1" d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,90.7C960,96,1056,128,1152,133.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
    </div>


  
  </div>
</template>

<script setup>
// Import components
import HeroBanner from '~/components/HeroBanner.vue'
import Features from '~/components/Features.vue'
import Category from '~/components/CategoryHome.vue'
// import Products from '~/components/Products.vue'
</script>

<style scoped>
.wave-container {
  position: relative;
  background: #f5f5f5;
  margin-top: -100px;
}
</style>
