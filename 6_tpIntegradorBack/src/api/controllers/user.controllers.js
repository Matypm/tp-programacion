/*================================
    Controladores de usuarios
*================================*/

import userModels from "../models/user.models.js";
import bcrypt from "bcrypt";

/////////////////////
// Create admin user
export const createAdminUser = async (req, res) => {
    
    try {
        console.table(req.body);
        // Recogemos los datos limpios del body
        const { nameUser, emailUser, passwordUser } = req.body;

        // Bcrypt 1 -> Hasheamos el password del nuevo usuario admin
        const saltRounds = 10; // Indicamos cuantas veces bcrypt aplicara el algoritmo internamente (mas rondas -> mas seguro y mas lento)

        const hashedPassword = await bcrypt.hash(passwordUser, saltRounds); // Hasheandose el password

        const [rows] = await userModels.insertAdminUser(nameUser, emailUser, hashedPassword);

        res.status(201).json({
            message: `Usuario creado con exito con id ${rows.insertId}`,
            productId: rows.insertId // Optimizacion 4: Devolvemos info util como el nuevo id creado
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Error interno del servidor al crear usuarios"
        })
    }
}