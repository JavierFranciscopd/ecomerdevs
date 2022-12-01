const app = require("./app");


const dotenv = require("dotenv")
const connectDatabase = require("./config/database")

// Handling Uncaught Exception

process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Apagar el servidor debido a la excepción Uncaugth");
    process.exit(1)
});


//config
dotenv.config({path:"backend/config/config.env"});

//conecting to database
connectDatabase();


const server = app.listen(process.env.PORT,()=>{

    console.log(`el servidor está trabajando en http://localhost:${process.env.PORT}`)
});



// Unhandled Promise Rejection
process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`);
    console.log(`apagar el servidor debido a un rechazo de promesa no manejado`);

    server.close(()=>{
        process.exit(1);
    });
});