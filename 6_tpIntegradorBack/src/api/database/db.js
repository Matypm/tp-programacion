import environments from "../config/environments.js";
import mysql2 from "mysql2/promise";

const {database} = environments; //Destructuring 
//const database = environments.database //Sin destructuring

const connection = mysql2.createPool({ // conjunto de conexiones abiertas

    host: database.host,
    database: database.name,
    user: database.user,
    password: database.password,
});

export default connection;


