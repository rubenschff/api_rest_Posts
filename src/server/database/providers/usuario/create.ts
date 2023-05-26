import {IUsuario} from "../../models";
import  { Knex} from "../../knex";
import {Tables, UsuarioTable} from "../../ETableNames";
import { passwordCrypto } from "../../../shared/services";
import {JWTservice} from "../../../shared/services/JWTservice";



export async function create (usuario: Omit<IUsuario, 'id'>): Promise<IUsuario| Error> {
    try {
        const hashedPassword = await passwordCrypto.hashPassword(usuario.password!);
        const user = await Knex(Tables.usuario)
            .insert({...usuario, password: hashedPassword})
            .returning<IUsuario[]>([
                UsuarioTable.name,
                UsuarioTable.email,
                UsuarioTable.password,
            ]).catch(e =>{
                console.log(e.message)
                return Error(e)
        })

        if (user instanceof Error){
            return user
        }

        const token = JWTservice.sign({uid: user[0].id})
        return {...user[0],token: token};

    }  catch (e) {
        console.log(e);
        return Error('Erro ao inserir registro');
    }
};