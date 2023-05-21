import {validation} from "../../shared/middleware";
import * as yup from "yup";
import {PostsDto} from "../../database/models/posts.dto";
import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {PostsProvider} from "../../database/providers/posts";
import {JWTservice} from "../../shared/services/JWTservice";
import {CookieDto} from "../../database/models";


interface Post extends Omit<PostsDto, 'id'|'usuario_id'>{

}
export const createValidation = validation((getSchema) => ({
    header: getSchema<CookieDto>(yup.object().shape({
        authorization: yup.string().required()
    })),
    body: getSchema<Post>(yup.object().shape({
        autor: yup.string().required(),
        titulo: yup.string().required(),
        conteudo: yup.string().required(),
    })),
}));


export async function create (req: Request<{},Post>, res: Response)  {

    if (!req.headers.authorization){
        return res.status(StatusCodes.BAD_REQUEST).json({
            default:{
                error: 'O token precisa ser informado no header'
            }
        })
    }

    const auth = JWTservice.verify(req.headers.authorization!)

    if (typeof auth === 'object'){
        const post = await req.body

        const create = await PostsProvider.create({...post, usuario_id: auth.uid})

        if (create instanceof Error){
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: create.message
            })
        }

        return res.status(StatusCodes.CREATED).json(create)
    }else {
        return res.status(StatusCodes.BAD_REQUEST).json(auth)
    }

}