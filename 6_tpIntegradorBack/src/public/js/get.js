const contenedorProductos = document.getElementById("contenedor-productos");
const getProductForm = document.getElementById("getProduct-form");
const urlBase = "http://localhost:3000/api/productos";

// Optimizacion 1: Mostramos el mensaje de error visualmente
function mostrarError(message) {
    contenedorProductos.innerHTML = `
        <p class="mensaje mensaje-error">${message}</p>
    `;
}


getProductForm.addEventListener("submit", async event => {
    event.preventDefault(); // Evitamos el envio por defecto de los formularios html

    console.log(event.target); // Apunto al elemento que activo el evento (hago referencia al propio formulario) <form id="getProduct-form">...</form>

    /*
    // Convertimos los datos de nuestro formulario (event.target) en un objeto FormData
    const formData = new FormData(event.target);
    console.log(formData); // FormData { id → "41" }

    // Convertimos este objeto FormData en un objeto normal JavaScript
    // Pasamos de un objeto nativo FormData { id → "41" } a un Object { id: "41" }
    const data = Object.fromEntries(formData.entries());
    console.log(data); // Object { id: "41" }

    const idProd = data.id;
    console.log(idProd); // 41
    */

    // Optimizacion 2: Si hay un solo valor, podemos saltarnos el FormData + Object.fromEntries
    const idProd = event.target.idProd.value.trim();

    // Optimizacion 2: Tambien filtramos en el cliente en caso de que no haya un id valido
    if (!idProd) {
        mostrarError("Ingresá un ID valido");
        return;
    }


    try {
        // Optimizacion 3: Evitamos hardcodear la URL guardandola previamente en una variable
        // Hacemos el fetch a /api/products pasandole el valor del id
        const response = await fetch(`${urlBase}/${idProd}`);

        // Transformamos la informacion JSON del producto en un objeto JS
        const data = await response.json();

        // Optimizacion 4: Evaluamos si el servidor no respondio un ok
        if (!response.ok) {
            mostrarError(data.message);
            return;
        }

        console.log(data.payload[0]); // Aca extraigo directamente el objeto (devuelve un solo objeto en un array de objetos)

        /*  Que trae payload?
        {
            "payload": [
                {
                "id": 41,
                "name": "Fernetazo Chabona",
                "image": "https://pointlaventanita.com/wp-content/uploads/2024/05/chabona.webp",
                "category": "drink",
                "price": "2300.00",
                "active": 1
                }
            ]
        }

        payload: Array(1)
        0: {id: 41, name: 'Fernetazo Chabona', image: 'https://pointlaventanita.com/wp-content/uploads/2024/05/chabona.webp', category: 'drink', price: '2300.00', …}
        */

        // Guardo el objeto en una variable y se la paso a la funcion mostrarProducto para que muestre la url
        const producto = data.payload[0];
        console.log(producto); // {id: 41, name: 'Fernetazo Chabona', image: 'https://pointlaventanita.com/wp-content/uploads/2024/05/chabona.webp', category: 'drink', price: '2300.00', …}
        
        mostrarProducto(producto);
        

    } catch (error) {
        console.error("Errir al obtener el producto: ", error);
        
        mostrarError("error", "Error de conexion con el servidor");
    }
});

function mostrarProducto(producto) {
    console.table(producto); // Recibimos correctamente el producto en esta funcion

    let htmlProducto = `
        <ul>
            <li class="lista-producto">
                <img src=${producto.image} alt=${producto.name}>
                <p>Id: ${producto.id} / Nombre: ${producto.name} / <strong>Precio: $${producto.price}</strong></p>
            </li>
        </ul>
    `;

    contenedorProductos.innerHTML = htmlProducto;
}