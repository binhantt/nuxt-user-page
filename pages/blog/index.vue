<template>
  <div class="section blog-section">
    <div class="container">
      <!-- Header Section -->
      <div class="header-section mb-6">
        <h1 class="title is-2">Blog</h1>
        <div class="subtitle is-5">Khám phá những bài viết mới nhất về công nghệ</div>
        
        <!-- Search and Filter Bar -->
        <div class="columns is-vcentered mt-4">
          <div class="column is-6">
            <div class="field">
              <div class="control has-icons-left">
                <input 
                  class="input" 
                  type="text" 
                  v-model="searchQuery" 
                  placeholder="Tìm kiếm bài viết..."
                >
                <span class="icon is-left">
                  <i class="fas fa-search"></i>
                </span>
              </div>
            </div>
          </div>
          <div class="column is-3">
            <div class="select is-fullwidth">
              <select v-model="selectedCategory">
                <option value="">Tất cả danh mục</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="column is-3">
            <div class="select is-fullwidth">
              <select v-model="sortBy">
                <option value="latest">Mới nhất</option>
                <option value="popular">Phổ biến nhất</option>
                <option value="oldest">Cũ nhất</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Featured Post -->
      <div v-if="featuredPost" class="featured-post mb-6">
        <div class="card">
          <div class="columns is-gapless">
            <div class="column is-7">
              <div class="card-image">
                <figure class="image is-16by9">
                  <img :src="featuredPost.image" :alt="featuredPost.title">
                </figure>
              </div>
            </div>
            <div class="column is-5">
              <div class="card-content">
                <div class="featured-tag">Bài viết nổi bật</div>
                <p class="category">{{ featuredPost.category }}</p>
                <h2 class="title is-3">{{ featuredPost.title }}</h2>
                <p class="description">{{ featuredPost.excerpt }}</p>
                <div class="meta-info">
                  <span class="author">
                    <img :src="featuredPost.authorAvatar" :alt="featuredPost.author" class="avatar">
                    {{ featuredPost.author }}
                  </span>
                  <span class="date">{{ formatDate(featuredPost.date) }}</span>
                </div>
                <NuxtLink :to="'/blog/' + featuredPost.slug" class="button is-primary mt-4">
                  Đọc tiếp
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Blog Posts Grid -->
      <div class="columns is-multiline">
        <div v-for="post in displayedPosts" :key="post.id" class="column is-4">
          <div class="card blog-card">
            <div class="card-image">
              <figure class="image is-16by9">
                <img :src="post.image" :alt="post.title">
              </figure>
              <div class="category-tag">{{ post.category }}</div>
            </div>
            <div class="card-content">
              <h3 class="title is-4">{{ post.title }}</h3>
              <p class="excerpt">{{ post.excerpt }}</p>
              <div class="meta-info">
                <span class="author">
                  <img :src="post.authorAvatar" :alt="post.author" class="avatar">
                  {{ post.author }}
                </span>
                <span class="date">{{ formatDate(post.date) }}</span>
              </div>
              <NuxtLink :to="'/blog/' + post.slug" class="button is-primary is-outlined is-fullwidth mt-4">
                Đọc tiếp
              </NuxtLink>
            </div>
          </div>
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

// Utility functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

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

.featured-post .card {
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.featured-post .card-content {
  padding: 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.featured-tag {
  background: #4086f4;
  color: white;
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.blog-card {
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;
  position: relative;
}

.blog-card:hover {
  transform: translateY(-5px);
}

.category-tag {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(64, 134, 244, 0.9);
  color: white;
  padding: 0.3rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.meta-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.excerpt {
  color: #666;
  margin: 1rem 0;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Responsive adjustments */
@media screen and (max-width: 768px) {
  .featured-post .columns {
    flex-direction: column;
  }
  
  .featured-post .column {
    padding: 0;
  }
  
  .featured-post .card-content {
    padding: 1.5rem;
  }
}
</style> 