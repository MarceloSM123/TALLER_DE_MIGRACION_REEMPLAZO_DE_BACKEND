import { Router } from "express";
import multer from "multer";
import {obtenerLibros, registrarLibro, obtenerFotoLibro,EliminarLibro,actualizarLibro} from "../controllers/item.controller.js"
import { login } from "../controllers/auth.controllers.js";
import { validarAuth } from "../middlewares/auth.middleware.js";

const router=Router();
const upload=multer({storage: multer.memoryStorage()});

router.post("/login",login)

router.get("/libros",validarAuth,obtenerLibros)
router.post("/libros/registrar",validarAuth,upload.single("file"),registrarLibro)
router.get("/libros/:id/foto",validarAuth,obtenerFotoLibro)
router.delete("/libros/:id",validarAuth,EliminarLibro)
router.put("/libros/:id",validarAuth,upload.single("file"),actualizarLibro)

export default router;


