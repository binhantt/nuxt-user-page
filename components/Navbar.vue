<template>
  <nav class="navbar is-fixed-top" style="background-color: rgb(127, 236, 255);">
    <div class="container">
      <div class="navbar-brand">
        <NuxtLink class="navbar-item" to="/">
          <span class="has-text-weight-bold is-size-4">TEMPLATESHOP</span>
        </NuxtLink>

        <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" @click="isMenuActive = !isMenuActive">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div class="navbar-menu" :class="{ 'is-active': isMenuActive }">
        <div class="navbar-start">
          <NuxtLink class="navbar-item" to="/">
            Trang Chủ
          </NuxtLink>
          
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              Danh Mục
            </a>
            <div class="navbar-dropdown">
              <NuxtLink 
                v-for="category in categories.data" 
                :key="category.id"
                :to="`/category/${category.id}`"
                class="navbar-item"
              >
                <figure class="image is-24x24 mr-2" v-if="category.image">
                  <img :src="category.image" :alt="category.name">
                </figure>
                <span>{{ category.name }}</span>
              </NuxtLink>
            </div>
          </div>

          <NuxtLink class="navbar-item" to="/blog">
            Blog
          </NuxtLink>

          <NuxtLink class="navbar-item" to="/guide">
            Hướng Dẫn
          </NuxtLink>

          <NuxtLink class="navbar-item" to="/cart">
            Giỏ Hàng
          </NuxtLink>

          <NuxtLink class="navbar-item" to="/payment">
            Thanh Toán
          </NuxtLink>

          <NuxtLink class="navbar-item" to="/account">
            Tài Khoản
          </NuxtLink>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div class="field has-addons">
              <div class="control">
                <input class="input" type="text" placeholder="Tìm kiếm...">
              </div>
              <div class="control">
                <a class="button is-info">
                  <span class="icon">
                    <i class="fas fa-search"></i>
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div class="navbar-item">
            <div class="buttons">
              <a class="button">
                <span>0VNĐ</span>
                <span class="icon">
                  <i class="fas fa-shopping-cart"></i>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
const isMenuActive = ref(false)
const categoryStore = useCategoryStore()
const { categories } = storeToRefs(categoryStore)

onMounted(() => {
  categoryStore.fetchCategories()

})
</script>

<style scoped>
.navbar {
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.navbar-item {
  color: #363636;
  font-weight: 500;
}

.navbar-item:hover {
  color: #3273dc;
}

.navbar-dropdown {
  border-top: 2px solid #3273dc;
}

.input {
  border-radius: 4px 0 0 4px;
}

.button.is-info {
  border-radius: 0 4px 4px 0;
}
</style> 