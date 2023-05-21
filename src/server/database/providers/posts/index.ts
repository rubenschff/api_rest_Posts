import * as create from './create'
import * as updateById from './updateById'


export const PostsProvider = {
    ...create,
    ...updateById
}