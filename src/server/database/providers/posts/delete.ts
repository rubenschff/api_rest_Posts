import {Knex} from "../../knex";
import {PostsTable, Tables} from "../../ETableNames";


export async function deleteById(id: number, usuario: number): Promise<void|Error> {

    const deleted = await Knex(Tables.posts).delete()
        .where(PostsTable.id, id).where(PostsTable.usuario_id, usuario)

    console.log(deleted)
    if (deleted > 0) return

    return Error("Erro ao deletar post")
}