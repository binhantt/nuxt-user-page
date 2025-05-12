<template>
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
</template>

<script setup>
defineProps({
  post: {
    type: Object,
    required: true
  }
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
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
</style> 