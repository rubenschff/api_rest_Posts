import {PostsDto} from "../../models/posts.dto";
import {Knex} from "../../knex";
import {PostsTable, Tables} from "../../ETableNames";

interface Post extends Omit<PostsDto, 'usuario_id'|'titulo'|'conteudo'|'autor'>{
    titulo?: string;
    conteudo?: string;
    autor?: string;
}
export async function updateById(post: Post, id: number) {

    const update = await Knex(Tables.posts)
        .update(post)
        .where(PostsTable.id, id)
        .returning<PostsDto[]>('*')
        .catch(e => {
            return Error(e)
        })

    console.log(update)
    if (update instanceof Error){
        return update
    }

    return update[0]

}