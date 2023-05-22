import {Knex} from "../../knex";
import {Tables} from "../../ETableNames";



export async function deleteById (id: number): Promise<void| Error> {
    try {
        
        const result = await Knex(Tables.usuario).where('id', '=', id).delete();

        if(result >0) return;

        return Error('Erro ao deletar registro');
    }catch (e) {
        console.log(e);
        return Error('Erro ao deletar registro');
    }

}