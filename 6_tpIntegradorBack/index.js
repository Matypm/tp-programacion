//============
//IMPORTACIONES
//============
import express from "express"
import environments from "./src/api/config/environments.js";
import connection from "./src/api/database/db.js";
import cors from "cors";
import { loggerURL } from "./src/api/middlewares/middlewares.js";
import { productRoutes } from "./src/api/routes/index.js";
import { __dirname } from "./src/api/utils/index.js";


////////////////////
//   CONFIG
////////////////////
const app = express();
const PORT = environments.port;
app.set("view engine", "ejs"); // Configuramos EJS como motor de plantillas
app.set("views", join(__dirname, "src/views"));

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


// Middleware para servir archivos estaticos
app.use(express.static(join(__dirname, "src/public"))); // Estoy diciendole a la app la ruta de donde va a servir archivos estaticos



////////////
//ENDPOINTS => Punto de salida de URL
////////////


app.use("/api/productos", productRoutes);


app.get("/", (req, res) => {
    res.send("Hola mundo desde Express.js");
})

// Rutas de vistas
app.use("/dashboard", viewRoutes);




app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`) // los consoles se veran en la terminal de visual pq estamos en un proyecto Node
})





