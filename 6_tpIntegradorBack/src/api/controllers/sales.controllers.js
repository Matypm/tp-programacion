/*================================
    Controladores de ventas
*================================*/

import ProductModels from "../models/sales.models.js";

//////////////////
// Create a tabla VENTAS
////////////////

export const createVenta = async (req, res) => {
    // Optimizacion 1: Manejo de errores con try catch
    try {
        const { nombre_usuario, fecha, precio_total } = req.body;
        
        const [rows] = await ProductModels.insertVenta(nombre_usuario, fecha, precio_total);

        const ticketId = rows.insertId; 

        res.status(200).json({
            message: "Venta creada con éxito, Gracias por su compra!!",
            productId: ticketId  // Optimizacion 4: Devolvemos info util como el nuevo id creado
        })

    } catch (error) {
        console.log(error);

        // Optimizacion 2: Devolvemos errores 500
        res.status(500).json({
            message: "Error interno del servidor al registrar ventas"
        })
    }
}

/////////////////////////////////////
// Create a tabla ventas_productos
////////////////
 export const createVentaProd = async (req, res) => {
    // Optimizacion 1: Manejo de errores con try catch
    try {
        const { id_producto } = req.body;
        
        const [rows] = await ProductModels.insertVentaProd(id_producto);

        const idProd = rows.insertId;

        res.status(200).json({})


    } catch (error) {
        console.log(error)
        // Optimizacion 2: Devolvemos errores 500
        res.status(500).json({
            message: "Error interno del servidor al registrar venta y productos"
        })
    }
 }