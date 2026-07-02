/*========================
    Rutas vistas
========================*/


import { Router } from "express";
import { deleteView, getView, indexView, postView, putView } from "../controllers/view.controllers.js";
import { requireLogin } from "../middlewares/middlewares.js";
const router = Router();


// Antes de servir cada vista, chequeamos si existe una sesion, este es un filtro de seguridad para proteger estas rutas de un acceso sin login (y por tanto sin sesion)
router.get("/index", requireLogin, indexView);

router.get("/consultar", requireLogin, getView);

router.get("/crear", requireLogin, postView);

router.get("/modificar", requireLogin, putView);

router.get("/eliminar", requireLogin, deleteView);

export default router;