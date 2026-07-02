// Importamos el modulo dotenv para leer y exportar las variables de entorno
import dotenv from "dotenv";


// Leemos las variables de entorno del archivo .env
dotenv.config(); // el valor de estas variables ya es accesible desde process.env.NOMBRE_VARIABLE


// Exporta estos valores como objetos, pero de forma anonima
export default{
    port: process.env.PORT,
    session_key: process.env.SESSION_KEY,
    database: {
        host: process.env.DB_HOST,
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        
    }
}
