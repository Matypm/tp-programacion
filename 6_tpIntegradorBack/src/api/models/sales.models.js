// ========================
//    Modelos de ventas
// ========================

import connection from "../database/db.js";

///////////////////////
// Crear Tabla ventas
///////////
const insertVenta = (nombre_usuario, fecha, precio_total) => {
    const sql = "INSERT INTO ventas (nombre_usuario, fecha, precio_total) VALUES (?, ?, ?)"

    return connection.query(sql, [nombre_usuario, fecha, precio_total]);
}

///////////////
// Create Tabla venta_prod
////////////
const insertVentaProd = (id_producto) => {
    const sql = "INSERT INTO ventas_productos (id_producto) VALUES (?)"

    return connection.query(sql, [ id_producto])
}

export default{
    insertVenta,
    insertVentaProd
}