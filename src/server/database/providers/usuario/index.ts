import * as create from './create';
import * as deleteById from "./deleteById";
import * as getById  from './getById';
import * as updateById  from './updateById';
import * as getByNickName from './getByEmail';

export const UsuarioProvider = {
    ...create,
    ...deleteById,
    ...getById,
    ...updateById,
    ...getByNickName,
}