<template>
  <div v-if="post" class="featured-post mb-6">
    <div class="card">
      <div class="columns is-gapless">
        <div class="column is-7">
          <div class="card-image">
            <figure class="image is-16by9">
              <img :src="post.image" :alt="post.title">
            </figure>
          </div>
        </div>
        <div class="column is-5">
          <div class="card-content">
            <div class="featured-tag">Bài viết nổi bật</div>
            <p class="category">{{ post.category }}</p>
            <h2 class="title is-3">{{ post.title }}</h2>
            <p class="description">{{ post.excerpt }}</p>
            <div class="meta-info">
              <span class="author">
                <img :src="post.authorAvatar" :alt="post.author" class="avatar">
                {{ post.author }}
              </span>
              <span class="date">{{ formatDate(post.date) }}</span>
            </div>
            <NuxtLink :to="'/blog/' + post.slug" class="button is-primary mt-4">
              Đọc tiếp
            </NuxtLink>
          </div>
        </div>
      </div>
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