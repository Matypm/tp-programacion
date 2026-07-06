// ===========================
//  Controllers de productos
// ===========================

import ProductModels from "../models/product.models.js";




///////////////////
//GET all products
///////////////////
export const getAllProducts = async (req, res) => {

    //Optimizacion 1: Manejo de errores con try catch
    try{

        const [rows, fields] = await ProductModels.selectAllProducts(); 

        //Optimizacion 4: Devolvemos error 404 si no hay productos
        if(rows.length === 0){
            return res.status(404).json({
                message: "No se encontraron productos"
            });
        }

        // console.log(rows);

        res.status(200).json({
            payload: rows,
            total: rows.length // Metadata util para el front
        });

    } catch(error){
        console.log(error)

        //Optimizacion 2: Devolvemos errores 500
        res.status(500).json({
            message: "Error interno del servidor al obtener productos"
        })
    }
}



//////////////////////
// GET PRODUCT BY ID
//////////////////////

export const getProductById = async (req, res) => {

     //Optimizacion 1: Incorporamos el manejo de errores con try catch
    try {
        // Gracias al middleware validateId ya valido este dato y lo recibo en req.id
        // const id = req.params.id; -> este id se encuentra dentro de req.id


        const [rows] = await ProductModels.selectProductById(req.id);
        //Optimizacion 4: Devolvemos error 404 si no hay productos con ese id
        if(rows.length === 0 || !req.id){
            return res.status(404).json({
                message: "No se encontraron productos"
            });
        };

        res.status(200).json({
            payload: rows
        });

    } catch (error){
        console.log(error);

        //Optimizacion 2: Devolvemos errores 500
        res.status(500).json({
            message: "Error interno del servidor al obtener productos"
        });
    }
};


///////////////////
//Create PRODUCT
///////////////////

export const createProduct = async (req, res) => {

    // Optimizacion 1: Agregamos manejo de errores con try catch
    try {
        // Gracias al middleware router.use(express.json()) -> Recibimos un objeto JS ya parseado
        // console.log(req.body);

        // Extraemos los valores que vienen en el CUERPO (body) de la peticion http (HTTP Request)
        const { name, image, category, price } = req.body;

        // Optimizacion 3: Sanitizamos los strings antes de insertarlos, para normalizar los datos
        const cleanName = name.trim();


        const [rows] = await ProductModels.insertProduct(cleanName, image, category, price);

        // Optimizacion 5: En lugar de 200 OK, 201 Created
        res.status(200).json({
            message: `Producto creado con exito con id ${rows.insertId}`,
            productId: rows.insertId // Optimizacion 4: Devolvemos info util como el nuevo id creado
        })


    } catch (error) {
        console.log(error);

        // Optimizacion 2: Devolvemos errores 500
        res.status(500).json({
            message: "Error interno del servidor al crear productos"
        })
    }

};

////////////////////
// Modify Product
////////////////////

export const modifyProduct = async (req, res) => {

    // Optimizacion 1: Agregamos manejo de errores con try catch
    try {
        const { id, name, image, price, category, active } = req.body; //Ya hacemos destructuring aca pq recibimos un objeto pq ya lo teniamos con el midelware |app.use(express.json());|
        

        const [result] = await ProductModels.updateProduct(name, image, price, category, active, id);

        //Optimizacion 2: Verificamos si realmente se actualizo algo
        if(result.changedRows === 0){
            return res.status(404).json({
                message: "No se actualizo el producto"
            })
        }

        res.status(200).json({
            message: "Producto actualizado con exito"
        });

    } catch (error) {
        console.log(error);
        
        //Optimizacion 3: Devolvemos errores 500
        res.status(500).json({
            message: "Error interno del servidor al crear productos"
        });
    }
};

//////////////////////
// Remove Product
//////////////////////

export const removeProduct =  async (req, res) => {

    //Optimizacion 1: Manejo de errores con try catch
    try {
        // El middleware ya valida y anexa el id en req.id
        //const id = req.params.id; 

        await ProductModels.deleteProduct(req.id);

        
        res.status(201).json({
            message: `Producto con el ${req.id} eliminado con exito.`
        })


    } catch (error) {
        console.log(error);

        //Optimizacion 2: Devolvemos errores 500
        res.status(500).json({
            message: "Error interno del servidor al eliminar productos"
        })
    }
}

