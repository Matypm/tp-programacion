const contenedorProductos = document.getElementById("contenedor-productos");
const getProductForm = document.getElementById("getProduct-form");
const contenedorForm = document.getElementById("contenedor-form");
const urlBase = "http://localhost:3000/api/productos";

// Optimizacion 1: Mostramos el mensaje de exito o error visualmente
function mostrarMensaje(type, message) {
    contenedorProductos.innerHTML = `<p class="mensaje mensaje-${type}">${message}</p>`;
}

function mostrarListaErrores(array) {
    let htmlErrores = "";
    array.forEach(error => {
        htmlErrores+= `<p class="mensaje mensaje-error">${error}</p>`
    });
    contenedorForm.innerHTML = htmlErrores;
}

getProductForm.addEventListener("submit", async event => {
    event.preventDefault(); //Evitamos el envio por defecto HTML del formulario

    // Extraemos el id del producto
    const idProd = event.target.idProd.value.trim();

    // Optimizacion 2: Tambien filtramos en el cliente en caso de que no haya un id valido
    if (!idProd) {
        mostrarMensaje("error", "Ingresá un ID valido");
        return;
    }
    
    try {
        // Vamos a hacer el fetch a una URL personalizada
        const response = await fetch(`${urlBase}/${idProd}`);
        console.log(response);

        // Procesamos los datos que devuelve el servidor
        const datos = await response.json();

            // Optimizacion 4: Evaluamos si el servidor no respondio un ok
            if (!response.ok) {
            mostrarMensaje("error", datos.message);
            return;
        }
        console.log(datos);

        

        const producto = datos.payload[0];

        console.log(producto); 
        /* {
            "id": 41,
            "name": "Fernet Cola Chabona",
            "image": "https://pointlaventanita.com/wp-content/uploads/2024/05/chabona.webp",
            "category": "drink",
            "price": "4300.00",
            "active": 1
        }*/

        renderizarProducto(producto);

    } catch (error) {
        console.error("error", "Error al obtener el producto");

        mostrarMensaje("error", "Error de conexion con el servidor");
    }
});

function renderizarProducto(producto) {
    let htmlProducto = `
    <ul>
        <li class="lista-producto">
            <img src="${producto.image}" alt="${producto.name}">
            <p>Id: ${producto.id} / Nombre: ${producto.name} / <strong>Precio: $${producto.price}</strong></p>
            <input type="button" id="updateProduct-button" value="Actualizar Producto">
        </li>
    </ul>
    `;

    contenedorProductos.innerHTML = htmlProducto;

    // Otra opcion seria agregando el atributo onclick="nombrefuncion"

    const deleteProductButton = document.getElementById("updateProduct-button");

    deleteProductButton.addEventListener("click", event => {
        event.stopPropagation();

        const confirmacion = confirm("Querés actualizar este producto?");
        console.log(confirmacion);

        if(!confirmacion) {
            alert("Eliminacion cancelada");
        } else {
            crearFormularioPut(event, producto);
        }
    });
}

// Funcion para realizar una operacion delete
async function crearFormularioPut(event, producto) {

    event.stopPropagation();
    console.table(producto);

    let updateFormHTML = `
        <hr>
        <form id="updateProduct-form" class="form-alta">
            <input type="hidden" name="id" value="${producto.id}">

            <label for="nameProd">Nombre</label>
            <input type="text" name="name" id="nameProd" value="${producto.name}" required>

            <label for="imageProd">Imagen</label>
            <input type="text" name="image" id="imageProd" value="${producto.image}" required>

            <label for="categoryProd">Categoria</label>
            <select name="category" id="categoryProd" required>
                <option value="Seleccion">Seleccion</option>
                <option value="Clubes">Clubes</option>
            </select>

            <label for="priceProd">Precio</label>
            <input type="number" name="price" id="priceProd" value="${producto.price}" required>

            <!-- Aca podemos hacer la baja logica que pide el TP -->
            <label for="activeProd">Activo</label>
            <select name="active" id="activeProd">
                <option value="1">activo</option>
                <option value="0">inactivo</option>
            </select>
            
            <div>
                <input type="submit" value="Actualizar producto">
            </div>
        </form>
    `;

    contenedorForm.innerHTML = updateFormHTML;

    const updateProductForm = document.getElementById("updateProduct-form");

    // Capturamos el evento de envio de nuestro nuevo formulario creado dinamicamente
    updateProductForm.addEventListener("submit", event => {
        actualizarProducto(event); // Hacemos la llamada para enviar estos datos
    });
}

// Enviaremos los datos del formulario al servidor
async function actualizarProducto(event) {
    event.preventDefault(); // Evitamos el envio por defecto del formulario

    // Recogemos los datos del formulario en un objeto FormData (no podemos hacerle JSON.stringify())
    const formData = new FormData(event.target); 

    // Parseamos este objeto FormData a un objeto JS para poder enviarlo como JSON con JSON.stringify() en el cuerpo de la peticion
    const data = Object.fromEntries(formData.entries()); 

        // Optimizacion 3: parseamos price antes de enviarlo, porque FormData devuelve todo como strings
        data.price = Number(data.price);

    try {
        const response = await fetch(`${urlBase}`,{
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        console.log(response);

        const result = await response.json();
        console.log(result);

        // Optimizacion : Manejamos una respuesta no ok del servidor
        if (!response.ok) {

            console.log(`Lista de errores: \n ${result.listaErrores.length}`);
            contenedorForm.innerHTML = "";
            // TO DO: Crear mostrarListaErrores
            if (result.listaErrores) {
                mostrarListaErrores(result.listaErrores);
            }
            mostrarMensaje("error", result.message);
            console.log(result);
            result.listaErrores.forEach(error => {
                console.log(error);
            })
            console.log(result.listaErrores)
            return;

        }

        getProductForm.innerHTML = "";
        contenedorForm.innerHTML = "";
        mostrarMensaje("exito", result.message);
        console.log(result.message);

    } catch (error) {
        console.error(error);
    }
}