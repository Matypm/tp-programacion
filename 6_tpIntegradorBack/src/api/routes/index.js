/*========================
    Archivo de barril
========================*/
import productRoutes from "./products.routes.js";
import viewRoutes from "./view.routes.js";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import saleRoutes from "./sales.routhes.js";


// Centraliza todas las rutas y las exporta con un nombre

export{
    productRoutes,
    viewRoutes,
    userRoutes,
    authRoutes,
    saleRoutes
}