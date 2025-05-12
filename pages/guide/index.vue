<template>
  <div class="section guide-section">
    <div class="container">
      <div class="columns">
        <!-- Sidebar Navigation -->
        <div class="column is-3">
          <aside class="menu guide-menu">
            <p class="menu-label">
              Hướng dẫn chung
            </p>
            <ul class="menu-list">
              <li>
                <a 
                  :class="{ 'is-active': activeSection === 'getting-started' }"
                  @click="scrollToSection('getting-started')"
                >
                  Bắt đầu
                </a>
              </li>
              <li>
                <a 
                  :class="{ 'is-active': activeSection === 'account' }"
                  @click="scrollToSection('account')"
                >
                  Tài khoản
                </a>
              </li>
            </ul>

            <p class="menu-label">
              Mua sắm
            </p>
            <ul class="menu-list">
              <li>
                <a 
                  :class="{ 'is-active': activeSection === 'browsing' }"
                  @click="scrollToSection('browsing')"
                >
                  Tìm kiếm sản phẩm
                </a>
              </li>
              <li>
                <a 
                  :class="{ 'is-active': activeSection === 'ordering' }"
                  @click="scrollToSection('ordering')"
                >
                  Đặt hàng
                </a>
              </li>
              <li>
                <a 
                  :class="{ 'is-active': activeSection === 'payment' }"
                  @click="scrollToSection('payment')"
                >
                  Thanh toán
                </a>
              </li>
            </ul>

            <p class="menu-label">
              Hỗ trợ
            </p>
            <ul class="menu-list">
              <li>
                <a 
                  :class="{ 'is-active': activeSection === 'faq' }"
                  @click="scrollToSection('faq')"
                >
                  Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <a 
                  :class="{ 'is-active': activeSection === 'contact' }"
                  @click="scrollToSection('contact')"
                >
                  Liên hệ hỗ trợ
                </a>
              </li>
            </ul>
          </aside>
        </div>

        <!-- Main Content -->
        <div class="column is-9">
          <div class="guide-content">
            <!-- Getting Started -->
            <section id="getting-started" class="guide-section">
              <h1 class="title is-2">Hướng dẫn sử dụng</h1>
              <p class="subtitle is-5">Chào mừng bạn đến với hướng dẫn sử dụng website của chúng tôi</p>
              
              <div class="content">
                <h2 class="title is-4">Bắt đầu</h2>
                <p>Website của chúng tôi cung cấp các tính năng:</p>
                <ul>
                  <li>Tìm kiếm và mua sắm sản phẩm công nghệ</li>
                  <li>Theo dõi đơn hàng và lịch sử mua hàng</li>
                  <li>Đánh giá và bình luận sản phẩm</li>
                  <li>Tham gia cộng đồng và chia sẻ kinh nghiệm</li>
                </ul>
              </div>
            </section>

            <!-- Account -->
            <section id="account" class="guide-section">
              <div class="content">
                <h2 class="title is-4">Tài khoản</h2>
                <h3 class="title is-5">Đăng ký tài khoản</h3>
                <p>Để đăng ký tài khoản mới, bạn cần:</p>
                <ol>
                  <li>Nhấp vào nút "Đăng ký" ở góc phải trên cùng</li>
                  <li>Điền thông tin cá nhân: email, mật khẩu, họ tên</li>
                  <li>Xác nhận email đăng ký</li>
                  <li>Hoàn tất thông tin hồ sơ</li>
                </ol>

                <h3 class="title is-5">Đăng nhập</h3>
                <p>Đăng nhập vào tài khoản bằng:</p>
                <ul>
                  <li>Email và mật khẩu đã đăng ký</li>
                  <li>Tài khoản Google</li>
                  <li>Tài khoản Facebook</li>
                </ul>
              </div>
            </section>

            <!-- Browsing -->
            <section id="browsing" class="guide-section">
              <div class="content">
                <h2 class="title is-4">Tìm kiếm sản phẩm</h2>
                <p>Có nhiều cách để tìm sản phẩm bạn quan tâm:</p>
                
                <h3 class="title is-5">Tìm kiếm trực tiếp</h3>
                <ul>
                  <li>Sử dụng thanh tìm kiếm ở đầu trang</li>
                  <li>Gõ tên sản phẩm, hãng, hoặc mã sản phẩm</li>
                  <li>Sử dụng bộ lọc để thu hẹp kết quả</li>
                </ul>

                <h3 class="title is-5">Duyệt danh mục</h3>
                <ul>
                  <li>Chọn danh mục sản phẩm từ menu chính</li>
                  <li>Lọc theo thương hiệu, giá cả, tính năng</li>
                  <li>Sắp xếp theo các tiêu chí khác nhau</li>
                </ul>
              </div>
            </section>

            <!-- Ordering -->
            <section id="ordering" class="guide-section">
              <div class="content">
                <h2 class="title is-4">Đặt hàng</h2>
                <p>Quy trình đặt hàng gồm các bước:</p>
                
                <div class="steps">
                  <div class="step-item">
                    <div class="step-marker">1</div>
                    <div class="step-details">
                      <p class="step-title">Chọn sản phẩm</p>
                      <p>Thêm sản phẩm vào giỏ hàng</p>
                    </div>
                  </div>

                  <div class="step-item">
                    <div class="step-marker">2</div>
                    <div class="step-details">
                      <p class="step-title">Kiểm tra giỏ hàng</p>
                      <p>Xem lại số lượng và thông tin sản phẩm</p>
                    </div>
                  </div>

                  <div class="step-item">
                    <div class="step-marker">3</div>
                    <div class="step-details">
                      <p class="step-title">Thông tin giao hàng</p>
                      <p>Điền địa chỉ và thông tin liên hệ</p>
                    </div>
                  </div>

                  <div class="step-item">
                    <div class="step-marker">4</div>
                    <div class="step-details">
                      <p class="step-title">Thanh toán</p>
                      <p>Chọn phương thức và hoàn tất thanh toán</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Payment -->
            <section id="payment" class="guide-section">
              <div class="content">
                <h2 class="title is-4">Thanh toán</h2>
                <h3 class="title is-5">Phương thức thanh toán</h3>
                <div class="payment-methods">
                  <div class="payment-method">
                    <span class="icon">
                      <i class="fas fa-money-bill-wave"></i>
                    </span>
                    <h4>Tiền mặt</h4>
                    <p>Thanh toán khi nhận hàng (COD)</p>
                  </div>

                  <div class="payment-method">
                    <span class="icon">
                      <i class="fas fa-credit-card"></i>
                    </span>
                    <h4>Thẻ ngân hàng</h4>
                    <p>Thẻ ATM nội địa, Visa, Mastercard</p>
                  </div>

                  <div class="payment-method">
                    <span class="icon">
                      <i class="fas fa-wallet"></i>
                    </span>
                    <h4>Ví điện tử</h4>
                    <p>Momo, ZaloPay, VNPay</p>
                  </div>
                </div>
              </div>
            </section>

            <!-- FAQ -->
            <section id="faq" class="guide-section">
              <div class="content">
                <h2 class="title is-4">Câu hỏi thường gặp</h2>
                <div class="faq-list">
                  <div class="faq-item" v-for="(faq, index) in faqs" :key="index">
                    <div 
                      class="faq-question" 
                      :class="{ 'is-active': faq.isOpen }"
                      @click="toggleFaq(index)"
                    >
                      <span>{{ faq.question }}</span>
                      <span class="icon">
                        <i class="fas" :class="faq.isOpen ? 'fa-minus' : 'fa-plus'"></i>
                      </span>
                    </div>
                    <div class="faq-answer" v-show="faq.isOpen">
                      {{ faq.answer }}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Contact -->
            <section id="contact" class="guide-section">
              <div class="content">
                <h2 class="title is-4">Liên hệ hỗ trợ</h2>
                <div class="contact-methods">
                  <div class="contact-method">
                    <span class="icon">
                      <i class="fas fa-phone"></i>
                    </span>
                    <h4>Hotline</h4>
                    <p>1800 1234</p>
                    <p class="subtitle">24/7</p>
                  </div>

                  <div class="contact-method">
                    <span class="icon">
                      <i class="fas fa-envelope"></i>
                    </span>
                    <h4>Email</h4>
                    <p>support@example.com</p>
                    <p class="subtitle">Phản hồi trong 24h</p>
                  </div>

                  <div class="contact-method">
                    <span class="icon">
                      <i class="fas fa-comments"></i>
                    </span>
                    <h4>Live Chat</h4>
                    <p>Chat trực tuyến</p>
                    <p class="subtitle">8:00 - 22:00</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const activeSection = ref('getting-started')

// Mock FAQ data
const faqs = ref([
  {
    question: 'Làm thế nào để theo dõi đơn hàng?',
    answer: 'Bạn có thể theo dõi đơn hàng bằng cách đăng nhập vào tài khoản và vào mục "Đơn hàng của tôi". Tại đây bạn sẽ thấy trạng thái và thông tin chi tiết về đơn hàng.',
    isOpen: false
  },
  {
    question: 'Chính sách đổi trả như thế nào?',
    answer: 'Chúng tôi áp dụng chính sách đổi trả trong vòng 7 ngày kể từ ngày nhận hàng. Sản phẩm cần giữ nguyên tem mác và không có dấu hiệu đã qua sử dụng.',
    isOpen: false
  },
  {
    question: 'Thời gian giao hàng mất bao lâu?',
    answer: 'Thời gian giao hàng thông thường từ 2-3 ngày làm việc đối với khu vực nội thành và 3-5 ngày làm việc đối với khu vực ngoại thành.',
    isOpen: false
  }
])

// Functions
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    activeSection.value = sectionId
  }
}

const toggleFaq = (index) => {
  faqs.value[index].isOpen = !faqs.value[index].isOpen
}

// Intersection Observer for active section
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeSection.value = entry.target.id
      }
    })
  }, { threshold: 0.5 })

  document.querySelectorAll('.guide-section').forEach(section => {
    observer.observe(section)
  })
})
</script>

<style scoped>
.guide-section {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 2rem 0;
}

.guide-menu {
  position: sticky;
  top: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.menu-label {
  color: #4a4a4a;
  font-weight: 600;
  margin-top: 1rem;
}

.menu-list a {
  border-radius: 6px;
  padding: 0.5rem 1rem;
  margin: 0.2rem 0;
  transition: all 0.3s ease;
}

.menu-list a:hover {
  background-color: #f0f0f0;
}

.menu-list a.is-active {
  background-color: #4086f4;
  color: white;
}

.guide-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.guide-content section {
  margin-bottom: 3rem;
  scroll-margin-top: 2rem;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 2rem 0;
}

.step-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.step-marker {
  background: #4086f4;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.step-details {
  flex-grow: 1;
}

.step-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.payment-methods,
.contact-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.payment-method,
.contact-method {
  padding: 1.5rem;
  border-radius: 8px;
  background: #f8f9fa;
  text-align: center;
}

.payment-method .icon,
.contact-method .icon {
  font-size: 2rem;
  color: #4086f4;
  margin-bottom: 1rem;
}

.faq-list {
  margin: 2rem 0;
}

.faq-item {
  margin-bottom: 1rem;
}

.faq-question {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.faq-question:hover {
  background: #f0f0f0;
}

.faq-question.is-active {
  background: #4086f4;
  color: white;
}

.faq-answer {
  padding: 1rem;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 0 0 8px 8px;
  margin-top: -8px;
}

/* Responsive adjustments */
@media screen and (max-width: 768px) {
  .guide-menu {
    position: relative;
    top: 0;
    margin-bottom: 2rem;
  }

  .guide-content {
    padding: 1rem;
  }

  .payment-methods,
  .contact-methods {
    grid-template-columns: 1fr;
  }

  .step-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style> 