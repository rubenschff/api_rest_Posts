import * as create from    './create'
import * as updateById from './updateById'
import * as deleteById from './delete'


export const PostsController = {
    ...create,
    ...updateById,
    ...deleteById
}