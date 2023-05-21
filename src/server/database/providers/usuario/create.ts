import {IUsuario} from "../../models";
import  { Knex} from "../../knex";
import {Tables, UsuarioTable} from "../../ETableNames";
import { passwordCrypto } from "../../../shared/services";
import {JWTservice} from "../../../shared/services/JWTservice";



export const create = async (usuario: Omit<IUsuario, 'id'>): Promise<IUsuario| Error> => {
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

        const accessToken = JWTservice.sign({uid: user[0].id})
        return {...user[0],accessToken: accessToken};

    }  catch (e) {
        console.log(e);
        return Error('Erro ao inserir registro');
    }
};