// ========================
//    Modelos de productos
// ========================


import connection from "../database/db.js";


/////////////////////
// Seleccionar todos los productos
/////////////////////

const selectAllProducts = () => {
     //Optimizacion 3: Extraemos la sentencia de una variables y la optimizamos
        //  Sacamos SELECT * para evitar traer columnas innecesarias (+ eficiencia)
        const sql = "SELECT id, name, price, image FROM productos";

        // Con el destructuring separamos los resultados (rows) y la metadata(field)
        return connection.query(sql); 
} 


/////////////////////
// Seleccionar producto por id
/////////////////////

const selectProductById = (id) => {
    // Optimizacion 3: Extraemos la sentencia en una variable y la optimizamos
    // Sacamos el SELECT * pq evita traer columnas innecesarias (+ eficiencia)
    // El ? en la consulta es un "placeholder", una medida de seguridad en consultas SQL para prevenir inyecciones SQL
    
    const sql = "SELECT id, name, image, category, price FROM productos WHERE id = ?"

    return connection.query(sql, [id]);
}


/////////////////////
// Crear nuevo producto
/////////////////////

const insertProduct = (cleanName, image, category, price) => {
    // Los placeholders "?" nos permiten realizar consultas SQL mas seguras (evitan inyeccion SQL)
    const sql = "INSERT INTO productos (name, image, category, price) VALUES (?, ?, ?, ?)";

    return connection.query(sql, [cleanName, image, category, price]);
}


/////////////////////
// Modificar producto
/////////////////////

const updateProduct = (name, image, price, category, id) => {
    const sql = "UPDATE productos SET name = ?, image = ?, price = ?, category = ? WHERE id = ?";
        
    return connection.query(sql, [name, image, price, category, id]);
}


/////////////////////
// Eliminar producto
/////////////////////

const deleteProduct = (id) => {
    const sql = "DELETE FROM productos WHERE id = ?"; 

    return connection.query(sql, [id]);
}

export default {
    selectAllProducts,
    selectProductById,
    insertProduct,
    updateProduct,
    deleteProduct
}