import { Knex } from 'knex';
import { Tables, UsuarioTable} from '../ETableNames';


export async function up(knex: Knex):Promise<void> {
    return knex.schema.createTable(Tables.usuario,
        table => {
            table.bigIncrements(UsuarioTable.id).primary().index();
            table.string(UsuarioTable.name, 150).checkLength('<=', 150).index().notNullable();
            table.string(UsuarioTable.email, 150).index().notNullable().unique();
            table.string(UsuarioTable.password).index().notNullable();
            table.timestamp(UsuarioTable.created_at,{useTz: true}).defaultTo(knex.fn.now());
            table.timestamp(UsuarioTable.updated_at,{useTz: true}).defaultTo(knex.fn.now());
        }).then(()=> {
        console.log(`# Created table ${Tables.usuario}`);
    });
}


export async function down(knex: Knex):Promise<void> {
    return knex.schema.dropTable(Tables.usuario).then(()=>{
        console.log(`# Dropped table ${Tables.usuario}`)
    });
}

