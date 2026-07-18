import { type Request, type Response } from "express";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import prisma from "../database/prisma.js"

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const usuario = await prisma.usuarios.findFirst({
            where: { username: username }
        })
        if (!usuario) {
            res.status(401).json({ error: "Usuario o contraseña incorrectos" })
            return;
        }

        const passwordcorrecto= await bcrypt.compare(password,usuario?.password)
        if(!passwordcorrecto){
res.status(401).json({error: "Usuario o contraseña incorrecta"});
return;
        }
        const token = jwt.sign({
            id: Number(usuario.id),
            username: usuario.username},
            process.env.JWT_SECRET||"secreto",
            {expiresIn:"2h"}

        )

        res.json({token})
    } catch (error) {
res.status(500).json({error: "Error en el servidor"})
    }
}