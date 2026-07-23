document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  const titleEl = document.getElementById("product-title");
  const descEl = document.getElementById("product-desc");
  const priceEl = document.getElementById("product-price");
  const breadcrumbTitle = document.getElementById("breadcrumb-title");
  const pageEl = document.getElementById("product-page");

  const track = document.getElementById("gallery-track");
  const dotsWrap = document.getElementById("gallery-dots");
  const thumbsWrap = document.getElementById("gallery-thumbs");
  const prevBtn = document.getElementById("gallery-prev");
  const nextBtn = document.getElementById("gallery-next");

  const qtyValueEl = document.getElementById("qty-value");
  const qtyMinusBtn = document.getElementById("qty-minus");
  const qtyPlusBtn = document.getElementById("qty-plus");

  const addToCartBtn = document.getElementById("add-to-cart-btn");
  const mobileAddToCartBtn = document.getElementById("mobile-add-to-cart-btn");
  const mobileCtaPrice = document.getElementById("mobile-cta-price");

  const toast = document.getElementById("cart-toast");

  let quantity = 1;
  let currentProduct = null;
  let slideCount = 0;

  showSkeleton();

  if (!productId) {
    showNotFound();
  } else {
    loadProduct(productId);
  }

  // ============================
  // Загрузка товара
  // ============================
  async function loadProduct(id) {
    const { data, error } = await supabaseClient
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      console.log("Product load error:", error);
      showNotFound();
      return;
    }

    currentProduct = data;
    renderProduct(data);
  }

  function renderProduct(product) {
    titleEl.textContent = product.title || "Untitled product";
    breadcrumbTitle.textContent = product.title || "";

    descEl.innerHTML = "";
    const descText = (product.description || "").trim();
    if (descText) {
      descText.split(/\n+/).forEach(paragraph => {
        if (!paragraph.trim()) return;
        const p = document.createElement("p");
        p.textContent = paragraph.trim();
        descEl.appendChild(p);
      });
    }

    const priceValue = formatPrice(product.price);
    priceEl.innerHTML = `${priceValue}<span class="price-note">one-time payment</span>`;
    mobileCtaPrice.textContent = priceValue;

    renderGallery(getImages(product));
  }

  function formatPrice(price) {
    const num = Number(price);
    if (Number.isNaN(num)) return "—";
    return `$${num.toFixed(2)}`;
  }

  function showNotFound() {
    pageEl.innerHTML = `
      <div class="product-not-found">
        <p>This product couldn't be found.</p>
        <p><a href="product-catalog.html">← Back to catalog</a></p>
      </div>
    `;
    breadcrumbTitle.textContent = "Not found";
    document.querySelector(".mobile-cta-bar").style.display = "none";
  }

  function showSkeleton() {
    track.innerHTML = `<div class="gallery-slide"><div class="sk" style="width:100%;height:100%"></div></div>`;
    titleEl.innerHTML = `<span class="sk sk-line" style="width:70%;display:block;height:22px"></span>`;
    descEl.innerHTML = `
      <span class="sk sk-line" style="width:100%"></span>
      <span class="sk sk-line" style="width:90%"></span>
      <span class="sk sk-line" style="width:60%"></span>
    `;
    priceEl.innerHTML = `<span class="sk sk-line" style="width:80px;height:22px;display:block"></span>`;
  }

  // ============================
  // Изображения (готово к будущим нескольким фото)
  // ============================
  function getImages(product) {
    const tryParse = (val) => {
      if (Array.isArray(val)) return val.filter(Boolean);
      if (typeof val === "string" && val.trim().startsWith("[")) {
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) return parsed.filter(Boolean);
        } catch (e) {}
      }
      return null;
    };

    let images = tryParse(product.images) || tryParse(product.image_url);

    if (!images) {
      if (typeof product.image_url === "string" && product.image_url.trim()) {
        images = [product.image_url.trim()];
      } else {
        images = [];
      }
    }

    return images;
  }

  // ============================
  // Галерея
  // ============================
  function renderGallery(images) {
    track.innerHTML = "";
    dotsWrap.innerHTML = "";
    thumbsWrap.innerHTML = "";

    if (images.length === 0) {
      images = [null];
    }

    slideCount = images.length;

    images.forEach((src) => {
      const slide = document.createElement("div");
      slide.className = "gallery-slide";

      if (src) {
        const img = document.createElement("img");
        img.src = src;
        img.alt = currentProduct ? currentProduct.title : "";
        slide.appendChild(img);
      } else {
        slide.classList.add("placeholder");
        slide.textContent = "No image";
      }

      track.appendChild(slide);
    });

    const multiple = slideCount > 1;

    prevBtn.style.display = multiple ? "flex" : "none";
    nextBtn.style.display = multiple ? "flex" : "none";
    dotsWrap.style.display = multiple ? "flex" : "none";
    thumbsWrap.style.display = multiple ? "flex" : "none";

    if (multiple) {
      images.forEach((src, i) => {
        const dot = document.createElement("div");
        dot.className = "dot" + (i === 0 ? " active" : "");
        dot.addEventListener("click", () => goToSlide(i));
        dotsWrap.appendChild(dot);

        if (src) {
          const thumb = document.createElement("div");
          thumb.className = "thumb" + (i === 0 ? " active" : "");
          const img = document.createElement("img");
          img.src = src;
          thumb.appendChild(img);
          thumb.addEventListener("click", () => goToSlide(i));
          thumbsWrap.appendChild(thumb);
        }
      });

      setupGalleryObserver();
    }
  }

  function goToSlide(index) {
    const slide = track.children[index];
    if (!slide) return;
    track.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
  }

  function setupGalleryObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(track.children).indexOf(entry.target);
            setActiveSlide(index);
          }
        });
      },
      { root: track, threshold: 0.6 }
    );

    Array.from(track.children).forEach((slide) => observer.observe(slide));
  }

  function setActiveSlide(index) {
    dotsWrap.querySelectorAll(".dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
    thumbsWrap.querySelectorAll(".thumb").forEach((thumb, i) => {
      thumb.classList.toggle("active", i === index);
    });
  }

  prevBtn.addEventListener("click", () => {
    const activeDot = dotsWrap.querySelector(".dot.active");
    const currentIndex = activeDot ? Array.from(dotsWrap.children).indexOf(activeDot) : 0;
    goToSlide(Math.max(0, currentIndex - 1));
  });

  nextBtn.addEventListener("click", () => {
    const activeDot = dotsWrap.querySelector(".dot.active");
    const currentIndex = activeDot ? Array.from(dotsWrap.children).indexOf(activeDot) : 0;
    goToSlide(Math.min(slideCount - 1, currentIndex + 1));
  });

  // ============================
  // Количество
  // ============================
  qtyMinusBtn.addEventListener("click", () => {
    quantity = Math.max(1, quantity - 1);
    qtyValueEl.textContent = quantity;
  });

  qtyPlusBtn.addEventListener("click", () => {
    quantity = Math.min(99, quantity + 1);
    qtyValueEl.textContent = quantity;
  });

  // ============================
  // Добавление в корзину
  // ============================
  function handleAddToCart() {
    if (!currentProduct) return;

    const item = {
      id: currentProduct.id,
      title: currentProduct.title,
      price: currentProduct.price,
      image_url: getImages(currentProduct)[0] || null,
    };

    for (let i = 0; i < quantity; i++) {
      if (typeof window.addToCart === "function") {
        window.addToCart(item);
      } else {
        addToCartFallback(item);
      }
    }

    showToast();
  }

  function addToCartFallback(item) {
    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem("cart")) || [];
    } catch (e) {
      cart = [];
    }

    const existing = cart.find((c) => c.id === item.id);
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      cart.push({ ...item, qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartBadge(cart.reduce((sum, c) => sum + (c.qty || 1), 0));
  }

  function updateCartBadge(count) {
    document.querySelectorAll(".cart-badge").forEach((el) => {
      el.textContent = count;
    });
  }

  addToCartBtn.addEventListener("click", handleAddToCart);
  mobileAddToCartBtn.addEventListener("click", handleAddToCart);

  function showToast() {
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  }
});