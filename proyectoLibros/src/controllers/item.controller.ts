import { type Request, type Response } from "express"
import prisma from "../database/prisma.js"
import multer from "multer"

export const obtenerLibros = async (req: Request, res: Response) => {
    try {
        const libros = await prisma.libros.findMany({
            select: {
                id: true,
                titulo: true,
                autor: true,
                foto: true,
                mime_type: true
            }
        });
        res.json(libros);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los libros" })
    }
}

export const registrarLibro = async (req: Request, res: Response) => {
    const { titulo, autor } = req.body;
    const archivo = req.file
    if (!archivo) {
        res.status(400).json({ error: "Debe seleccionar una foto" });
        return;
    }
    try {
        const nuevoLibro = await prisma.libros.create({
            data: {
                titulo,
                autor,
                mime_type: archivo.mimetype,
                //  foto: archivo.buffer,} esta version de prisma no acepta 
                foto: new Uint8Array(archivo.buffer),
            }
        })
        res.status(201).json(nuevoLibro);
    } catch (error) {
        res.status(500).json({ error: "Error al registrar el libro" })
    }

}

export const obtenerFotoLibro = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const Libro = await prisma.libros.findUnique({
            where: { id: Number(id) }
        })
        if (!Libro) {
            res.status(404).json({ error: "Libro no encontrado" })
            return;
        }
        res.setHeader("Content-type", Libro.mime_type!)
       // res.send(Libro)
      res.send(Buffer.from(Libro.foto!));
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la imagen" })
    }
}

export const EliminarLibro = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const Libro = await prisma.libros.delete({
            where: { id: Number(id) }
        })
        if (!Libro) {
            res.status(404).json({ error: "Libro no encontrado" })
            return;
        }
        res.json({ exito: "Libro eliminado" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el libro" })
    }

}

/* export const actualizarLibro =async(req: Request, res: Response)=>{
    const { id } = req.params;
    const { titulo, autor } = req.body;
    const archivo = req.file
     if (!archivo) {
        res.status(400).json({ error: "Debe seleccionar una foto" });
        return;
    }
     try {
        const libroActualizado = await prisma.libros.update({
            where: { id: Number(id) },
            data: { titulo, 
                autor, 
                mime_type: archivo.mimetype!,
                //  foto: archivo.buffer,} esta version de prisma no acepta 
                foto: new Uint8Array(archivo.buffer)!, }
                
        })
        res.json(libroActualizado)
    } catch (error) {
        res.status(500).json({ error: "Libro no encontrado" })
    }


} */

    export const actualizarLibro =async(req: Request, res: Response)=>{
    const { id } = req.params;
    const { titulo, autor } = req.body;
    const archivo = req.file

     try {
        if(archivo!){
        const libroActualizado = await prisma.libros.update({
            where: { id: Number(id) },
            data: { titulo, 
                autor, 
                mime_type: archivo.mimetype!,
                //  foto: archivo.buffer,} esta version de prisma no acepta 
              //  foto: new Uint8Array(archivo.buffer)!, } (Buffer.from(req.file.buffer))
                foto: new Uint8Array(Buffer.from(archivo.buffer))!, }
        })
        res.json(libroActualizado)}else{
            const libroActualizado = await prisma.libros.update({
            where: { id: Number(id) },
            data: { titulo, 
                autor }
                
        })
        res.json(libroActualizado)
        }
    } catch (error) {
        res.status(500).json({ error: "Libro no encontrado" })
    }}