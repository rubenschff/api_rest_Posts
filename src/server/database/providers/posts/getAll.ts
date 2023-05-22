import {PostsDto} from "../../models/posts.dto";
import {Knex} from "../../knex";
import {PostsTable, Tables} from "../../ETableNames";


export async function getAll( id: number ,usuario: number ) {

    console.log(id)
    console.log(usuario)
    let posts: PostsDto[]|Error = []
    if (id > 0){
        posts = await Knex(Tables.posts).select<PostsDto[]>([
            PostsTable.id,
            PostsTable.autor,
            PostsTable.titulo,
            PostsTable.conteudo
        ]).where(PostsTable.usuario_id, usuario)
            .where(PostsTable.id,id).catch(e => {
                return Error(e)
            })
    }else {
        posts = await Knex(Tables.posts).select<PostsDto[]>([
            PostsTable.id,
            PostsTable.autor,
            PostsTable.titulo,
            PostsTable.conteudo
        ]).where(PostsTable.usuario_id, usuario).catch(e => {
            return Error(e)
        })
    }

    console.log(posts)

    if (posts instanceof Error){
        return posts
    }

    return posts

}