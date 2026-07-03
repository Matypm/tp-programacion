/*================================
    Controladores de autenticacion
*================================*/

// Importamos el modelo de usuarios para poder usar las consultas para el login
import UserModels from "../models/user.models.js"

import bcrypt from "bcrypt";


///////////////
// Vista login
export const loginView = (req, res) => {
    res.render("login", { // Aca renderizamos la vista login.ejs pasandole las variables title y about
        title: "Login",
        about: "Introduzca sus credenciales"
    })
}


//////////////////////////
// Funcionalidad login
export const loginUser = async (req, res) => {
    try {
        
        // Obtenemos el mail y la contraseña del formulario
        const { email, password } = req.body;


        // Evitamos consulta innecesaria
        if (!email || !password) {
            return res.render("login", {
                title: "Login",
                about: "Introduzca sus credenciales",
                error: "Todos los campos son obligatorios"
            })
        }

        // Bcrypt 1 -> Solo pedimos el email
        // const [rows] = await UserModels.selectAdminUsers(email, password);
        const [rows] = await UserModels.selectAdminUsers(email);


        // En caso de q no existan usuarios
        if (rows.length === 0){
            return res.render("login", {
                title: "Login",
                about: "Introduzca sus credenciales",
                error: "Credenciales incorrectas"
            })
        }


        // Obtenemos el user
        const user = rows[0];
        console.table(user);
        
        
        // Bcrypt 2 -> Ahora que tenemos el usuario guardado en user, comparamos los hasheos
        const match = await bcrypt.compare(password, user.password);

        console.log(match); // Si coinciden los datos, devuelve true

        // Si hubiera match, continuamos con el login
        if (match){
            // Guardamos la sesion 
            req.session.user = {
                id: user.id,
                name: user.name,
                email: user.email
            }
            
            // Redirigir al dashboard
            res.redirect("/dashboard/index"); // En lugar de renderizar con res.render("") -> aca redirigimos a una URL


        } else{
            // En caso de que no coincidan los hashes
            return res.render("login", {
                title: "Login",
                about: "Introduzca sus credenciales",
                error: "Contraseña invalida"
            })

        }

        

    } catch (error) {
        console.log(error);
    }
}

/////////////////////
// Destruir la sesion
/////////////////////
export const loginDestroy = (req, res) => {

    // Destruimos la sesion
    req.session.destroy((error) => {
        
        // En caso de error
        if (error) {
            console.log("Error al destruir la sesion: ", error);

            return res.status(500).json({
                message: "Error al destruir la sesion"
            })
        };

        // Destruida la sesion, redirigimos al login 
        res.redirect("/login");
    })
}


