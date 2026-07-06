/*========================
    Rutas producto
========================*/

import { Router } from "express";
import { createVenta } from "../controllers/sales.controllers.js";
const router = Router();

/////////////////
// Post a tabla ventas
/////////////

router.post("/", createVenta);

/////////////////
// Post a tabla ventas_productos
/////////////

// router.post("/", createVentaProd);

// Exporto la ruta asi la centralizo en el archivo barril
export default router;