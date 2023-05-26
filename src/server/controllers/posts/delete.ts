import {validation} from "../../shared/middleware";
import {CookieDto} from "../../database/models";
import * as yup from "yup";
import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {JWTservice} from "../../shared/services/JWTservice";
import {PostsProvider} from "../../database/providers/posts";

interface Post{
    id?: number
}
export const deleteByIdValidation = validation((getSchema) => ({
    header: getSchema<CookieDto>(yup.object().shape({
        authorization: yup.string().required()
    })),
    query: getSchema<Post>(yup.object().shape({
        id: yup.number().integer().moreThan(0).required(),
    })),
}));

export async function deleteById(req: Request<{},{},{},Post>, res: Response) {

    const [type, token] = req.headers.authorization!.split(' ');

    const auth = JWTservice.verify(token)

    if (typeof auth === 'object'){

        const deleted = await PostsProvider.deleteById(req.query.id!, auth.uid)

        if (deleted instanceof Error){
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: deleted.message
            })
        }

        return res.status(StatusCodes.NO_CONTENT).json(deleted)

    }


}