// =======================
//     Middlewares
// =======================

// Middleware logger para poder ver en consola toda la actividad de nuestro servidor
const loggerURL = (req, res, next) => {
    let fecha = new Date();
    console.log(`[${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}] ${req.method} ${req.url}`)
    next(); // Permite pasar al siguiente middleware o dar paso a la res
}

// Middleware de ruta: se usara en algunas rutas y en otras no
const validateId = (req, res, next) => {
    const id = Number(req.params.id);

    // Si no es un entero o es inferior a 0
    if(!Number.isInteger(id) || id <= 0){
        return res.status(400).json({
            message: "El ID debe ser un numero positivo"
        });
    }

    req.id = id;
    next();
}


// Middleware para validar los campos del formulario
const tallesValidos = ["S", "M", "L", "XL"];
const validateProduct = (req, res, next) => {
    const { nombre, talle, precio, temporada } = req.body; // Recogemos los datos del body
    const errores = []; // Creamos un array vacio de errores

    // Verificamos los datos de entrada
    if (!nombre || !talle || !precio || !temporada){
        errores.push("Faltan campos requeridos");
    }

    if (typeof precio !== "number" || precio <= 0){
        errores.push("El precio debe ser un numero mayor a 0");
    }

    // No validamos image pq usamos dsp Multer

    if (!tallesValidos.includes(talle)){
        errores.push("Talle invalido");
    }

    // Detectamos si existe algun error en la lista y lo devolvemos en un 400
    if (errores.length > 0){
        return res.status(400).json({
            message: "Datos invalidos",
            listaErrores: errores
        });
    }

    next(); // Sin el next, no da paso al siguiente middleware o a procesar la respuesta
}

const requireLogin = (req, res, next) => {
    if (!req.session.user){
        return res.redirect("/login")
    }

    next();
}



export {
    loggerURL,
    validateId,
    validateProduct,
    requireLogin
}

