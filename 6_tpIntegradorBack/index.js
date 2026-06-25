//============
//IMPORTACIONES
//============
import express from "express"
import environments from "./src/api/config/environments.js";
import connection from "./src/api/database/db.js";
import cors from "cors";

const {port} = environments;

const app = express();

//===========
//MIDLEWARES
//===========

// Middelware Cors básico para permitir todas las solicitudes
app.use(cors());

//Este midleware parsea automaticamente toda la info q recibamos en los endpoints POST y PUT
app.use(express.json());

// app.use((req, res, next) => {
//     console.log("Hola soy un midleware q saluda en todas las peticiones");
//     next(); //Si no ponemos next() nunca llega a procesarse la rta.
// });

//Midleware de ruta (se usara en alguinos endpoints)
const validateId = (req, res, next) => {
    const id = Number(req.params.id);

    if(!Number.isInteger(id) || id <= 0){
        return res.status(400).json({
            message: "El ID debe ser un numero positivo"
        });
    }

    req.id = id;
    next();
}


//ENDPOINTS => Punto de salida de URL

app.get("/", (req, res) => {
    res.send("Hola mundo desde Express.js");
})

//GET all products
app.get("/api/productos", async (req, res) => {
    //Optimizacion 1: Manejo de errores con try catch
    try{

        //Optimizacion 3: Extraemos la sentencia de una variables y la optimizamos
        //  Sacamos SELECT * para evitar traer columnas innecesarias (+ eficiencia)
        const sql = "SELECT id, nombre, talle, precio,temporada FROM productos";
        const [rows, fields] = await connection.query(sql); 

        //Optimizacion 4: Devolvemos error 404 si no hay productos
        if(rows.length === 0){
            return res.status(404).json({
                message: "No se encontraron productos"
            });
        };

        console.log(rows);
        console.log(fields);

        res.status(200).json({
            payload: rows
        });
    } catch(error){

        console.log(error)
        //Optimizacion 2: Devolvemos errores 500
        res.status(500).json({
            message: "Error interno del servidor"
        });
    }
});

//GET product by id
app.get("/api/productos/:id", validateId, async (req, res) => {
     //Optimizacion 1: Manejo de errores con try catch
    try {
        //Gracias al middleware validateId ya valido este dato y lo recibo en req.id
        //const id = req.params.id;
        const sql = "SELECT * FROM productos WHERE productos.id = ?"

        const [rows] = await connection.query(sql, [req.id]);

        //Optimizacion 4: Devolvemos error 404 si no hay productos con ese id
        if(rows.length === 0 || !req.id){
            return res.status(404).json({
                message: "No se encontraron productos"
            });
        };

        console.log(rows);
        res.status(200).json({
            payload: rows,
            total: rows.length
        });

    } catch (error){
        console.log(error);

        //Optimizacion 2: Devolvemos errores 500
        res.status(500).json({
            message: "Error interno del servidor"
        });
    }
});

// POST product (CREAR)
app.post("/api/productos", async (req, res) => {
    try {
        const {nombre, talle, precio, temporada} = req.body;
        const sql = "INSERT INTO productos (nombre, talle, precio, temporada) VALUES (?, ?, ?, ?)";

        const [rows] = await connection.query(sql, [nombre, talle, precio, temporada]);

        // if(rows.length){
        //     return res.status(404).json({
        //         message: "Ingresaste valores inexistentes"
        //     })
        // };

        res.status(200).json({
            message: "Producto creado con exito",
            insert_id: rows.insertId //Gracias a rows sabe q id crearle al producto.
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error interno del servidor"
        });
    }

});

// PUT Products (ACTUALIZAR)
app.put("/api/productos", async (req, res) => {

    try {
        const {id, nombre, talle, precio, temporada} = req.body; //Ya hacemos destructuring aca pq recibimos un objeto pq ya lo teniamos con el midelware |app.use(express.json());|
        const sql = "UPDATE productos SET nombre = ?, talle = ?, precio = ?, temporada = ? WHERE id = ?";
        
        const [result] = await connection.query(sql, [nombre, talle, precio, temporada, id]);

        //Optimizacion 2: Verificamos si realmente se actualizo algo
        if(result.affectedRows === 0){
            return res.status(404).json({
                message: "No se actualizo el producto"
            })
        };

        res.status(200).json({
            message: "Producto actualizado con exito"
        });

    } catch (error) {
        console.log(error);
        
        //Optimizacion 3: Devolvemos errores 500
        res.status(500).json({
            message: "Error interno del servidor"
        });
    }
});

//DELETE Products 
app.delete("/api/productos/:id", validateId, async (req, res) => {
    //Optimizacion 1: Manejo de errores con try catch
    try {
        const id = req.params.id;
        const sql = "DELETE FROM productos WHERE id = ?"; 


        const [rows] = await connection.query(sql, [req.id]);

        if(rows.length === 0){
            return res.status(404).json({
                message: `No existen productos con el id ${req.id}.`
            });
        }
        
        res.status(201).json({
            message: `Producto con el ${req.id} eliminado con exito.`
        })


    } catch (error) {
        console.log(error);
        //Optimizacion 2: Devolvemos errores 500
        res.status(500).json({
            message: "Error interno del servidor"
        });
    }
})

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`) // los consoles se veran en la terminal de visual pq estamos en un proyecto Node
})





