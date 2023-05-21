import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { JWTservice } from "../services/JWTservice";


export const autenticateRoutes: RequestHandler = async (req, res, next) =>{

    const { authorization }  = req.headers;
    console.log(req.headers);

    if(!authorization){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors: {default: 'Não autenticado!'}
        })
    }

    const authenticate = JWTservice.verify(authorization)
    if(authenticate === "JWT_SECRET_NOT_FOUND"){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {default: 'Erro ao verificar token'}
        })
    }else if(authenticate === "INVALID_TOKEN"){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors: {default: 'Não autenticado'}
        })
    }

    return next();
}