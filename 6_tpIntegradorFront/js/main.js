// Redireccion a inicio////////////////////
let nombreUsuario = sessionStorage.getItem("nombreUsuario");


const url = "http://localhost:3000/api/productos"; // Guardamos en una variable la url de nuestro endpoint


let contadorCarrito = document.getElementById("contador-carrito")

let carrito = [];
let carritoJSON = localStorage.getItem(`carrito_${nombreUsuario}`);
if (carritoJSON != null) {
    carrito = JSON.parse(carritoJSON);
}

async function obtenerProductos() {
    try {
        let respuesta = await fetch(url); // Hacemos una peticion a nuestro nuevo endpoint en http://localhost:3000/api/products

        let data = await respuesta.json();

        console.log(data); // Nuestros productos estan disponibles dentro de payload { payload: Array(19) }

        productos = data.payload; // Aca guardamos en la variable productos el array de productos que contiene "payload"

        mostrarProductos(productos, "Seleccion", contenedorProdSeleccion);
        mostrarProductos(productos, "Clubes", contenedorProdClubes);

    } catch (error) {
        console.error(error);
    }
}

let contenedorProdSeleccion = document.querySelector(".ul-prod-seleccion")
let contenedorProdClubes = document.querySelector(".ul-prod-clubes")

function mostrarProductos(productos, categoria, subirHTML) {
    let htmlProductos = "";
    for (let i = 0; i < productos.length; i++)
        if(productos[i].activo && productos[i].category === categoria){
            htmlProductos += `
                            <li class="lista-prod">
                                <img class="contenedor-img-prod" src="${productos[i].image}" alt="">
                                <div class="contenedor-descripcion">
                                    <h3 class="contenedor-name-prod">${productos[i].name}</h3>
                                    <h4 class="contenedor-price-prod">$${productos[i].price}</h4>
                                </div>
                                <div class="contenedor-btn">
                                    <button class="sumar-producto" onclick="agregarAlCarrito(${productos[i].id})">+</button>
                                    <button class="restar-producto" onclick="restarDelCarrito(${productos[i].id})">-</button>
                                </div>
                            </li>`
            subirHTML.innerHTML = htmlProductos;   
        }
}

function saludarUsuario() {
    let saludoUsuario = document.getElementById("saludo-usuario");
    saludoUsuario.innerHTML = `<span>Bienvenido/a ${nombreUsuario}!</span>`;
}

function agregarAlCarrito(id) {
    let productoExiste = carrito.some(productos => productos.id == id);
    if (productoExiste) {
        for (let i = 0; i < carrito.length; i++) {
            if (carrito[i].id == id) {
                carrito[i].cantidad++;
                // alert("El producto fue sumado al carrito")
            }
        }
    } else {
        for (let i = 0; i < productos.length; i++) {
            if (productos[i].id == id) {
                productos[i].cantidad = 1;
                carrito.push(productos[i])
                // alert("El producto fue agregado al carrito")
            }
        }
    }
    console.log(carrito)
    localStorage.setItem(`carrito_${nombreUsuario}`, JSON.stringify(carrito));;
    mostrarCarrito(id);
}

function restarDelCarrito(id) {
    let bandera = false;

    if(carrito.length == 0) {
        // alert("No hay productos en el carrito")
        return;
    }

    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].id == id) {
            bandera = true;
            if (carrito[i].cantidad == 1) {
                carrito[i].cantidad--;
                // alert("El producto fue eliminado del carrito")
                carrito.splice(i, 1)

            } else {
                carrito[i].cantidad--;
                // alert("El producto fue restado del carrito")
            }
        }
    }
    if (bandera == false && carrito.length > 1) {
        for (let i = 0; i < productos.length; i++) {
            if (productos[i].id == id) {
                // alert("El producto no esta en el carrito")
            }
        }
    }
    console.log(carrito);;
    localStorage.setItem(`carrito_${nombreUsuario}`, JSON.stringify(carrito));
    mostrarCarrito(id);
}

function mostrarCarrito(id) {
    let productosHTML = document.querySelector(".elementos-carrito")

    let precioHTML = document.querySelector("#precio-total");
    let cantidadHTML = document.querySelector("#contador-carrito");

    let totalCarrito = document.querySelector(".total-carrito")
    let carritoHeader = document.querySelector(".carrito-header")

    let precioTotal = 0;
    let cantidadProductos = 0;
    let stringPush = "";

    for(let i = 0; i < carrito.length; i++) {
        precioTotal += carrito[i].price * carrito[i].cantidad;
        cantidadProductos += carrito[i].cantidad
        precioHTML.innerHTML = precioTotal;
        cantidadHTML.innerHTML = cantidadProductos;
        stringPush += `
                    <div id="items-carrito">
                        <p>${carrito[i].name} - $${carrito[i].price} x ${carrito[i].cantidad}</p>
                        <button class="btn-eliminar-item" onclick="eliminarDelCarrito(${carrito[i].id})">Eliminar</button>
                    </div>`
    }
    productosHTML.innerHTML = stringPush;

    if(carrito.length > 0){
        document.getElementById("btn-vaciar-carrito").classList.remove("hidden")
        document.getElementById("btn-vaciar-carrito").classList.add("visible")

        document.getElementById("btn-pagar-carrito").classList.remove("hidden")
        document.getElementById("btn-pagar-carrito").classList.add("visible")
    } else{
        document.getElementById("btn-vaciar-carrito").classList.add("hidden")
        document.getElementById("btn-vaciar-carrito").classList.remove("visible")

        document.getElementById("btn-pagar-carrito").classList.add("hidden")
        document.getElementById("btn-pagar-carrito").classList.remove("visible")

        productosHTML.innerHTML = `<p>No hay elementos en el carrito.</p>`
        totalCarrito.innerHTML = `<p>Total: <span id="precio-total">$0.00</span></p>`;
        carritoHeader.innerHTML = `<span>Carrito: <span id="contador-carrito">0</span> productos</span>`
    }
}


function vaciarCarrito(){
    if(vaciarCarrito){
        carrito = [];
        console.log(carrito);
        localStorage.removeItem(`carrito_${nombreUsuario}`);
        mostrarCarrito();
    };
}

function eliminarDelCarrito(id){
    if (eliminarDelCarrito){
        for(let i = 0; i < carrito.length; i++){
            if (carrito[i].id == id) {
                carrito.splice(i, 1)
                console.log(carrito);
                localStorage.setItem(`carrito_${nombreUsuario}`, JSON.stringify(carrito));
                mostrarCarrito()
            }
        }
    }
}


function buscarProducto(){
    let barraBusqueda = document.querySelector(".barra-busqueda")
    barraBusqueda.addEventListener("input", function(){
        let input = barraBusqueda.value;
        let productosFiltrados = productos.filter(productos =>{
            return productos.name.toLowerCase().includes(input.toLowerCase())
        })  
        mostrarProductos(productosFiltrados, "Seleccion", contenedorProdSeleccion);
        mostrarProductos(productosFiltrados, "Clubes", contenedorProdClubes);
    })
}




let botonImprimir = document.getElementById("btn-pagar-carrito");
botonImprimir.addEventListener("click", imprimirTicket);

function imprimirTicket(){ // Idealmente, primero se registra la venta, luego se imprime el ticket
    const confirmacion = confirm("Seguro que quiere comprar?")
    if(confirmacion){
        console.table(carrito);

        // Gracias al CDN ya tenemos las funcionalidades de jsPDF

        // Para registrar las ventas a posteriori, guardaremos los ids de los produtos del carrito
        let idProductos = [];

        // Gracias al CDN, extraemos la clase jspdf del objeto global window
        const { jsPDF } = window.jspdf;

        // Creamos una nueva instancia del document usando la clase jsPDF
        const doc = new jsPDF();  // En doc inicializamos todos los metodos para crear pdfs

        // Definimos el margen superior de 40 en el eje y -> eje vertical (y = vertical | x = horizontal)
        let y = 30;

        // Establecemos el tamaño de letra del 1er texto en 32px
        doc.setFontSize(32);

        // Escribimos el texto de ticket de compra en la pos x=80?->40! y=40
        doc.text("Ticket de Compra", 20, y);

        y+= 20;

        doc.setFontSize(30);

        doc.text("MUNDO CASACA", 60, y);

        //Definimos el espacio dsp del titulo 25px para abajo sera el prox texto
        y += 25;

        // Aca definimos el tamaño en 16px para los productos q vamos a comprar
        doc.setFontSize(16);

        // Iteramos el carrito e imprimimos el nombre y precio
        carrito.forEach(producto => {
            idProductos.push(producto.id); // Llenamos el array de ids de productos para registrar la venta despues
            
            doc.text(`${producto.name}  |  $${producto.price} x ${producto.cantidad}`, 30, y); // Creamos el texto para cada producto

            y += 20; // Dejamos 20px de espacio para el proximo producto q va abajo de otro (Evitamos solapamiento)
        });

        // Calculamos el precio total del ticket usando reduce --> acumulador                                       Este 0 es para iniciar el acumulador
        const precioTotal = carrito.reduce((total, producto) => total + parseInt(producto.price * producto.cantidad), 0); 

        // Añadimos otros 10px de espacio
        y += 10;

        // Establecemos un tamaño más grande para el precio (24px)
        doc.setFontSize(24);

        // Escribimos el precio total del ticket
        doc.text(`Total: $${precioTotal}`, 20, y);

        // Imprimimos el ticket de venta

        // Creamos el formato de nombre del ticket -> pedido lucas-2026-06-24T15:21:21.973Z.pdf
        let fecha = new Date();
        let nombreTicket = `pedido ${nombreUsuario}-${fecha.toISOString()}.pdf`;

        // Imprimimos el ticket de venta
        doc.save(nombreTicket);

        // Redireccion a login y limpieza del carrito
        // alert("Venta creada con éxito, Gracias por su compra!!");
        vaciarCarrito();
        registrarVentas(precioTotal, idProductos);
        // localStorage.removeItem("nombreUsuario");
        window.location.href = "index.html"
    }
}

async function registrarVentas(precioTotal, idProductos){
    try {
        
        const fecha = new Date();

        // Visualizamos por consola todos los datos que le mandaremos al endpoint /api/sales
        // console.log(fecha);             // Mon Dec 01 2025 22:01:57 GMT-0300 (Argentina Standard Time)
        // console.log(nombreUsuario);     // Mati
        // console.log(precioTotal);       // $65000
        // console.log(idProductos);       // [ 4, 5, 6]

        // Formato MySQL para timestamp
        // Tenemos que formatear la fecha para que la acepte mysql
        const fechaFormato = fecha.toISOString().slice(0, 19).replace("T", " "); // Como MYSQL no acepta fechas formato ISO tenemos q hacer esto
                                        // 2025-08-07T18:30:45.123Z    ^
                                    //     ^^^^^^^^^^^^^^^^^^^        El replace es para decir q la T se reemplace por un 
                                    //     19 caracteres              espacio

        console.log(fechaFormato); // 2026-05-07 17:51:15 asi si acepta


        // Preparamos en el objeto data la informacion que le enviaremos al endpoint /api/sales en formato JSON en nuestra peticion POST
        const data = {
            nombre_usuario: nombreUsuario,
            precio_total: precioTotal,
            fecha: fechaFormato
        }

        // const dataVp = {
        //     id_producto: idProductos
        // }

        // const responseVp = await fetch("http://localhost:3000/api/ventas_productos", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify(dataVp)
        // });

        // const resultadoVp = await responseVp.json();
        // console.log(resultadoVp);

        const response = await fetch("http://localhost:3000/api/ventas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const resultado = await response.json();
        console.log(response);

        if (response.ok){
            console.log("Venta registrada: ", resultado);
            alert(resultado.message);

            //Limpieza y redireccion al login
            sessionStorage.removeItem("nombreUsuario");
            vaciarCarrito();
            window.location.href = "index.html";

        } else {
            console.error(resultado);
            alert(`Error en la venta: ${resultado.message}` );
        }



    } catch (error) {
        console.log(`Error al enviar datos: ${error}`);
        alert("Error al registrar la venta");
    }
}

function cerrarSesion(){
    window.location.href = "index.html"
}

function init() {
    obtenerProductos();
    mostrarCarrito();
    buscarProducto();
    saludarUsuario()
}



init()