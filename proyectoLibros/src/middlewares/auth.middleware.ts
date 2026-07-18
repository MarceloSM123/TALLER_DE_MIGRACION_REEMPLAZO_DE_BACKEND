import { type Request, type Response, type NextFunction } from "express"
import jwt from "jsonwebtoken"

export interface CustomRequest extends Request {
    usuario?: any;
}

export const validarAuth = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1] // Elimina el Bearer y conserva unicamente el token
    // validacion de token
    if (!token) {
        res.status(401).json({ error: "Acceso denegado" })
        return;
    }
    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET || "secreto");
        req.usuario = verificado;
        next();

    } catch (error) {
res.status(403).json({error: "Token invalido o expirado"})
    }
}