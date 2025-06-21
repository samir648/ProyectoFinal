// Datos de productos (simulando una base de datos)
const products = [
  {
    id: 1,
    name: "Whisky Johnnie Walker Black Label",
    category: "whisky",
    price: 100000,
    image: "img/whisky-johnnie-walker.jpeg",
  },
  {
    id: 2,
    name: "Ron Medellín 8 Años",
    category: "ron",
    price: 50000,
    image: "img/ron-medellin.png",
  },
  {
    id: 3,
    name: "Cerveza Aguila Light",
    category: "cerveza",
    price: 3000,
    image: "img/cerveza-aguila.webp",
  },
  {
    id: 4,
    name: "Aguardiente Amarillo",
    category: "aguardiente",
    price: 60000,
    image: "img/aguardiente-amarillo.jpeg",
  },
  {
    id: 5,
    name: "Vino Tinto Malbec",
    category: "vino",
    price: 96000,
    image: "img/vino-tinto.webp",
  },
  {
    id: 6,
    name: "Whisky Jack Daniel's",
    category: "whisky",
    price: 120000,
    image: "img/whisky-jack-daniels.jpg",
  },
  {
    id: 7,
    name: "Ron viejo de Caldas",
    category: "ron",
    price: 60000,
    image: "img/ron-viejo-caldas.webp",
  },
  {
    id: 8,
    name: "Cerveza Corona Extra",
    category: "cerveza",
    price: 5000,
    image: "img/cerveza-corona.webp",
  },
]

// Configuración de la tienda
const storeConfig = {
  whatsappNumber: "573014579952",
  shippingCost: 10000,
}

// Carrito de compras - Variable global
let cart = []

// Clave única para localStorage
const CART_STORAGE_KEY = "distribuciones_safo_cart_v2"

// ===== FUNCIONES DE ALMACENAMIENTO MEJORADAS =====
function saveCartToStorage() {
  try {
    const cartData = {
      items: cart,
      timestamp: Date.now(),
      version: "2.0",
    }
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData))
    console.log("✅ Carrito guardado exitosamente:", cartData)

    // Disparar evento personalizado para sincronización
    window.dispatchEvent(
      new CustomEvent("cartUpdated", {
        detail: { cart: cart, action: "save" },
      }),
    )
  } catch (e) {
    console.error("❌ Error al guardar el carrito:", e)
  }
}

function loadCartFromStorage() {
  try {
    const savedData = localStorage.getItem(CART_STORAGE_KEY)
    console.log("📦 Cargando datos del localStorage:", savedData)

    if (savedData) {
      const cartData = JSON.parse(savedData)

      // Verificar que los datos sean válidos
      if (cartData && cartData.items && Array.isArray(cartData.items)) {
        // Validar que los productos del carrito aún existen
        cart = cartData.items.filter((item) => {
          const productExists = products.find((p) => p.id === item.id)
          if (!productExists) {
            console.warn(`⚠️ Producto con ID ${item.id} no encontrado, removiendo del carrito`)
          }
          return productExists && item.quantity > 0
        })
        console.log("✅ Carrito cargado exitosamente:", cart)
      } else {
        console.log("📝 Datos de carrito inválidos, inicializando carrito vacío")
        cart = []
      }
    } else {
      console.log("📝 No hay datos guardados, inicializando carrito vacío")
      cart = []
    }

    return cart
  } catch (e) {
    console.error("❌ Error al cargar el carrito:", e)
    cart = []
    return cart
  }
}

function cleanupStorage() {
  try {
    const testData = localStorage.getItem(CART_STORAGE_KEY)
    if (testData) {
      JSON.parse(testData)
    }
  } catch (e) {
    console.warn("🧹 Limpiando localStorage corrupto")
    localStorage.removeItem(CART_STORAGE_KEY)
    cart = []
  }
}

// ===== FUNCIONES DE UTILIDAD =====
const formatPrice = (price) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)

// ===== FUNCIONES DE VISUALIZACIÓN =====
function displayProducts(productsToShow = products) {
  const productsContainer = document.getElementById("products")
  if (!productsContainer) return

  productsContainer.innerHTML =
    productsToShow.length === 0
      ? '<p class="no-results">No se encontraron productos</p>'
      : productsToShow
          .map(
            (p) => `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}" class="product-image">
        <div class="product-info">
          <h3 class="product-title">${p.name}</h3>
          <p class="product-category">${p.category}</p>
          <p class="product-price">${formatPrice(p.price)}</p>
          <button class="add-to-cart" data-id="${p.id}">Añadir al Carrito</button>
        </div>
      </div>
    `,
          )
          .join("")
}

function displayFeaturedProducts() {
  const featuredProductsContainer = document.getElementById("featured-products")
  if (!featuredProductsContainer) return

  // Seleccionar 6 productos aleatorios para mostrar como destacados
  const shuffled = [...products].sort(() => 0.5 - Math.random())
  const featured = shuffled.slice(0, 6)

  featuredProductsContainer.innerHTML = featured
    .map(
      (p) => `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}" class="product-image">
        <div class="product-info">
          <h3 class="product-title">${p.name}</h3>
          <p class="product-category">${p.category}</p>
          <p class="product-price">${formatPrice(p.price)}</p>
          <button class="add-to-cart" data-id="${p.id}">Añadir al Carrito</button>
        </div>
      </div>
    `,
    )
    .join("")

  // Inicializar el carrusel con Slick (si está disponible)
  if (typeof jQuery !== "undefined" && typeof jQuery.fn.slick === "function") {
    jQuery("#featured-products").slick({
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    })
  }
}

function updateCartCount() {
  const cartCountElements = document.querySelectorAll("#cart-count")
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

  console.log(`🔄 Actualizando contador del carrito: ${totalItems} items`)

  cartCountElements.forEach((element) => {
    if (element) {
      element.textContent = totalItems

      // Agregar clase visual si hay items
      if (totalItems > 0) {
        element.classList.add("has-items")
        element.parentElement.classList.add("cart-has-items")
      } else {
        element.classList.remove("has-items")
        element.parentElement.classList.remove("cart-has-items")
      }
    }
  })

  // Actualizar título de la página con el contador
  const originalTitle = document.title.replace(/ $$\d+$$$/, "")
  document.title = totalItems > 0 ? `${originalTitle} (${totalItems})` : originalTitle
}

function showNotification(message, type = "success") {
  // Remover notificación existente si la hay
  const existingNotification = document.querySelector(".notification")
  if (existingNotification) {
    existingNotification.remove()
  }

  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.innerHTML = `
    <i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}"></i>
    <span>${message}</span>
  `
  document.body.appendChild(notification)

  setTimeout(() => notification.classList.add("show"), 10)
  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 300)
  }, 3000)
}

function displayCart() {
  const cartItemsContainer = document.getElementById("cart-items")
  const cartTotalElement = document.querySelector(".cart-total")

  if (!cartItemsContainer || !cartTotalElement) {
    console.warn("⚠️ Elementos del carrito no encontrados")
    return
  }

  let cartHTML = ""
  let total = 0

  // Mostrar u ocultar el botón de vaciar carrito según si hay productos
  const clearCartBtn = document.getElementById("clear-cart-btn")
  if (clearCartBtn) {
    clearCartBtn.style.display = cart.length === 0 ? "none" : "block"
  }

  if (cart.length === 0) {
    cartHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart empty-cart-icon"></i>
        <p>Tu carrito está vacío</p>
        <p class="empty-cart-message">Añade algunos productos para comenzar</p>
      </div>
    `
    cartTotalElement.innerHTML = `<p>Total: ${formatPrice(0)}</p>`
  } else {
    // Encabezados
    cartHTML = `
      <div class="cart-header">
        <div class="cart-header-item">Producto</div>
        <div class="cart-header-quantity">Cantidad</div>
        <div class="cart-header-price">Precio</div>
        <div class="cart-header-total">Total</div>
        <div class="cart-header-action"></div>
      </div>
    `

    // Items del carrito
    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity
      total += itemTotal
      cartHTML += `
        <div class="cart-item">
          <div class="cart-item-product">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
              <h4 class="cart-item-name">${item.name}</h4>
              <p class="cart-item-category">${item.category}</p>
              <p class="cart-item-price-mobile">${formatPrice(item.price)}</p>
            </div>
          </div>
          <div class="cart-item-quantity">
            <button class="quantity-btn decrease" data-action="decrease" data-id="${item.id}">-</button>
            <span class="quantity-value">${item.quantity}</span>
            <button class="quantity-btn increase" data-action="increase" data-id="${item.id}">+</button>
          </div>
          <div class="cart-item-price">${formatPrice(item.price)}</div>
          <div class="cart-item-subtotal">${formatPrice(itemTotal)}</div>
          <div class="cart-item-remove">
            <button class="remove-btn" data-action="remove" data-id="${item.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `
    })

    // Resumen del carrito
    const finalTotal = total + storeConfig.shippingCost
    cartHTML += `
      <div class="cart-summary">
        <div class="cart-summary-row">
          <span>Subtotal:</span>
          <span>${formatPrice(total)}</span>
        </div>
        <div class="cart-summary-row">
          <span>Envío:</span>
          <span>${formatPrice(storeConfig.shippingCost)}</span>
        </div>
        <div class="cart-summary-row cart-summary-total">
          <span>Total:</span>
          <span>${formatPrice(finalTotal)}</span>
        </div>
      </div>
    `

    // Opciones de pago
    cartTotalElement.innerHTML = `
      <div class="payment-options">
        <h3>Selecciona un método de pago</h3>
        <div class="payment-methods">
          <button id="paypal-btn" class="payment-btn paypal">
            <i class="fab fa-paypal"></i> PayPal
          </button>
          <button id="card-btn" class="payment-btn card">
            <i class="far fa-credit-card"></i> Tarjeta de Crédito
          </button>
          <button id="whatsapp-btn" class="payment-btn whatsapp">
            <i class="fab fa-whatsapp"></i> WhatsApp
          </button>
        </div>
      </div>
    `
  }

  cartItemsContainer.innerHTML = cartHTML
  console.log("🛒 Carrito actualizado en pantalla")
}

// ===== FUNCIONES DEL CARRITO =====
function addToCart(productId) {
  console.log(`➕ Intentando agregar producto ID: ${productId}`)

  const product = products.find((p) => p.id === productId)
  if (!product) {
    console.error("❌ Producto no encontrado:", productId)
    showNotification("Producto no encontrado", "error")
    return
  }

  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity += 1
    console.log("📈 Cantidad aumentada:", existingItem)
    showNotification(`${product.name} - Cantidad actualizada: ${existingItem.quantity}`)
  } else {
    const newItem = { ...product, quantity: 1 }
    cart.push(newItem)
    console.log("🆕 Producto agregado:", newItem)
    showNotification(`${product.name} añadido al carrito`)
  }

  // Actualizar inmediatamente
  updateCartCount()
  saveCartToStorage()

  console.log("🛒 Estado actual del carrito:", cart)
}

function handleCartAction(e) {
  const target = e.target.closest("[data-action]")
  if (!target) return

  const action = target.dataset.action
  const id = Number(target.dataset.id)
  const itemIndex = cart.findIndex((item) => item.id === id)

  if (itemIndex === -1) {
    console.warn(`⚠️ Item con ID ${id} no encontrado en el carrito`)
    return
  }

  const item = cart[itemIndex]
  console.log(`🔄 Ejecutando acción: ${action} para producto: ${item.name}`)

  if (action === "increase") {
    cart[itemIndex].quantity += 1
    showNotification(`${item.name} - Cantidad: ${cart[itemIndex].quantity}`)
  } else if (action === "decrease") {
    cart[itemIndex].quantity -= 1
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1)
      showNotification(`${item.name} removido del carrito`)
    } else {
      showNotification(`${item.name} - Cantidad: ${cart[itemIndex].quantity}`)
    }
  } else if (action === "remove") {
    cart.splice(itemIndex, 1)
    showNotification(`${item.name} removido del carrito`)
  }

  updateCartCount()
  displayCart()
  saveCartToStorage()
}

function clearCart() {
  if (cart.length === 0) {
    showNotification("El carrito ya está vacío", "info")
    return
  }

  if (confirm("¿Estás seguro de que deseas vaciar el carrito?")) {
    cart = []
    updateCartCount()
    displayCart()
    saveCartToStorage()
    showNotification("Carrito vaciado correctamente")
  }
}

// ===== FUNCIONES DE PAGO =====
function generateWhatsAppMessage() {
  let message = "🛒 *NUEVO PEDIDO - DISTRIBUCIONES SAFO* 🛒\n\n*Productos:*\n"
  let subtotal = 0

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity
    subtotal += itemTotal
    message += `▪️ ${item.name} (${item.quantity}x) - ${formatPrice(item.price)} c/u = ${formatPrice(itemTotal)}\n`
  })

  const total = subtotal + storeConfig.shippingCost
  message +=
    "\n*Resumen:*\n" +
    `📋 Subtotal: ${formatPrice(subtotal)}\n` +
    `🚚 Envío: ${formatPrice(storeConfig.shippingCost)}\n` +
    `💰 *TOTAL: ${formatPrice(total)}*\n\n` +
    "Por favor, confirme mi pedido. Gracias."

  return encodeURIComponent(message)
}

function processPayment(method) {
  if (cart.length === 0) {
    showNotification("No hay productos en el carrito", "error")
    return
  }

  console.log(`💳 Procesando pago con método: ${method}`)

  switch (method) {
    case "paypal":
      showNotification("Redirigiendo a PayPal...")
      setTimeout(() => {
        alert("Esta es una simulación de pago con PayPal. En una implementación real, se redigiría a la API de PayPal.")
        cart = []
        updateCartCount()
        saveCartToStorage()
        closeCartModal()
        showNotification("¡Compra simulada con éxito!")
      }, 1500)
      break

    case "card":
      showCardForm()
      break

    case "whatsapp":
      const whatsappURL = `https://wa.me/${storeConfig.whatsappNumber}?text=${generateWhatsAppMessage()}`
      window.open(whatsappURL, "_blank")
      closeCartModal()
      showNotification("Pedido enviado por WhatsApp")
      break
  }
}

function showCardForm() {
  const cartModal = document.getElementById("cart-modal")
  if (!cartModal) return

  const modalContent = cartModal.querySelector(".modal-content")
  if (!modalContent) return

  // Guardar el contenido actual para poder volver
  const originalContent = modalContent.innerHTML

  // Crear formulario de tarjeta
  modalContent.innerHTML = `
    <span class="close">&times;</span>
    <h2>Pago con Tarjeta de Crédito</h2>
    <form id="card-payment-form" class="payment-form">
      <div class="form-group">
        <label for="card-number">Número de Tarjeta</label>
        <input type="text" id="card-number" placeholder="1234 5678 9012 3456" required>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="card-expiry">Fecha de Expiración</label>
          <input type="text" id="card-expiry" placeholder="MM/AA" required>
        </div>
        <div class="form-group">
          <label for="card-cvc">CVC</label>
          <input type="text" id="card-cvc" placeholder="123" required>
        </div>
      </div>
      <div class="form-group">
        <label for="card-name">Nombre en la Tarjeta</label>
        <input type="text" id="card-name" placeholder="Juan Pérez" required>
      </div>
      <div class="form-actions">
        <button type="button" id="back-to-cart" class="secondary-btn">Volver</button>
        <button type="submit" class="primary-btn">Pagar</button>
      </div>
    </form>
  `

  // Event listener para volver al carrito
  const backBtn = document.getElementById("back-to-cart")
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      modalContent.innerHTML = originalContent
      displayCart()
    })
  }

  // Event listener para el formulario de pago
  const cardForm = document.getElementById("card-payment-form")
  if (cardForm) {
    cardForm.addEventListener("submit", (e) => {
      e.preventDefault()
      showNotification("Procesando pago...")
      setTimeout(() => {
        alert("¡Pago procesado con éxito! En una implementación real, se conectaría con un procesador de pagos.")
        cart = []
        updateCartCount()
        saveCartToStorage()
        closeCartModal()
        showNotification("¡Compra realizada con éxito!")
      }, 2000)
    })
  }
}

// ===== FUNCIONES DE MODAL =====
function openCartModal() {
  console.log("🔓 Abriendo modal del carrito")
  displayCart()
  const cartModal = document.getElementById("cart-modal")
  if (cartModal) {
    cartModal.style.display = "block"
    document.body.classList.add("modal-open")
  }
}

function closeCartModal() {
  console.log("🔒 Cerrando modal del carrito")
  const cartModal = document.getElementById("cart-modal")
  if (cartModal) {
    cartModal.style.display = "none"
    document.body.classList.remove("modal-open")
  }
}

// ===== FUNCIONES DE ORDENAMIENTO Y FILTRADO =====
function sortProducts(productsToSort, sortBy) {
  const sorted = [...productsToSort]

  switch (sortBy) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price)
      break
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price)
      break
    case "name-asc":
      sorted.sort((a, b) => a.name.localeCompare(b.name))
      break
    case "name-desc":
      sorted.sort((a, b) => b.name.localeCompare(a.name))
      break
    default:
      // Por defecto no hacemos nada, mantiene el orden original
      break
  }

  return sorted
}

// ===== SINCRONIZACIÓN ENTRE PESTAÑAS =====
function syncCartAcrossTabs() {
  // Escuchar cambios en localStorage de otras pestañas
  window.addEventListener("storage", (e) => {
    if (e.key === CART_STORAGE_KEY) {
      console.log("🔄 Cambio detectado en otra pestaña, sincronizando...")
      loadCartFromStorage()
      updateCartCount()

      // Si el modal está abierto, actualizar también
      const cartModal = document.getElementById("cart-modal")
      if (cartModal && cartModal.style.display === "block") {
        displayCart()
      }
    }
  })

  // Escuchar eventos personalizados de actualización del carrito
  window.addEventListener("cartUpdated", (e) => {
    console.log("🔄 Evento de carrito actualizado:", e.detail)
    updateCartCount()
  })

  // Sincronizar cuando la página obtiene el foco
  window.addEventListener("focus", () => {
    console.log("👁️ Página enfocada, sincronizando carrito...")
    const oldCartLength = cart.length
    loadCartFromStorage()
    updateCartCount()

    // Si cambió el carrito, mostrar notificación
    if (cart.length !== oldCartLength) {
      showNotification("Carrito sincronizado", "info")
    }
  })

  // Sincronizar cuando la página se vuelve visible
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      console.log("👁️ Página visible, sincronizando carrito...")
      loadCartFromStorage()
      updateCartCount()
    }
  })
}

// ===== CONFIGURACIÓN DE EVENT LISTENERS =====
function setupEventListeners() {
  console.log("🎯 Configurando event listeners...")

  // Event listeners usando delegación de eventos
  document.addEventListener("click", (e) => {
    // Añadir al carrito
    if (e.target.classList.contains("add-to-cart")) {
      e.preventDefault()
      const id = Number(e.target.dataset.id)
      console.log("🎯 Botón 'Añadir al carrito' clickeado, ID:", id)
      addToCart(id)
    }

    // Acciones del carrito (aumentar, disminuir, remover)
    if (e.target.closest("[data-action]")) {
      handleCartAction(e)
    }

    // Abrir carrito
    if (e.target.closest("#cart-btn")) {
      e.preventDefault()
      openCartModal()
    }

    // Cerrar carrito
    if (e.target.classList.contains("close")) {
      closeCartModal()
    }

    // Vaciar carrito
    if (e.target.id === "clear-cart-btn") {
      clearCart()
    }

    // Métodos de pago
    if (e.target.id === "paypal-btn" || e.target.closest("#paypal-btn")) {
      processPayment("paypal")
    }

    if (e.target.id === "card-btn" || e.target.closest("#card-btn")) {
      processPayment("card")
    }

    if (e.target.id === "whatsapp-btn" || e.target.closest("#whatsapp-btn")) {
      processPayment("whatsapp")
    }
  })

  // Cerrar modal al hacer clic fuera
  const cartModalElement = document.getElementById("cart-modal")
  if (cartModalElement) {
    cartModalElement.addEventListener("click", (e) => {
      if (e.target === cartModalElement) {
        closeCartModal()
      }
    })
  }

  // Búsqueda en tiempo real
  const searchInput = document.getElementById("search")
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase()
      const filteredProducts = products.filter(
        (p) => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query),
      )
      displayProducts(filteredProducts)
    })
  }

  // Filtrar por categoría
  const categoryLinks = document.querySelectorAll(".category-filter a")
  categoryLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      document.querySelectorAll(".category-filter a").forEach((l) => l.classList.remove("active"))
      link.classList.add("active")
      const category = link.dataset.category
      const filteredProducts = category === "todos" ? products : products.filter((p) => p.category === category)
      displayProducts(filteredProducts)
    })
  })

  // Ordenar productos
  const sortSelect = document.getElementById("sort-select")
  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      const activeCategory = document.querySelector(".category-filter a.active")
      const category = activeCategory ? activeCategory.dataset.category : "todos"
      const productsToShow = category === "todos" ? products : products.filter((p) => p.category === category)
      displayProducts(sortProducts(productsToShow, sortSelect.value))
    })
  }

  console.log("✅ Event listeners configurados correctamente")
}

// ===== INICIALIZACIÓN DE LA APLICACIÓN =====
function initializeApp() {
  console.log("🚀 ===== INICIALIZANDO DISTRIBUCIONES SAFO =====")
  console.log("📍 Página actual:", window.location.pathname)
  console.log("⏰ Timestamp:", new Date().toLocaleString())

  // Limpiar localStorage corrupto
  cleanupStorage()

  // Cargar carrito desde localStorage
  loadCartFromStorage()

  // Actualizar contador del carrito inmediatamente
  updateCartCount()

  // Inicializar el modal del carrito
  const cartModal = document.getElementById("cart-modal")
  if (cartModal) {
    cartModal.style.display = "none"
  }

  // Mostrar productos destacados en la página de inicio
  displayFeaturedProducts()

  // Mostrar productos en la página de productos
  displayProducts()

  console.log("✅ ===== APLICACIÓN INICIALIZADA CORRECTAMENTE =====")
  console.log("🛒 Carrito actual:", cart)
  console.log(
    "📊 Total items:",
    cart.reduce((total, item) => total + item.quantity, 0),
  )
}

// ===== INICIALIZACIÓN CUANDO EL DOM ESTÉ LISTO =====
document.addEventListener("DOMContentLoaded", () => {
  console.log("📄 DOM completamente cargado")
  initializeApp()
  setupEventListeners()
  syncCartAcrossTabs()
})

// También inicializar cuando la página se carga completamente
window.addEventListener("load", () => {
  console.log("🌐 Página completamente cargada")
  // Forzar actualización del contador después de un breve delay
  setTimeout(() => {
    loadCartFromStorage()
    updateCartCount()
  }, 100)
})

// Guardar carrito antes de cerrar la página
window.addEventListener("beforeunload", () => {
  console.log("👋 Guardando carrito antes de cerrar...")
  saveCartToStorage()
})

// Manejar errores globales
window.addEventListener("error", (e) => {
  console.error("❌ Error global capturado:", e.error)
})

// ===== ESTILOS CSS MEJORADOS =====
const additionalStyles = `
  .cart-header-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0;
    padding: 1.5rem;
    background-color: var(--primary-color, #8B0000);
    color: white;
    border-radius: 8px 8px 0 0;
  }

  .cart-header-actions h2 {
    margin: 0;
    padding: 0;
    background: none;
    color: white;
    border-radius: 0;
    font-size: 1.5rem;
  }

  .clear-cart-btn {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    display: none;
  }

  .clear-cart-btn:hover {
    background-color: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-1px);
  }

  #cart-count.has-items {
    background-color: #ff4444;
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 0.8rem;
    font-weight: bold;
    min-width: 18px;
    text-align: center;
    animation: pulse 0.5s ease-in-out;
  }

  .cart-has-items {
    animation: bounce 0.3s ease-in-out;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }

  @keyframes bounce {
    0%, 20%, 60%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    80% { transform: translateY(-5px); }
  }

  .notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: var(--primary-color, #8B0000);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    transform: translateY(100px);
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 8px;
    max-width: 300px;
  }
  
  .notification.show {
    transform: translateY(0);
    opacity: 1;
  }

  .notification.success {
    background-color: #28a745;
  }

  .notification.error {
    background-color: #dc3545;
  }

  .notification.info {
    background-color: #17a2b8;
  }
  
  .no-results {
    text-align: center;
    padding: 2rem;
    font-size: 1.2rem;
    color: #666;
  }

  .modal-open { 
    overflow: hidden; 
  }

  .modal-content {
    background-color: var(--card-bg, white);
    margin: 5% auto;
    padding: 0;
    border-radius: 8px;
    width: 90%;
    max-width: 800px;
    box-shadow: var(--shadow, 0 4px 6px rgba(0,0,0,0.1));
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .close {
    position: absolute;
    right: 1.5rem;
    top: 1.5rem;
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 10;
  }

  .close:hover { 
    transform: scale(1.2); 
  }

  #cart-items {
    padding: 1rem;
    overflow-y: auto;
    max-height: calc(90vh - 180px);
  }

  .empty-cart {
    text-align: center;
    padding: 3rem 2rem;
  }

  .empty-cart-icon {
    font-size: 4rem;
    color: #ccc;
    margin-bottom: 1rem;
  }

  .empty-cart-message {
    color: #666;
    margin-top: 0.5rem;
    font-size: 1.1rem;
  }

  .cart-header {
    display: grid;
    grid-template-columns: 3fr 1fr 1fr 1fr 0.5fr;
    padding: 0.75rem 0;
    border-bottom: 2px solid #eee;
    font-weight: bold;
    color: #555;
  }

  .cart-item {
    display: grid;
    grid-template-columns: 3fr 1fr 1fr 1fr 0.5fr;
    padding: 1rem 0;
    border-bottom: 1px solid #eee;
    align-items: center;
  }

  .cart-item-product {
    display: flex;
    align-items: center;
  }

  .cart-item-image {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
    margin-right: 1rem;
  }

  .cart-item-name {
    margin: 0 0 0.25rem 0;
    font-size: 1rem;
  }

  .cart-item-category {
    margin: 0;
    color: #666;
    font-size: 0.85rem;
    text-transform: capitalize;
  }

  .cart-item-price-mobile { 
    display: none; 
  }

  .cart-item-quantity {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .quantity-btn {
    background-color: #f0f0f0;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    transition: all 0.2s ease;
    font-size: 1.2rem;
  }

  .quantity-btn:hover {
    background-color: var(--primary-color, #8B0000);
    color: white;
    transform: scale(1.1);
  }

  .quantity-value {
    margin: 0 0.75rem;
    min-width: 2rem;
    text-align: center;
    font-weight: 600;
  }

  .cart-item-price, .cart-item-subtotal {
    text-align: center;
    font-weight: 500;
  }

  .cart-item-remove { 
    text-align: center; 
  }

  .remove-btn {
    background-color: transparent;
    border: none;
    color: #ff4d4d;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0.5rem;
    border-radius: 4px;
  }

  .remove-btn:hover {
    color: #ff0000;
    background-color: rgba(255, 0, 0, 0.1);
    transform: scale(1.2);
  }

  .cart-summary {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 2px solid #eee;
  }

  .cart-summary-row {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    font-size: 1.1rem;
  }

  .cart-summary-total {
    font-weight: bold;
    font-size: 1.3rem;
    padding-top: 0.5rem;
    margin-top: 0.5rem;
    border-top: 1px solid #eee;
    color: var(--primary-color, #8B0000);
  }

  .cart-total {
    padding: 1.5rem;
    background-color: #f9f9f9;
    border-top: 1px solid #eee;
  }

  .payment-options h3 {
    margin-bottom: 1rem;
    text-align: center;
    color: #333;
  }

  .payment-methods {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .payment-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
  }

  .payment-btn.paypal {
    background-color: #0070ba;
    color: white;
  }

  .payment-btn.card {
    background-color: #28a745;
    color: white;
  }

  .payment-btn.whatsapp {
    background-color: #25d366;
    color: white;
  }

  .payment-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }

  .payment-form {
    padding: 2rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #333;
  }

  .form-group input, .form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
  }

  .form-group input:focus, .form-group textarea:focus {
    outline: none;
    border-color: var(--primary-color, #8B0000);
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
  }

  .primary-btn {
    background-color: var(--primary-color, #8B0000);
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .primary-btn:hover {
    background-color: #660000;
    transform: translateY(-1px);
  }

  .secondary-btn {
    background-color: #6c757d;
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .secondary-btn:hover {
    background-color: #545b62;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    .cart-header { 
      display: none; 
    }

    .cart-item {
      grid-template-columns: 1fr;
      gap: 0.75rem;
      padding: 1rem;
      border: 1px solid #eee;
      border-radius: 8px;
      margin-bottom: 1rem;
      background-color: #fafafa;
    }

    .cart-item-product {
      flex-direction: column;
      text-align: center;
    }

    .cart-item-image {
      margin-right: 0;
      margin-bottom: 0.5rem;
      width: 80px;
      height: 80px;
    }

    .cart-item-price {
      display: none;
    }

    .cart-item-price-mobile {
      display: block;
      margin: 0.25rem 0 0;
      font-weight: 600;
      color: var(--primary-color, #8B0000);
    }

    .cart-item-quantity, .cart-item-subtotal {
      justify-content: space-between;
      padding: 0.5rem 0;
      border-top: 1px solid #eee;
      display: flex;
      align-items: center;
    }

    .cart-item-quantity::before {
      content: 'Cantidad:';
      font-weight: 600;
      color: #555;
    }

    .cart-item-subtotal::before {
      content: 'Subtotal:';
      font-weight: 600;
      color: #555;
    }

    .cart-item-remove {
      text-align: right;
      padding-top: 0.5rem;
    }

    .modal-content {
      width: 95%;
      margin: 2% auto;
      max-height: 95vh;
    }

    .payment-methods {
      flex-direction: column;
    }

    .form-row {
      grid-template-columns: 1fr;
    }

    .form-actions {
      flex-direction: column;
    }

    .notification {
      bottom: 10px;
      right: 10px;
      left: 10px;
      max-width: none;
    }

    .cart-header-actions {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .clear-cart-btn {
      width: 100%;
    }
  }
`

// Aplicar estilos mejorados
if (!document.getElementById("ecommerce-additional-styles")) {
  const styleSheet = document.createElement("style")
  styleSheet.id = "ecommerce-additional-styles"
  styleSheet.textContent = additionalStyles
  document.head.appendChild(styleSheet)
}

// Exportar funciones principales para debugging
window.DistribucionesSAFO = {
  cart,
  addToCart,
  clearCart,
  loadCartFromStorage,
  saveCartToStorage,
  updateCartCount,
  displayCart,
  openCartModal,
  closeCartModal,
}

console.log("🎉 Distribuciones SAFO - Sistema de carrito cargado correctamente")
