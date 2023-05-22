import {Tables, UsuarioTable} from "../../ETableNames";
import { Knex } from "../../knex";
import { IUsuario } from "../../models";

export async function getByEmail (email: string): Promise<IUsuario | Error>  {
  try {
    const result = await Knex(Tables.usuario)
      .select('*')
      .from(Tables.usuario)
      .where(UsuarioTable.email, email)
      .first();

    if (result) return result;

    return Error("Usuário não encontrado");
  } catch (error) {
    console.log(error);
    return Error("Erro ao consultar o usuário");
  }
};
