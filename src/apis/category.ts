import type { AxiosResponse, AxiosError } from 'axios'
import type { Category } from '@/types/Category'
import type { ApiParams } from '@/types/Common'
import { client, getRequestOption } from './client'

class CategoryApi {
  getOneBySlug(
    contentDiv: string,
    slug: string,
    params: ApiParams | null = null,
    token = ''
  ): Promise<Category> {
    const uri = `categories/${contentDiv}/${slug}`
    const options = getRequestOption(uri, 'get', params, token)
    return new Promise((resolve, reject) => {
      client(options)
        .then((res: AxiosResponse<Category>) => {
          resolve(res.data)
        })
        .catch((err: AxiosError<{ error: string }>) => {
          reject(err)
        })
    })
  }
}

export default new CategoryApi()
