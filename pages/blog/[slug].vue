<template>
  <div class="section blog-post-section">
    <div class="container">
      <!-- Loading State -->
      <div v-if="loading" class="has-text-centered py-6">
        <span class="icon is-large">
          <i class="fas fa-spinner fa-pulse fa-3x"></i>
        </span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="notification is-danger">
        {{ error }}
      </div>

      <!-- Blog Post Content -->
      <div v-else class="blog-post-content">
        <!-- Header -->
        <div class="post-header">
          <div class="category-tag">{{ post.category }}</div>
          <h1 class="title is-1">{{ post.title }}</h1>
          
          <!-- Meta Information -->
          <div class="meta-info">
            <div class="author-info">
              <img :src="post.authorAvatar" :alt="post.author" class="avatar">
              <div class="author-details">
                <span class="author-name">{{ post.author }}</span>
                <span class="post-date">{{ formatDate(post.date) }}</span>
              </div>
            </div>
            <div class="post-stats">
              <span class="stat">
                <i class="fas fa-eye"></i> {{ post.views }} lượt xem
              </span>
              <span class="stat">
                <i class="fas fa-clock"></i> {{ post.readingTime }} phút đọc
              </span>
            </div>
          </div>
        </div>

        <!-- Featured Image -->
        <figure class="post-image">
          <img :src="post.image" :alt="post.title">
          <figcaption v-if="post.imageCaption">{{ post.imageCaption }}</figcaption>
        </figure>

        <!-- Content -->
        <div class="post-content content" v-html="post.content"></div>

        <!-- Tags -->
        <div class="post-tags">
          <span class="tag is-medium" v-for="tag in post.tags" :key="tag">
            #{{ tag }}
          </span>
        </div>

        <!-- Share Buttons -->
        <div class="share-buttons">
          <h4 class="subtitle is-6">Chia sẻ bài viết</h4>
          <div class="buttons">
            <button class="button is-info" @click="shareOnFacebook">
              <span class="icon">
                <i class="fab fa-facebook-f"></i>
              </span>
            </button>
            <button class="button is-info" @click="shareOnTwitter">
              <span class="icon">
                <i class="fab fa-twitter"></i>
              </span>
            </button>
            <button class="button is-success" @click="shareOnWhatsApp">
              <span class="icon">
                <i class="fab fa-whatsapp"></i>
              </span>
            </button>
            <button class="button is-primary" @click="copyLink">
              <span class="icon">
                <i class="fas fa-link"></i>
              </span>
            </button>
          </div>
        </div>

        <!-- Author Bio -->
        <div class="author-bio">
          <img :src="post.authorAvatar" :alt="post.author" class="author-avatar">
          <div class="author-details">
            <h4 class="author-name">{{ post.author }}</h4>
            <p class="author-description">{{ post.authorBio }}</p>
            <div class="author-social">
              <a v-for="social in post.authorSocial" 
                 :key="social.platform" 
                 :href="social.url" 
                 class="button is-small"
                 target="_blank"
              >
                <span class="icon">
                  <i :class="'fab fa-' + social.platform"></i>
                </span>
              </a>
            </div>
          </div>
        </div>

        <!-- Related Posts -->
        <div class="related-posts">
          <h3 class="title is-4">Bài viết liên quan</h3>
          <div class="columns">
            <div v-for="relatedPost in relatedPosts" 
                 :key="relatedPost.id" 
                 class="column is-4"
            >
              <div class="card">
                <div class="card-image">
                  <figure class="image is-16by9">
                    <img :src="relatedPost.image" :alt="relatedPost.title">
                  </figure>
                </div>
                <div class="card-content">
                  <p class="category">{{ relatedPost.category }}</p>
                  <h4 class="title is-5">{{ relatedPost.title }}</h4>
                  <NuxtLink 
                    :to="'/blog/' + relatedPost.slug" 
                    class="button is-primary is-outlined is-fullwidth"
                  >
                    Đọc tiếp
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const loading = ref(true)
const error = ref(null)

// Mock data - Replace with actual API calls
const post = ref({
  id: 1,
  title: 'Đánh giá iPhone 15 Pro Max: Flagship hoàn hảo nhất của Apple',
  content: `
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    <h2>Thiết kế đột phá</h2>
    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <blockquote>
      iPhone 15 Pro Max là một bước tiến quan trọng trong việc định nghĩa lại smartphone cao cấp
    </blockquote>
    <h2>Hiệu năng vượt trội</h2>
    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
  `,
  excerpt: 'Khám phá những tính năng mới nhất và đột phá của iPhone 15 Pro Max...',
  image: 'https://picsum.photos/1200/630',
  imageCaption: 'iPhone 15 Pro Max với thiết kế mới',
  category: 'Đánh giá',
  author: 'Nguyễn Văn A',
  authorAvatar: 'https://i.pravatar.cc/150',
  authorBio: 'Chuyên gia công nghệ với hơn 10 năm kinh nghiệm đánh giá smartphone và các thiết bị di động.',
  authorSocial: [
    { platform: 'twitter', url: 'https://twitter.com' },
    { platform: 'linkedin', url: 'https://linkedin.com' },
    { platform: 'facebook', url: 'https://facebook.com' }
  ],
  date: '2024-03-15',
  views: 1234,
  readingTime: 5,
  tags: ['iPhone', 'Apple', 'Smartphone', 'Review'],
  slug: 'danh-gia-iphone-15-pro-max'
})

const relatedPosts = ref([
  {
    id: 2,
    title: 'So sánh camera iPhone 15 Pro Max với Samsung S24 Ultra',
    image: 'https://picsum.photos/800/450',
    category: 'So sánh',
    slug: 'so-sanh-camera-iphone-15-pro-max-voi-samsung-s24-ultra'
  },
  {
    id: 3,
    title: 'Đánh giá chi tiết iOS 17.4',
    image: 'https://picsum.photos/800/451',
    category: 'Phần mềm',
    slug: 'danh-gia-chi-tiet-ios-17-4'
  },
  {
    id: 4,
    title: 'Tất cả những gì bạn cần biết về iPhone 16',
    image: 'https://picsum.photos/800/452',
    category: 'Tin đồn',
    slug: 'tat-ca-nhung-gi-ban-can-biet-ve-iphone-16'
  }
])

// Simulating API call
onMounted(async () => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    loading.value = false
  } catch (err) {
    error.value = 'Không thể tải bài viết. Vui lòng thử lại sau.'
    loading.value = false
  }
})

// Utility functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Share functions
const shareOnFacebook = () => {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`)
}

const shareOnTwitter = () => {
  window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.value.title)}`)
}

const shareOnWhatsApp = () => {
  window.open(`https://wa.me/?text=${encodeURIComponent(post.value.title + ' ' + window.location.href)}`)
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    // You might want to show a toast notification here
  } catch (err) {
    console.error('Failed to copy link:', err)
  }
}
</script>

<style scoped>
.blog-post-section {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 3rem 1.5rem;
}

.blog-post-content {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.post-header {
  text-align: center;
  margin-bottom: 2rem;
}

.category-tag {
  background: #4086f4;
  color: white;
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.meta-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding: 1rem 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.author-details {
  text-align: left;
}

.author-name {
  display: block;
  font-weight: 600;
  color: #2c3e50;
}

.post-date {
  display: block;
  font-size: 0.9rem;
  color: #666;
}

.post-stats {
  display: flex;
  gap: 1rem;
}

.stat {
  color: #666;
  font-size: 0.9rem;
}

.stat i {
  margin-right: 0.5rem;
}

.post-image {
  margin: 2rem -2rem;
}

.post-image img {
  width: 100%;
  height: auto;
}

.post-image figcaption {
  text-align: center;
  padding: 1rem;
  color: #666;
  font-style: italic;
}

.post-content {
  line-height: 1.8;
  font-size: 1.1rem;
}

.post-content h2 {
  margin-top: 2rem;
}

.post-content blockquote {
  margin: 2rem 0;
  padding: 1rem 2rem;
  border-left: 4px solid #4086f4;
  background: #f8f9fa;
  font-style: italic;
}

.post-tags {
  margin: 2rem 0;
}

.post-tags .tag {
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}

.share-buttons {
  text-align: center;
  margin: 2rem 0;
  padding: 2rem 0;
  border-top: 1px solid #eee;
}

.share-buttons .buttons {
  justify-content: center;
  gap: 0.5rem;
}

.author-bio {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  margin: 2rem 0;
}

.author-bio .author-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.author-bio .author-name {
  margin-bottom: 0.5rem;
}

.author-bio .author-description {
  color: #666;
  margin-bottom: 1rem;
}

.author-social {
  display: flex;
  gap: 0.5rem;
}

.related-posts {
  margin-top: 3rem;
}

.related-posts .card {
  height: 100%;
  transition: transform 0.3s ease;
}

.related-posts .card:hover {
  transform: translateY(-5px);
}

.related-posts .category {
  color: #4086f4;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

/* Responsive adjustments */
@media screen and (max-width: 768px) {
  .blog-post-content {
    padding: 1rem;
  }
  
  .meta-info {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .author-info {
    justify-content: center;
  }
  
  .post-stats {
    justify-content: center;
  }
  
  .post-image {
    margin: 1rem -1rem;
  }
  
  .author-bio {
    flex-direction: column;
    text-align: center;
    padding: 1rem;
  }
  
  .author-bio .author-avatar {
    margin: 0 auto;
  }
  
  .author-social {
    justify-content: center;
  }
}
</style> 