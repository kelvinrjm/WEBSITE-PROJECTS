// ==========================================================================
// JMJ OIL — Website Interactivity & Checkout Engine
// ==========================================================================

// ── PRODUCT STATE (2 products only) ──────────────────────────────────────
const productState = {
  "a2-cow": {
    name: "Pure Ghee",
    size: "200ml",
    quantity: 1
  },
  "buffalo": {
    name: "Pure Ghee",
    size: "500ml",
    quantity: 1
  }
};

let activeCheckoutProduct = null;

// ── INIT ──────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initNavbarScroll();
  initSlider();
  initScrollReveal();
});

// ── 1. MOBILE MENU ────────────────────────────────────────────────────────
function toggleMenu() {
  const btn = document.getElementById("hamburger-btn");
  const drawer = document.getElementById("mobile-drawer");
  if (!btn || !drawer) return;

  btn.classList.toggle("active");
  drawer.classList.toggle("active");
  document.body.style.overflow = drawer.classList.contains("active") ? "hidden" : "";
}

// ── 2. NAVBAR SCROLL EFFECT ───────────────────────────────────────────────
function initNavbarScroll() {
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section");

  window.addEventListener("scroll", () => {
    // Add scrolled class for glassmorphism effect
    navbar.classList.toggle("navbar-scrolled", window.scrollY > 50);

    // Highlight active nav link based on current scroll position
    let current = "";
    sections.forEach(sec => {
      if (window.pageYOffset >= sec.offsetTop - 120) {
        current = sec.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
}

// ── 3. HERO SLIDER ────────────────────────────────────────────────────────
let currentSlide = 0;
let slideTimer;

function initSlider() {
  const slides = document.querySelectorAll(".hero-slide");
  const dotsContainer = document.getElementById("slider-dots");
  if (!slides.length || !dotsContainer) return;

  // Build dots dynamically
  dotsContainer.innerHTML = "";
  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  startSlideTimer();
}

function startSlideTimer() {
  clearInterval(slideTimer);
  slideTimer = setInterval(nextSlide, 5000);
}

function showSlide(index) {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".slider-dots span");

  // Wrap around
  if (index >= slides.length) index = 0;
  if (index < 0) index = slides.length - 1;
  currentSlide = index;

  slides.forEach(s => s.classList.remove("active"));
  dots.forEach(d => d.classList.remove("active"));

  slides[currentSlide].classList.add("active");
  if (dots[currentSlide]) dots[currentSlide].classList.add("active");
}

function nextSlide() {
  showSlide(currentSlide + 1);
  startSlideTimer();
}

function prevSlide() {
  showSlide(currentSlide - 1);
  startSlideTimer();
}

function goToSlide(i) {
  showSlide(i);
  startSlideTimer();
}

// ── 4. QUANTITY CONTROL ───────────────────────────────────────────────────
function updateQty(productId, change) {
  const state = productState[productId];
  if (!state) return;

  let newQty = state.quantity + change;
  if (newQty < 1) newQty = 1;
  if (newQty > 99) newQty = 99;
  state.quantity = newQty;

  const el = document.getElementById(`qty-${productId}`);
  if (el) el.innerText = newQty;
}

// ── 5. IMAGE PREVIEW POPUP ────────────────────────────────────────────────
function openPreview(src, caption) {
  const box = document.getElementById("previewBox");
  const img = document.getElementById("previewImg");
  const cap = document.getElementById("previewCaption");

  if (!box || !img) return;
  img.src = src;
  if (cap) cap.innerText = caption || "";
  box.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closePreview() {
  const box = document.getElementById("previewBox");
  if (box) {
    box.style.display = "none";
    document.body.style.overflow = "";
  }
}

// ── 6. SCROLL REVEAL ANIMATION ────────────────────────────────────────────
function initScrollReveal() {
  const els = document.querySelectorAll(".scroll-reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

  els.forEach(el => observer.observe(el));
}

// ── 7. WHATSAPP CHECKOUT MODAL ────────────────────────────────────────────
function openCheckout(productId) {
  const state = productState[productId];
  if (!state) return;

  activeCheckoutProduct = productId;

  // Populate summary
  const name = document.getElementById("summary-name");
  const size = document.getElementById("summary-size");
  const qty  = document.getElementById("summary-qty");

  if (name) name.innerText = state.name;
  if (size) size.innerText = state.size;
  if (qty)  qty.innerText  = state.quantity;

  // Clear form
  const custName = document.getElementById("cust-name");
  const custPhone = document.getElementById("cust-phone");
  const custAddr = document.getElementById("cust-address");
  if (custName) custName.value = "";
  if (custPhone) custPhone.value = "";
  if (custAddr) custAddr.value = "";

  // Show modal
  const modal = document.getElementById("checkoutModal");
  if (modal) {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  }
}

function closeCheckout() {
  const modal = document.getElementById("checkoutModal");
  if (modal) {
    modal.classList.remove("show");
    document.body.style.overflow = "";
  }
  activeCheckoutProduct = null;
}

function sendWhatsAppOrder(event) {
  event.preventDefault();
  if (!activeCheckoutProduct) return;

  const state = productState[activeCheckoutProduct];
  const name = (document.getElementById("cust-name").value || "").trim();
  const addr = (document.getElementById("cust-address").value || "").trim();

  if (!name || !addr) {
    alert("Please fill in your name and delivery address.");
    return;
  }

  const msg = `Hi JMJ OIL Team! 

I would like to place an order:

Order Details:
• Product: ${state.name}
• Pack Size: ${state.size}
• Quantity: ${state.quantity} 

 Delivery Info:
• Name: ${name}
• Address: ${addr}


Please confirm the order and share payment details. Thank you!`;

  const url = `https://wa.me/919442442667?text=${encodeURIComponent(msg)}`;
  closeCheckout();
  window.open(url, "_blank");
}

// ── 8. INQUIRY FORM → EMAIL TO rjmkelvin@gmail.com ───────────────────────
function handleInquiry(event) {
  event.preventDefault();

  const name    = (document.getElementById("usrname").value || "").trim();
  const email   = (document.getElementById("usrmail").value || "").trim();
  const message = (document.getElementById("usrmsg").value || "").trim();

  if (!name || !email || !message) return;

  const subject = encodeURIComponent(`JMJ OIL Inquiry from ${name}`);
  const body = encodeURIComponent(
`Hello JMJ OIL Team,

I am reaching out via your website contact form.

Name: ${name}
Email: ${email}

Message:
${message}

Kindly reply at your earliest convenience.

Best regards,
${name}`
  );

  alert(`Thank you, ${name}! Your email client will open to send your message to srexjoy@gmail.com.`);
  document.getElementById("inquiryForm").reset();
  window.location.href = `mailto:srexjoy@gmail.com?subject=${subject}&body=${body}`;
}
