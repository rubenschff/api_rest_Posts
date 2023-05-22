import * as create from    './create'
import * as updateById from './updateById'
import * as deleteById from './delete'
import * as getAll from './getAll'


export const PostsController = {
    ...create,
    ...updateById,
    ...deleteById,
    ...getAll
}