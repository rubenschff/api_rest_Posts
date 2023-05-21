import {PostsDto} from "../../models/posts.dto";
import {Tables} from "../../ETableNames";
import {Knex} from "../../knex";


export async function create(post: Omit<PostsDto, 'id'>):Promise<PostsDto|Error> {

    const create = await Knex(Tables.posts)
        .insert(post)
        .returning<PostsDto[]>('*').catch(e => {
            return Error(e)
        })

    if (create instanceof Error){
        return create
    }

    return create[0]

}