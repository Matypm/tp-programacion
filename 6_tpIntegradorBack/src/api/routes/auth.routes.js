/*========================
    Rutas autenticacion
========================*/


import { Router } from "express";
import { loginUser, loginView } from "../controllers/auth.controllers.js";
const router = Router();


/////////////
// Vista login
router.get("/", loginView);



//////////////////////////
// Funcionalidad login
router.post("/", loginUser);


export default router;