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


export async function getById (req: Request<IParamProperties>, res: Response) {

  const [type, token] = req.headers.authorization!.split(' ');

  const auth = JWTservice.verify(token)

  if (typeof auth === 'object'){
    const usuario = await UsuarioProvider.getById(auth.uid);
    console.log(usuario);

    if(usuario instanceof Error){
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: usuario.message});
    }
    return res.status(StatusCodes.OK).json(
        {
          id: usuario.id,
          name: usuario.name,
          email: usuario.email
        }
    );
  }

  return res.status(StatusCodes.UNAUTHORIZED).json(auth)

};
