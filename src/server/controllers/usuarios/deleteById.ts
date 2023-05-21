import { Request, RequestHandler, Response, query, request } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import { validation } from "../../shared/middleware";
import {CookieDto} from "../../database/models";
import {UsuarioProvider} from "../../database/providers/usuario";
import {JWTservice} from "../../shared/services/JWTservice";

interface IHeaderProperties extends CookieDto { }

export const deleteByIdValidation = validation((getSchema) => ({
  header: getSchema<IHeaderProperties>(yup.object().shape({
    authorization: yup.string().required(),
  })),
}));

//cria o usuário
export const deleteById = async (req: Request<IHeaderProperties>, res: Response) => {

  if (!req.headers.authorization){
    return res.status(StatusCodes.BAD_REQUEST).json({
      default:{
        error: 'O token precisa ser informado no header'
      }
    })
  }


  const auth = await JWTservice.verify(req.headers.authorization)

  if (typeof auth === 'object'){

    const result = await UsuarioProvider.deleteById(auth.uid);

    if (result instanceof Error){
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors:{
          default: result.message
        }
      });
    }


    return res.status(StatusCodes.NO_CONTENT).send();
  }
  return res.status(StatusCodes.BAD_REQUEST).json(auth)
};
