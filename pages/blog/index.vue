<template>
  <div class="section blog-section">
    <div class="container">
      <!-- Header Section -->
      <div class="header-section mb-6">
        <h1 class="title is-2">Blog</h1>
        <div class="subtitle is-5">Khám phá những bài viết mới nhất về công nghệ</div>
        
        <!-- Search and Filter Bar -->
        <BlogSearch
          v-model="searchQuery"
          v-model:selectedCategory="selectedCategory"
          v-model:sortBy="sortBy"
          :categories="categories"
        />
      </div>

      <!-- Featured Post -->
      <FeaturedPost :post="featuredPost" />

      <!-- Blog Posts Grid -->
      <div class="columns is-multiline">
        <div v-for="post in displayedPosts" :key="post.id" class="column is-4">
          <BlogCard :post="post" />
        </div>
      </div>

      <!-- Pagination -->
      <nav class="pagination is-centered mt-6" role="navigation" aria-label="pagination">
        <a 
          class="pagination-previous" 
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          Trang trước
        </a>
        <a 
          class="pagination-next" 
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          Trang sau
        </a>
        <ul class="pagination-list">
          <li v-for="page in totalPages" :key="page">
            <a 
              class="pagination-link" 
              :class="{ 'is-current': page === currentPage }"
              @click="currentPage = page"
            >
              {{ page }}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import BlogSearch from '~/components/blog/BlogSearch.vue'
import FeaturedPost from '~/components/blog/FeaturedPost.vue'
import BlogCard from '~/components/blog/BlogCard.vue'

const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('latest')
const currentPage = ref(1)
const postsPerPage = 9

// Mock data - Replace with actual API calls
const categories = ref([
  { id: 1, name: 'Công nghệ' },
  { id: 2, name: 'Điện thoại' },
  { id: 3, name: 'Laptop' },
  { id: 4, name: 'Đánh giá' },
  { id: 5, name: 'Tin tức' }
])

const featuredPost = ref({
  id: 1,
  title: 'Đánh giá iPhone 15 Pro Max: Flagship hoàn hảo nhất của Apple',
  excerpt: 'Khám phá những tính năng mới nhất và đột phá của iPhone 15 Pro Max, chiếc điện thoại cao cấp nhất từ Apple trong năm 2023.',
  image: 'https://picsum.photos/800/450',
  category: 'Đánh giá',
  author: 'Nguyễn Văn A',
  authorAvatar: 'https://i.pravatar.cc/40',
  date: '2024-03-15',
  slug: 'danh-gia-iphone-15-pro-max'
})

const posts = ref([
  {
    id: 2,
    title: 'So sánh MacBook Air M2 và MacBook Pro M2',
    excerpt: 'Phân tích chi tiết sự khác biệt giữa hai dòng laptop mới nhất của Apple',
    image: 'https://picsum.photos/800/451',
    category: 'Laptop',
    author: 'Trần Thị B',
    authorAvatar: 'https://i.pravatar.cc/41',
    date: '2024-03-14',
    slug: 'so-sanh-macbook-air-m2-va-pro-m2'
  },
  // Add more mock posts here
])

// Computed properties
const filteredPosts = computed(() => {
  let result = [...posts.value]
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query)
    )
  }

  // Apply category filter
  if (selectedCategory.value) {
    result = result.filter(post => post.category === selectedCategory.value)
  }

  // Apply sorting
  switch (sortBy.value) {
    case 'popular':
      result.sort((a, b) => b.views - a.views)
      break
    case 'oldest':
      result.sort((a, b) => new Date(a.date) - new Date(b.date))
      break
    default: // latest
      result.sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  return result
})

const totalPages = computed(() => 
  Math.ceil(filteredPosts.value.length / postsPerPage)
)

const displayedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage
  const end = start + postsPerPage
  return filteredPosts.value.slice(start, end)
})

// Watchers
watch([searchQuery, selectedCategory, sortBy], () => {
  currentPage.value = 1
})
</script>

<style scoped>
.blog-section {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 3rem 1.5rem;
}

.header-section {
  text-align: center;
}
</style> 