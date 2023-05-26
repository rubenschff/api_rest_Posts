import {validation} from "../../shared/middleware";
import {CookieDto} from "../../database/models";
import * as yup from "yup";
import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {JWTservice} from "../../shared/services/JWTservice";
import {PostsProvider} from "../../database/providers/posts";

interface QueryParams {
    id?: number;
}
export const getAllValidation = validation((getSchema) => ({
    header: getSchema<CookieDto>(yup.object().shape({
        authorization: yup.string().required()
    })),
    query: getSchema<QueryParams>(yup.object().shape({
       id: yup.number().integer().default(0).notRequired(),
    })),
}));


export async function getAll(req: Request<{},{},{},QueryParams>, res: Response) {

    const [type, token] = req.headers.authorization!.split(' ');

    const auth = JWTservice.verify(token)

    if (typeof auth === 'object'){

        const posts = await PostsProvider.getAll(req.query.id || 0, auth.uid)

        if (posts instanceof Error){
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: posts.message
            })
        }

        return res.status(StatusCodes.OK).json(posts)
    }

}