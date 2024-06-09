document.addEventListener("DOMContentLoaded", () => {
    const products = [
        {
            id: 1,
            name: "Remera",
            price: 10,
            image: "https://http2.mlstatic.com/D_NQ_NP_949208-MLA75681666448_042024-O.webp",
        },
        {
            id: 2,
            name: "Pantalón",
            price: 20,
            image: "https://gt.pralin.shop/cdn/shop/products/PantalonNino10069-33051006906616-1.jpg?v=1645551026",
        },
        {
            id: 3,
            name: "Zapatillas",
            price: 30,
            image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_706,h_706/global/394800/01/sv01/fnd/ARG/fmt/png",
        },
    ];

    let users = [];
    let currentUser = null;

    // Funciones de almacenamiento
    const saveCartToStorage = (cart) => {
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    const getCartFromStorage = () => {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    };

    let cart = getCartFromStorage(); // Obtener el carrito desde localStorage

    const productList = document.getElementById("product-list");
    const cartCount = document.getElementById("cart-count");
    const loginModal = document.getElementById("login-modal");
    const cartModal = document.getElementById("cart-modal");
    const loginForm = document.getElementById("login-form");
    const loginError = document.getElementById("login-error");
    const cartItems = document.getElementById("cart-items");
    const cartMessage = document.getElementById("cart-message");
    const thankYouMessage = document.getElementById("thank-you-message");

    // Fetch users desde URL externa 
    const fetchUsers = () => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => response.json())
            .then(data => {
                users = data.map(user => ({
                    username: user.username,
                    password: 'password', // Placeholder password, real applications should handle this securely
                }));
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    };

    // Fetch users cuando se carga la página 
    fetchUsers();

    // Función para renderizar productos
    const renderProducts = () => {
        productList.innerHTML = "";
        products.forEach((product) => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("col-md-4");
            productDiv.innerHTML = `
          <div class="card mb-4 shadow-sm">
            <img src="${product.image}" class="card-img-top" alt="${product.name}">
            <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">Precio: $${product.price}</p>
              <button class="btn btn-primary" data-id="${product.id}">Agregar al carrito</button>
            </div>
          </div>
        `;
            productList.appendChild(productDiv);
        });
    };

    // Función para actualizar el contador del carrito
    const updateCartCount = () => {
        cartCount.textContent = cart.length;
    };

    // Función para renderizar el carrito
    const renderCart = () => {
        cartItems.innerHTML = "";
        cart.forEach((item, index) => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add(
                "list-group-item",
                "d-flex",
                "justify-content-between",
                "align-items-center"
            );
            itemDiv.innerHTML = `
          ${item.name} - $${item.price}
          <button class="btn btn-danger btn-sm" data-index="${index}">Eliminar</button>
        `;
            cartItems.appendChild(itemDiv);
        });
        if (cart.length === 0) {
            cartMessage.textContent =
                "El carrito está vacío. ¡Te esperamos nuevamente!";
        } else {
            cartMessage.textContent = "";
        }
        saveCartToStorage(cart); // Guardar el carrito actualizado en localStorage
    };

    // Evento para mostrar el modal de inicio de sesión
    document.getElementById("login-btn").addEventListener("click", () => {
        $("#login-modal").modal("show");
    });

    // Evento para mostrar el carrito
    document.getElementById("cart-btn").addEventListener("click", () => {
        if (currentUser) {
            renderCart();
            $("#cart-modal").modal("show");
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Debe iniciar sesión para ver el carrito',
            });
            $("#login-modal").modal("show");
        }
    });

    // Evento para manejar el inicio de sesión
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const user = users.find(
            (user) => user.username === username && user.password === password
        );

        if (user) {
            currentUser = user;
            $("#login-modal").modal("hide");
            loginError.textContent = "";
            Swal.fire({
                icon: 'success',
                title: 'Inicio de sesión exitoso',
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Usuario o contraseña incorrectos',
            });
        }
    });

    // Evento para agregar un producto al carrito
    productList.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") {
            const productId = parseInt(e.target.getAttribute("data-id"));
            const product = products.find((product) => product.id === productId);
            cart.push(product);
            updateCartCount();
            renderCart();
            Swal.fire({
                icon: 'success',
                title: 'Producto agregado',
                text: `${product.name} ha sido agregado al carrito`,
            });
        }
    });

    // Evento para eliminar un producto del carrito
    cartItems.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") {
            const itemIndex = parseInt(e.target.getAttribute("data-index"));
            cart.splice(itemIndex, 1);
            updateCartCount();
            renderCart();
            Swal.fire({
                icon: 'success',
                title: 'Producto eliminado',
                text: 'El producto ha sido eliminado del carrito',
            });
        }
    });

    // Evento para realizar el checkout
    document.getElementById("checkout-btn").addEventListener("click", () => {
        if (cart.length > 0) {
            cart = [];
            updateCartCount();
            renderCart();
            $("#cart-modal").modal("hide");
            Swal.fire({
                icon: 'success',
                title: 'Gracias por su compra',
                text: 'Su pedido ha sido realizado con éxito',
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No hay productos en el carrito',
            });
        }
    });

    // Inicializar la página
    renderProducts();
    updateCartCount();
});
