// Logica para trabajar con archivos y rutas de proyecto

// Importacion de modulos para trabajar con rutas
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Obtener el nombre del archivo actual
const __filename = fileURLToPath(import.meta.url);

// Vamos a hacer q el dirname apunte a la raiz de nuestro servidor
const __dirname = join(dirname(__filename), "../../../")

export{
    __dirname,
    join
}

/*
////////////////

- import.meta.url: Proporcionamos la URL absoluta del modelo actual
    file:////ruta/al/archivo.js


*/

