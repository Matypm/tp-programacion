const contenedorProductos = document.getElementById("contenedor-productos");
const postProductForm = document.getElementById("postProduct-form"); // Formulario productos
const postUserForm = document.getElementById("postUser-form"); // Formulario de usuarios
const urlBase = "http://localhost:3000/api";



// Optimizacion 1: Validacion previa de los datos en el cliente
function validarFormulario(data) {
    const errores = [];

    if (!data.name || data.name.trim().length < 2) {
        errores.push("El nombre debe tener al menos 2 caracteres");
    }

    if (!data.price || isNaN(data.price) || Number(data.price) < 0) {
        errores.push("El precio debe ser un numero mayor a 0");
    }

    if (!data.image) {
        errores.push("Debe incluirse una imagen");
    }

    if (!data.category) {
        errores.push("Debe seleccionar una categoria");
    }

    return errores;
}



// Optimizacion 2: Mostramos el mensaje de exito o error visualmente
function mostrarMensaje(type, message) {
    contenedorProductos.innerHTML = `<p class="mensaje mensaje-${type}">${message}</p>`;
}

function mostrarListaErrores(array) {
    let htmlErrores = "";
    array.forEach(error => {
        htmlErrores+= `<p class="mensaje mensaje-error">${error}</p>`
    });
    contenedorProductos.innerHTML = htmlErrores;
}

// Enviamos al endpoint el nuevo usuario admin
postUserForm.addEventListener("submit", async event => {
    event.preventDefault(); // Evitamos el envio por defecto del formulario

    // Convertimos la data del form en un objeto nativo del DOM, FormData
    const formData = new FormData(event.target);


    // Convertimos el objeto FormData en un objeto literal JS para hacerle luego JSON.stringify() para enviarselo al servidor en el body de la peticion http
    const data = Object.fromEntries(formData.entries());
    console.table(data);

    try {
        const response = await fetch(`${urlBase}/usuarios`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        console.log(response); // Response {type: 'cors', url: 'http://localhost:3000/api/products', redirected: false, status: 200, ok: true, …}

        // Aca transformare la respuesta JSON que devuelve el endpoint: message: "Producto creado con exito"
        const result = await response.json();

        // Optimizacion 5: Manejamos respuestas no ok del servidor
        if (!response.ok){

            if (result.listaErrores){
                mostrarListaErrores(result.listaErrores);
                return;
            }

            mostrarMensaje("error", result.message);
            return;
        }
        // En caso de exito, mostramos los siguientes mensajes
        mostrarMensaje("exito", result.message);
        console.log(result.message);



    } catch (error) {
        console.error("Error al enviar los datos ", error);
        mostrarMensaje("error", "Error al procesar la solicitud");
    }
})



// Gestionamos el envio de datos del formulario
postProductForm.addEventListener("submit", async event => {

    event.preventDefault(); 

    const formData = new FormData(event.target);

    const data = Object.fromEntries(formData.entries());

    // Optimizacion 3: parseamos price antes de enviarlo, porque FormData devuelve todo como strings
    data.price = Number(data.price);

    console.log(data); // {name: 'Panchito', image: 'https://www.gmasivos.com/wp-content/uploads/Para-Blog-4-Panchito.png', category: 'food', price: 300}

    // Optimizacion 4: Llamamos a la fnucion para validar los datos del formulario
    const errores = validarFormulario(data);

    // Si hay errores, mostramos mensaje de error y terminamos aca
    if (errores.length > 0) {
        console.log(errores);
        mostrarListaErrores(errores);
        return;
    }

    
    try {
        const response = await fetch(`${urlBase}/productos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        
        console.log(response); // Response {type: 'cors', url: 'http://localhost:3000/api/products', redirected: false, status: 200, ok: true, …}

        // Aca transformare la respuesta JSON que devuelve el endpoint: message: "Producto creado con exito"
        const result = await response.json(); // Aca obtenemos la respuesta parseada que me devuelve el servidor

        // Optimizacion 5: Manejamos respuestas no ok del servidor
        if (!response.ok) {
            
            if (result.listaErrores) {
                mostrarListaErrores(result.listaErrores);
                return;
            }

            mostrarMensaje("error", result.message);
            return;
        }

        // En caso de exito, mostramos los siguientes mensajes
        mostrarMensaje("exito", result.message);
        console.log(result.message);

    } catch (error) {
        console.error("Error al enviar los datos ", error);
        mostrarMensaje("error", "Error al procesar la solicitud")
    }
});