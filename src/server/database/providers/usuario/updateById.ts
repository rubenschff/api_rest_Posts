import {passwordCrypto} from "../../../shared/services";
import {Tables, UsuarioTable} from "../../ETableNames";
import {Knex} from "../../knex";
import {IUsuario} from "../../models";

export async function updateById (id: number, usuario: Omit<IUsuario, "id">): Promise<IUsuario | Error>  {

  try {
    if(usuario.password){
      usuario.password = await passwordCrypto.hashPassword(usuario.password!);
    }

    const result:IUsuario = await Knex(Tables.usuario)
      .update(usuario)
      .where(UsuarioTable.id, id)
        .returning<IUsuario>([
            UsuarioTable.id,
            UsuarioTable.name,
            UsuarioTable.email,
            UsuarioTable.password
        ]);

    if (typeof result === 'object'){
      return result
    }

    return Error("Ocorreu um erro ao atualizar o usuário");
    
  } catch (error) {
    console.log(error);
    return Error("Ocorreu um erro ao atualizar o usuário");
  }
};
