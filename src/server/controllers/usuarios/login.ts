import { Request, RequestHandler, Response, query, request } from "express";
import { IUsuario } from "../../database/models";
import { validation } from "../../shared/middleware";
import * as yup from "yup";
import { UsuarioProvider } from "../../database/providers/usuario";
import { StatusCodes } from "http-status-codes";
import { passwordCrypto } from "../../shared/services";
import { JWTservice } from "../../shared/services/JWTservice";


interface IBodyProps extends Omit<IUsuario, 'id'|'name'|'accessToken'> {  }

export const loginValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
      email: yup.string().required().min(6).email(),
      password: yup.string().required().min(6),
    })),
  }));  

export async function login (req: Request<{}, {}, IBodyProps>, res: Response)  {

    const{email, password} = req.body;

    const usuario = await UsuarioProvider.getByEmail(email!);

    if (usuario instanceof Error){
        return res.status(StatusCodes.NOT_FOUND).json({
          errors:{
            default: 'Usuário não cadastrado!'
          }
        });
      }
      
    const checkPassword = await passwordCrypto.verifyPassword(password!, usuario.password!);
      if (!checkPassword) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors:{
              default: 'Senha incorreta!'
            }
          });
      } else {
            const accessToken = await JWTservice.sign({uid: usuario.id})
            return res.status(StatusCodes.OK).json({
                ...usuario,
                accessToken: accessToken
            })
      }

}