import { Request, RequestHandler, Response, query, request } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import { validation} from "../../shared/middleware";
import { UsuarioProvider } from "../../database/providers/usuario";
import {JWTservice} from "../../shared/services/JWTservice";
import {CookieDto} from "../../database/models";

interface IParamProperties extends CookieDto{ }

export const getByIdValidation = validation((getSchema) => ({
  header: getSchema<IParamProperties>(yup.object().shape({
    authorization: yup.string().required()
  })),
}));


export const getById = async (req: Request<IParamProperties>, res: Response) => {

  if (!req.headers.authorization){
    return res.status(StatusCodes.BAD_REQUEST).json({
      default:{
        error: 'O token precisa ser informado no header'
      }  
    })
  }

  const auth = JWTservice.verify(req.headers.authorization!)

  if (typeof auth === 'object'){
    const usuario = await UsuarioProvider.getById(auth.uid);
    console.log(usuario);
    if(usuario instanceof Error){
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        default:{
          error: usuario.message
        }
      });
    }
    return res.status(StatusCodes.OK).json(usuario);
  }

  return res.status(StatusCodes.UNAUTHORIZED).json(auth)

};
