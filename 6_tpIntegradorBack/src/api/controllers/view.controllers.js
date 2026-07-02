/*================================
    Controladores de vistas
*================================*/

import productModels from "../models/product.models.js";


// Vista principal del dashboard
export const indexView = async (req, res) => {

    try {
        // Traemos todos los productos del modelo y los guardamos en rows
        const [rows] = await ProductModels.selectAllProducts();

        res.render("index", {
            title: "Principal",
            about: "Nuestros productos",
            productsArray: rows // Le pasamos a la plantilla EJS este array de productos
        })

    } catch (error) {
        console.log(error);
    }
}

// Vista consultar
export const getView = (req, res) => {
    res.render("get", {
        title: "Consultar",
        about: "Consultar producto por id:"
    });
}


// Vista consultar
export const postView = (req, res) => {
    res.render("post", {
        title: "Crear",
        about: "Crear producto"
    });
}   


// Vista consultar
export const putView = (req, res) => {
    res.render("put", {
        title: "Modificar",
        about: "Consultar producto por id:"
    });
}

// Vista consultar
export const deleteView = (req, res) => {
    res.render("delete", {
        title: "Eliminar",
        about: "Consultar producto por id:"
    })
}
