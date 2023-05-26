import { Request, RequestHandler, Response, query, request } from "express";
import { IUsuario } from "../../database/models";
import { validation } from "../../shared/middleware";
import * as yup from "yup";
import { UsuarioProvider } from "../../database/providers/usuario";
import { StatusCodes } from "http-status-codes";
import { passwordCrypto } from "../../shared/services";
import { JWTservice } from "../../shared/services/JWTservice";


interface IBodyProps extends Omit<IUsuario, 'id'|'name'|'token'> {  }

export const loginValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
      email: yup.string().required().min(6).email(),
      password: yup.string().required().min(6),
    })),
  }));  

export async function login (req: Request<{}, {}, IBodyProps>, res: Response)  {

    const{email, password} = req.body;

    const usuario = await UsuarioProvider.getByEmail(email!);
    console.log(usuario)

    if (usuario instanceof Error){
        return res.status(StatusCodes.NOT_FOUND).json({
          error: 'Usuário não cadastrado!'
        });
      }
      
    const checkPassword = await passwordCrypto.verifyPassword(password!, usuario.password!);
    console.log(checkPassword)
      if (!checkPassword) {
        return res.status(StatusCodes.UNAUTHORIZED).json({error: 'Senha incorreta!'});
      } else {
            const token = await JWTservice.sign({uid: usuario.id})
            return res.status(StatusCodes.OK).json({
                id: usuario.id,
                name: usuario.name,
                email: usuario.email,
                token: token
            })
      }

}