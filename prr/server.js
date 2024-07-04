const express = require("express");
const path = require("path");
const mysql = require("mysql");

const app = express();
const port =3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "static")));


const conexion = mysql.createConnection({
    host: "tienda.cpc8ii0w6226.us-east-1.rds.amazonaws.com",
    database:"registro_usuarios",
    user:"roberto",
    password: "roberto123456789"
});


conexion.connect(err =>{    
    if(err){
        console.log("Conexion incorreca",err.stack);
        return;
    }
    console.log("Conexion exitosa");
    
})

// Ruta para manejar la solicitud POST del formulario
app.post("/register", (req, res) => {
    const {
      username,
      email,
      password,

    } = req.body;
  
    const query = `INSERT INTO usuarios 
                   (username, email, password) 
                   VALUES (?, ?, ?)`;
  
    const values = [
      username,
      email,
      password,
    ];
  
    conexion.query(query, values, (err, results) => {
      if (err) {
        console.error("Error al insertar datos en la base de datos:", err.stack);
        res.status(500).send("Error al insertar datos en la base de datos");
        return;
      }
      res.send("Datos insertados correctamente");
    });
  });



  app.get('/users', (req, res) => {
    conexion.query('SELECT username, email, password FROM usuarios', (error, results) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.json(results);
        }
    });
});


  // Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
  });