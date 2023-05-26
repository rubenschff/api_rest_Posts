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
export async function deleteById (req: Request<IHeaderProperties>, res: Response) {

  const [type, token] = req.headers.authorization!.split(' ');

  const auth = JWTservice.verify(token)

  if (typeof auth === 'object'){

    const result = await UsuarioProvider.deleteById(auth.uid);
    console.log(result)

    if (result instanceof Error){
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: result.message});
    }


    return res.status(StatusCodes.NO_CONTENT).send();
  }
  return res.status(StatusCodes.BAD_REQUEST).json(auth)
};
