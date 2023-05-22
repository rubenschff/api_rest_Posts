import { Tables, UsuarioTable} from "../../ETableNames";
import { Knex } from "../../knex";
import { IUsuario } from "../../models";

export async function getById (id: number):Promise<IUsuario|Error>  {
  try {
    const usuario = await Knex(Tables.usuario)
      .select(
          UsuarioTable.id,
          UsuarioTable.name,
          UsuarioTable.email,
          UsuarioTable.password)
      .from(Tables.usuario)
      .where(UsuarioTable.id, id).first()

    if (usuario){
      return usuario
    }

    return Error(usuario)

  } catch (error) {
    console.log(error);
    return Error('Não foi possivel recuperar o registro!');
  }
};
