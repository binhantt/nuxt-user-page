<template>
  <footer class="footer">
    <div class="container">
      <div class="columns">
        <!-- Company Info -->
        <div class="column is-4">
          <h3 class="title is-4 has-text-primary">Shop 247</h3>
          <p class="mb-4">
            Cung cấp giải pháp template chuyên nghiệp cho các sàn thương mại điện tử hàng đầu Việt Nam
          </p>
          <div class="social-icons">
            <a href="#" class="icon is-medium">
              <i class="fab fa-facebook fa-lg"></i>
            </a>
            <a href="#" class="icon is-medium">
              <i class="fab fa-twitter fa-lg"></i>
            </a>
            <a href="#" class="icon is-medium">
              <i class="fab fa-instagram fa-lg"></i>
            </a>
            <a href="#" class="icon is-medium">
              <i class="fab fa-youtube fa-lg"></i>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="column is-2">
          <h4 class="title is-5 has-text-primary">Liên Kết</h4>
          <ul class="footer-links">
            <li><a href="#">Trang Chủ</a></li>
            <li><a href="#">Cửa Hàng</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Liên Hệ</a></li>
          </ul>
        </div>

        <!-- Templates -->
        <div class="column is-2">
          <h4 class="title is-5 has-text-primary">Templates</h4>
          <ul class="footer-links">
            <li><a href="#">Shopee</a></li>
            <li><a href="#">Tiki</a></li>
            <li><a href="#">Lazada</a></li>
            <li><a href="#">Sendo</a></li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="column is-4">
          <h4 class="title is-5 has-text-primary">Liên Hệ</h4>
          <ul class="contact-info">
            <li>
              <span class="icon">
                <i class="fas fa-map-marker-alt"></i>
              </span>
              123 Đường ABC, Quận 1, TP.HCM
            </li>
            <li>
              <span class="icon">
                <i class="fas fa-phone"></i>
              </span>
              +84 123 456 789
            </li>
            <li>
              <span class="icon">
                <i class="fas fa-envelope"></i>
              </span>
              contact@templateshop.vn
            </li>
          </ul>
        </div>
      </div>

      <div class="divider"></div>

      <!-- Copyright -->
      <div class="copyright has-text-centered">
        <p>
          © {{ new Date().getFullYear() }} TEMPLATESHOP. Tất cả quyền được bảo lưu.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: white;
  padding: 4rem 1.5rem 2rem;
  color: #363636;
  border-top: 1px solid #f5f5f5;
}

.social-icons {
  margin-top: 1rem;
}

.social-icons a {
  color: #3273dc;
  margin-right: 1rem;
  transition: color 0.3s ease;
}

.social-icons a:hover {
  color: #ffd700;
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 0.75rem;
}

.footer-links a {
  color: #363636;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #3273dc;
}

.contact-info {
  list-style: none;
  padding: 0;
}

.contact-info li {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: #363636;
}

.contact-info .icon {
  margin-right: 0.75rem;
  color: #3273dc;
}

.divider {
  height: 1px;
  background: #f5f5f5;
  margin: 2rem 0;
}

.copyright {
  font-size: 0.9rem;
  color: #363636;
}

.has-text-primary {
  color: #3273dc !important;
}
</style> 