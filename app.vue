<template>
  <NuxtErrorBoundary>
    <template #default>
      <Navbar />
      <!-- Page Content with padding for fixed navbar -->
      <div style="padding-top: 3.25rem;">
        <NuxtPage />
      </div>
      <Footer />
    </template>
    
  
  </NuxtErrorBoundary>
</template>

<script setup>
import Footer from '~/components/Footer.vue'
import Navbar from '~/components/Navbar.vue'

</script>

