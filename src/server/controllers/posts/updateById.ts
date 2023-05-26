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

    const [type, token] = req.headers.authorization!.split(' ');

    const auth = JWTservice.verify(token)

    if (typeof auth === 'object'){

        const post:Post = req.body

        console.log(post)

        const update = await PostsProvider.updateById(post)

        if (update instanceof Error){
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: update.message
            })
        }

        console.log(update)
        return res.status(StatusCodes.OK).json(update)
    }




}