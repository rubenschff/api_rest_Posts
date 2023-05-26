import { Request, RequestHandler, Response, query, request } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import { validation } from "../../shared/middleware";
import {IUsuario} from "../../database/models";
import {UsuarioProvider} from "../../database/providers/usuario";

interface IBodyProps extends Omit<IUsuario, 'id'|'token'> { }

export const createValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(yup.object().shape({
    name: yup.string().required().min(3).max(150),
    email: yup.string().required().min(6).email(),
    password: yup.string().required().min(6)
  })),
}));

//cria o usuário
export async function create (req: Request<{}, {}, IBodyProps>, res: Response) {

  const verifyUSerExists = await UsuarioProvider.getByEmail(req.body.email!);

  if (verifyUSerExists instanceof Error){

    const result = await UsuarioProvider.create(req.body);
    console.log(result)

    if (result instanceof Error){
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: result.message});
    }

    return res.status(StatusCodes.CREATED).json(result);
  }

  return res.status(StatusCodes.UNAUTHORIZED).json({
      error: 'Usuário ja cadastrado!'
  });
};
