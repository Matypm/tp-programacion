//============
//IMPORTACIONES
//============
import express from "express"
import environments from "./src/api/config/environments.js";
import connection from "./src/api/database/db.js";
import cors from "cors";
import { loggerURL } from "./src/api/middlewares/middlewares.js";
import { authRoutes, productRoutes, userRoutes, viewRoutes } from "./src/api/routes/index.js";
import { __dirname, join } from "./src/api/utils/index.js"; //Importamos __dirname y join apuntando a la ruta del archivo index.js
import session from "express-session"; // Aca importamos el modulo session que instalamos con npm i express-session y se encuentra adentro de node_modules
const { port, session_key } = environments;

////////////////////
//   CONFIG
////////////////////   
const app = express();
const PORT = environments.port;
app.set("view engine", "ejs"); // Configuramos EJS como motor de plantillas
app.set("views", join(__dirname, "src/views")); // res.render("index") -> Internamente sabe que tiene que agarrar index.ejs en la carpeta src/views


/////////////
//MIDLEWARES
/////////////

// Los middlewares de aplicacion se ejecutan en TODAS las solicitudes

// Middelware Cors básico para permitir todas las solicitudes
app.use(cors());


// Middleware logger para poder ver en consola toda la actividad de nuestro servidor
app.use(loggerURL); 


//Este midleware parsea automaticamente toda la info JSON q recibamos en los endpoints POST y PUT
app.use(express.json());

//Middleware para parsear la info enviada con <form>
app.use(express.urlencoded({ extended: true }));


// Middleware para servir archivos estaticos
app.use(express.static(join(__dirname, "src/public"))); // Estoy diciendole a la app la ruta de donde va a servir archivos estaticos


/////////////////////////
// Middleware de sesion
/////////////////////////
app.use(session({
    secret: session_key, // Firmamos las cookies para evitar manipulacion (protegemos la sesion con una contraseña)
    resave: false, // Evitamos guardar la sesion si no hubo cambios
    saveUninitialized: true // No guardamos sesiones vacias
}));




////////////
//ENDPOINTS => Punto de salida de URL
////////////

// app.use() es la llamada a un middleware de aplicacion (que se aplica a todas las rutas)
app.use("/api/productos", productRoutes); // Todas las peticiones a esta URL se las pasamos a product.routes.js
app.use("/dashboard", viewRoutes); // Rutas de vistas
app.use("/login", authRoutes); // Rutas de autenticacion
app.use("/api/usuarios", userRoutes); // Rutas de usuario



app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`) // los consoles se veran en la terminal de visual pq estamos en un proyecto Node
})



// INDEX -> RUTA -> CONTROLADOR -> MODELO

