import {validation} from "../../shared/middleware";
import * as yup from "yup";
import {PostsDto} from "../../database/models/posts.dto";
import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {PostsProvider} from "../../database/providers/posts";
import {CookieDto} from "../../database/models";
import {JWTservice} from "../../shared/services/JWTservice";

interface Post extends Omit<PostsDto, 'usuario_id'|'titulo'|'conteudo'|'autor'>{
    titulo?: string;
    conteudo?: string;
    autor?: string;
}
export const updateByIdValidation = validation((getSchema) => ({
    header: getSchema<CookieDto>(yup.object().shape({
        authorization: yup.string().required()
    })),
    body: getSchema<Post>(yup.object().shape({
        id: yup.number().integer().moreThan(0).required(),
        autor: yup.string().notRequired(),
        titulo: yup.string().notRequired(),
        conteudo: yup.string().notRequired(),
    })),
}));


export async function updateById (req: Request<{},Post>, res: Response)  {

    if (!req.headers.authorization){
        return res.status(StatusCodes.BAD_REQUEST).json({
            default:{
                error: 'O token precisa ser informado no header'
            }
        })
    }

    const auth = JWTservice.verify(req.headers.authorization!)

    if (typeof auth === 'object'){

        const post:Post = req.body

        const update = await PostsProvider.updateById(post, auth.uid)

        if (update instanceof Error){
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: update.message
            })
        }

        return res.status(StatusCodes.CREATED).json(update)
    }




}