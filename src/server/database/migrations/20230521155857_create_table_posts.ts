import { Knex } from "knex";
import {PostsTable, Tables} from "../ETableNames";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(Tables.posts, table => {
        table.bigIncrements(PostsTable.id).primary().index();
        table.text(PostsTable.titulo).notNullable().index();
        table.text(PostsTable.conteudo).notNullable().index();
        table.text(PostsTable.autor).notNullable().index()
        table.integer(PostsTable.usuario_id).references('usuario.id').notNullable().index();
        table.timestamps(true,true,false);
    }).then(()=>{
        console.log(`# Created table ${Tables.posts}`)
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable(Tables.posts).then(()=>{
        console.log(`# Dropped table ${Tables.posts}`)
    })
}

