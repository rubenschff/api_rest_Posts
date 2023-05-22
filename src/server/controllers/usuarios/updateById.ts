import { Request, RequestHandler, Response, query, request } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import { validation } from "../../shared/middleware";
import {CookieDto, IUsuario} from "../../database/models";
import { UsuarioProvider } from "../../database/providers/usuario";
import {JWTservice} from "../../shared/services/JWTservice";
import {passwordCrypto} from "../../shared/services";

interface IHeaderProperties extends CookieDto{ }

interface IBodyPropeties extends Omit<IUsuario, 'id'|'accessToken'>{
    oldPassword?: string;
}

export const updateByIdValidation = validation((getSchema) => ({
  header: getSchema<IHeaderProperties>(yup.object().shape({
    authorization: yup.string().required(),
  })),
  body: getSchema<IBodyPropeties>(yup.object().shape({
    name: yup.string().notRequired().min(3).max(150),
    email: yup.string().notRequired().min(6),
    password: yup.string().notRequired().min(4),
      oldPassword: yup.string().notRequired().min(4)
  })),
}));

//cria o usuário
export async function updateById (req: Request<IHeaderProperties,{},IBodyPropeties>, res: Response)  {

    if (!req.headers.authorization){
        return res.status(StatusCodes.BAD_REQUEST).json({
            default:{
                error: 'O token precisa ser informado no header'
            }
        })
    }

    if (req.body.email){
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'Não é permitido alterar o email!'
        });
    }

    const auth = JWTservice.verify(req.headers.authorization!)

    if (typeof auth === 'object'){

        if(req.body.password || req.body.oldPassword){
            if (!req.body.oldPassword){
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({error: 'Informe a senha antiga no campo oldPassword'})
            } else if (!req.body.password){
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({error: 'Informe a senha no campo password'})
            }

            const oldUser = await UsuarioProvider.getById(auth.uid)

            if (oldUser instanceof Error){
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    default:{
                        error: oldUser.message
                    }
                });
            }

            const oldPassword = await passwordCrypto.verifyPassword(req.body.oldPassword!, oldUser.password!)

            if (!oldPassword){
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: 'Senha incorreta'
                });
            }

            delete req.body.oldPassword
        }

        const update = await UsuarioProvider.updateById(auth.uid, req.body);

        if(update instanceof Error){
            console.log(update);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                default:{
                    error: update.message
                }
            });
        }
        return res.status(StatusCodes.OK).json(update);
    }

    return res.status(StatusCodes.BAD_REQUEST).json(auth)


};
