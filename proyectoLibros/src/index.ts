import express from "express"
import cors from "cors"
import authRouter from "./routes/items.js"

const app=express();
const PORT=3000;

app.use(cors({
    origin: 'http://localhost:5173',  // ← El origen de tu frontend
    credentials: true,                 // ← Permitir credenciales
}));
app.use(express.json());
app.use("/auth",authRouter)
app.listen(PORT,()=>{
    console.log("Servidor levantado en el puerto: ", PORT)
})