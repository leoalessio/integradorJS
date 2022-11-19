// Contenedor de productos
const products = document.querySelector(".products-container");
const productsCart = document.querySelector(".cart-container");
const total = document.querySelector(".total");
const categories = document.querySelector(".categories");
const categoriesList = document.querySelectorAll(".category");
const btnLoad = document.querySelector(".btn-load");
const cartBtn = document.querySelector(".cart-label");
const barsBtn = document.querySelector(".menu-label");
const cartMenu = document.querySelector(".cart");
const barsMenu = document.querySelector(".navbar-list");
const openModal = document.querySelector(".btn-login");
const modal = document.querySelector(".modal");
const closeModal = document.querySelector(".modal__close");
const email = document.getElementById("email");
const password = document.getElementById("password");
const form = document.getElementById("form");
const parrafo = document.getElementById("warnings");

//abrir y cerrar el botón de login
const openLogin = (e) => {
  if (modal.classList.contains("modal__show")) {
    modal.classList.remove("modal__show");
    return;
  }
  modal.classList.add("modal__show");
};

const closeLogin = (e) => {
  e.preventDefault();
  modal.classList.remove("modal__show");
};


//Botones carrito
const buyBtn = document.querySelector(".btn-buy");
const deleteBtn = document.querySelector(".btn-delete");

//selector de modal
const successModal = document.querySelector(".add-modal");

// Setear el array para el carro
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Funcion para guardar en el localStorage
const saveLocalStorage = (cartList) => {
  localStorage.setItem("cart", JSON.stringify(cartList));
};

// Funcion para retornar el html a renderizar
const renderProduct = (product) => {
  const { id, title, price, description, category, image, rating } = product;
  return `
    <div class="product">
    <img src=${image} alt=${title} />
    <div class="product-info">
        <!-- top -->
        <div class="product-top">
            <h3>${title}</h3>
        </div>

        <!-- mid -->
        <div class="product-mid">
            <div class="product-user">
                <p>Puntaje ${rating.rate}</p>
            </div>
            <span>Precio USD${price} </span>
        </div>

        <!-- bot -->
        <div class="product-bot">
            <div class="product-offer">
                <button class="btn-add"
                data-id='${id}'
                data-title='${title}'
                data-price='${price}'
                data-image='${image}'>Agregar al carrito</button>
            </div>
        </div>
    </div>
</div>`;
};

// Funcion para renderizar los productos divididos.
// Recibe un index, si no recibe nada por defecto va a ser 0
// Si el index es 0  renderiza el primer array del data
const renderDividedProducts = (index = 0) => {
  products.innerHTML += productsController.dividedProducts[index]
    .map(renderProduct)
    .join("");
};

const renderFilteredProducts = (category) => {
  const productList = productsData.filter(
    (product) => product.category === category
  );

  products.innerHTML = productList.map(renderProduct);
};

// Funcion para renderizar los productos
// Recibe un index, si no le pasamos nada por default va a ser 0 y una categoria, si no le pasamos nada por default va a ser undefined
// Si no hay categoria renderizame los productos del array dividido.
// Si hay categoria ejecuta renderFilteredProducts
const renderProducts = (index = 0, category = undefined) => {
  if (!category) {
    renderDividedProducts(index);
    return;
  }
  renderFilteredProducts(category);
};

// Logica de Filtros
const changeShowMoreBtnState = (category) => {
  if (!category) {
    btnLoad.classList.remove("hidden");
    return;
  }
  btnLoad.classList.add("hidden");
};

const changeBtnActiveState = (selectedCategory) => {
  const categories = [...categoriesList];
  categories.forEach((categoryBtn) => {
    if (categoryBtn.dataset.category !== selectedCategory) {
      categoryBtn.classList.remove("active");
      return;
    }
    categoryBtn.classList.add("active");
  });
};

const changeFilterState = (e) => {
  const selectedCategory = e.target.dataset.category;
  changeBtnActiveState(selectedCategory);
  changeShowMoreBtnState(selectedCategory);
};

// Funcion para aplicar el filtro por categorias
const applyFilter = (e) => {
  if (!e.target.classList.contains("category")) return;
  changeFilterState(e);
  if (!e.target.dataset.category) {
    products.innerHTML = "";
    renderProducts();
  } else {
    renderProducts(0, e.target.dataset.category);
    productsController.nextProductsIndex = 1;
  }
};

// Funcion que checkee si estamos en el ultimo array del array de productos divididos
const isLastIndexOf = () =>
  productsController.nextProductsIndex === productsController.productsLimit;

// Funcion para cargar mas productos
const showMoreProducts = () => {
  renderProducts(productsController.nextProductsIndex);
  productsController.nextProductsIndex++;
  if (isLastIndexOf()) {
    btnLoad.classList.add("hidden");
  }
};

// Menu Interface
// Logica para abrir y cerrar el carrito/menu
const toggleMenu = () => {
  barsMenu.classList.toggle("open-menu");
  if (cartMenu.classList.contains("open-cart")) {
    cartMenu.classList.remove("open-cart");
    return;
  }
};

const toggleCart = () => {
  cartMenu.classList.toggle("open-cart");
  if (barsMenu.classList.contains("open-menu")) {
    barsMenu.classList.remove("open-menu");
    return;
  }
};

// Funcion para cerrar menu y carrito si scrolleamos
const closeOnScroll = () => {
  if (
    !barsMenu.classList.contains("open-menu") &&
    !cartMenu.classList.contains("open-cart")
  )
    return;

  barsMenu.classList.remove("open-menu");
  cartMenu.classList.remove("open-cart");
};

const closeOnClick = (e) => {
  if (!e.taget.classList.contains("navbar-link")) return;
  barsMenu.classList.remove("open-menu");
};

/* ------------Logica del carrito------------- */
const renderCartProduct = (cartProduct) => {
  const { id, title, price, image, quantity } = cartProduct;
  return `
  <div class="cart-item">
    <img src=${image} alt="img del carrito" />
    <div class="item-info">
      <h3 class="item-title">${title}</h3>
      <span class="item-price">${price} USD</span>
    </div>
    <div class="item-handler">
      <span class="quantity-handler down" data-id=${id}>-</span>
      <span class="item-quantity">${quantity}</span>
      <span class="quantity-handler up" data-id=${id}>+</span>
    </div>
  </div>
  `;
};

const renderCart = () => {
  if (!cart.length) {
    productsCart.innerHTML = `<p class="empty-msg">No hay productos en el carrito. Apurate y comprá algo.</p>`;
    return;
  }
  productsCart.innerHTML = cart.map(renderCartProduct).join("");
  productsCart.innerHTML = cart.map(renderCartProduct).join("");
};

const getCartTotal = () => {
  return cart.reduce((acc, cur) => acc + Number(cur.price) * cur.quantity, 0);
};

const showTotal = () => {
  total.innerHTML = `${getCartTotal().toFixed(2)} USD`;
};

const disableBtn = (btn) => {
  if (!cart.length) {
    btn.classList.add("disabled");
  } else {
    btn.classList.remove("disabled");
  }
};

const createProductData = (id, title, price, image) => {
  return { id, title, price, image };
};

const isExistingCartProduct = (product) => {
  return cart.find((item) => item.id === product.id);
};

//Recorremos el carrito y cuando encuentra el producto el cual agregamos, sumamos una unidad.
const addUnitToProduct = (product) => {
  cart = cart.map((cartProduct) => {
    return cartProduct.id === product.id
      ? { ...cartProduct, quantity: cartProduct.quantity + 1 }
      : cartProduct;
  });
};

const createCartProduct = (product) => {
  cart = [...cart, { ...product, quantity: 1 }];
};

const showSuccessModal = (msg) => {
  successModal.classList.add("active-modal");
  successModal.textContent = msg;
  setTimeout(() => {
    successModal.classList.remove("active-modal");
  }, 1500);
};

const checkCartState = () => {
  saveLocalStorage(cart);
  renderCart(cart);
  showTotal(cart);
  disableBtn(buyBtn);
  disableBtn(deleteBtn);
};

const addProduct = (e) => {
  if (!e.target.classList.contains("btn-add")) return;
  const { id, title, price, image } = e.target.dataset;
  const product = createProductData(id, title, price, image);

  if (isExistingCartProduct(product)) {
    addUnitToProduct();
    showSuccessModal("Se agregó una unidad del producto al carrito");
  } else {
    createCartProduct(product);
    showSuccessModal("El producto se ha agregado al carrito");
  }
  checkCartState();
};

const removeProductFromCart = (existingProduct) => {
  cart = cart.filter((product) => product.id !== existingProduct.id);
  checkCartState();
};

const substractProductUnit = (existingProduct) => {
  cart = cart.map((product) => {
    return product.id === existingProduct.id
      ? { ...product, quantity: Number(product.quantity) - 1 }
      : product;
  });
};

const handleMinusBtnEvent = (id) => {
  const existingCartProduct = cart.find((item) => item.id === id);

  if (existingCartProduct.quantity === 1) {
    if (window.confirm("Desea eliminar el producto del carrito")) {
      // borrar producto
      removeProductFromCart(existingCartProduct);
    }
    return;
  }
  // Restar uno al producto existente
  substractProductUnit(existingCartProduct);
};

const handlePlusBtnEvent = (id) => {
  const existingCartProduct = cart.find((item) => item.id === id);
  addUnitToProduct(existingCartProduct);
};

const handleQuantity = (e) => {
  if (e.target.classList.contains("down")) {
    handleMinusBtnEvent(e.target.dataset.id);
  } else if (e.target.classList.contains("up")) {
    handlePlusBtnEvent(e.target.dataset.id);
  }
  checkCartState();
};

const resetCartItems = () => {
  cart = [];
  checkCartState();
};

const completeCartAction = (confirmMsg, successMsg) => {
  if (!cart.length) return;
  if (window.confirm(confirmMsg)) {
    resetCartItems();
    alert(successMsg);
  }
};

const completeBuy = () => {
  completeCartAction("¿Desea completar su compra?", "¡Gracias por su compra!");
};

const deleteCart = () => {
  completeCartAction(
    "¿Desea vaciar el carrito?",
    "No hay productos en el carrito"
  );
};

// Funcion inicializadora
const init = () => {
  renderProducts();
  categories.addEventListener("click", applyFilter);
  btnLoad.addEventListener("click", showMoreProducts);
  cartBtn.addEventListener("click", toggleCart);
  barsBtn.addEventListener("click", toggleMenu);
  window.addEventListener("scroll", closeOnScroll);
  barsMenu.addEventListener("click", closeOnClick);
  document.addEventListener("DOMContentLoaded", renderCart);
  document.addEventListener("DOMContentLoaded", showTotal);
  products.addEventListener("click", addProduct);
  productsCart.addEventListener("click", handleQuantity);
  disableBtn(deleteBtn);
  disableBtn(buyBtn);
  buyBtn.addEventListener("click", completeBuy);
  deleteBtn.addEventListener("click", deleteCart);
  openModal.addEventListener("click", openLogin);
  closeModal.addEventListener("click", closeLogin);
};

init();
