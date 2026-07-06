/*================================
    Controladores de ventas
*================================*/

import connection from "../database/db.js";
import ProductModels from "../models/sales.models.js";

//////////////////
// Create a tabla VENTAS
////////////////

export const createVenta = async (req, res) => {
    // Optimizacion 1: Manejo de errores con try catch
    try {
        const { nombre_usuario, fecha, precio_total, productos } = req.body;
        
        const [rows] = await ProductModels.insertVenta(nombre_usuario, fecha, precio_total);

        
        const ticketId = rows.insertId; 

        res.status(200).json({
            message: "Venta creada con éxito, Gracias por su compra!!",
            productId: ticketId  // Optimizacion 4: Devolvemos info util como el nuevo id creado
        })
        
        for (const id_producto of productos){
            await ProductModels.insertVentaProd(id_producto);
        }

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
//  export const createVentaProd = async (req, res) => {
//     // Optimizacion 1: Manejo de errores con try catch
//     try {
//         const { id_producto } = req.body;

//         for (id_producto of productos) {
//             const [rows] = await ProductModels.insertVentaProd(id_producto);
//         }

//         // const idProd = rows.insertId;

//         res.status(200).json({
//             message: "Venta registrada con exito!",
//             ticketId: ticketId
//         })


//     } catch (error) {
//         console.log(error)
//         // Optimizacion 2: Devolvemos errores 500
//         res.status(500).json({
//             message: "Error interno del servidor al cargar venta y productos"
//         })
//     }
//  }