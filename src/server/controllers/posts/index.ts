import * as create from    './create'
import * as updateById from './updateById'


export const PostsController = {
    ...create,
    ...updateById
}