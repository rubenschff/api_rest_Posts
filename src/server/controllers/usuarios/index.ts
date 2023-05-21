import * as create from './create'
import * as getById from './getById'
import * as updateById from './updateById'
import * as deleteById from './deleteById'
import * as login from './login'


export const UsuariosController = {
    ...create,
    ...getById,
    ...updateById,
    ...deleteById,
    ...login,
}