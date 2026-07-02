/*================================
    Modelos de usuario
*================================*/

import connection from "../database/db.js";

// TO DO, endpoint para crear usuarios admin


////////////////////////////////
// Seleccionar usuarios admin
const selectAdminUsers = (email, password) => {

    const sql = "SELECT * FROM users where email = ? AND password = ?";

    return connection.query(sql, [email, password])
}


export default {
    selectAdminUsers
}
