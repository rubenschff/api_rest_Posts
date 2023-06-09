import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { JWTservice } from "../services/JWTservice";


export const autenticateRoutes: RequestHandler = async (req, res, next) =>{

    const  authorization   = req.headers.authorization;
    console.log(req.headers.authorization);

    if(!authorization){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors: {default: 'Não autenticado!',}
        })
    }

    const [type, token] = authorization.split(' ');
    
    if (type != 'Bearer') {
        return res.status(StatusCodes.UNAUTHORIZED).json(
            {error: 'Não autenticado'}
        );
    }

    const authenticate = JWTservice.verify(token)
    if(authenticate === "JWT_SECRET_NOT_FOUND"){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
            {errors: 'Erro ao verificar token'}
        )
    }else if(authenticate === "INVALID_TOKEN"){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            error: 'Não autenticado'
        })
    }

    return next();
}