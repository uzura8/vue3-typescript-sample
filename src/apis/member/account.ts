import type { AxiosResponse, AxiosError } from 'axios'
import type { User, UserFormVals } from '@/types/User'
import { client, getRequestOption } from '@/apis/client'

class MemberAccountApi {
  getOne(token: string | null = null): Promise<User> {
    const uri = 'member/account'
    const options = getRequestOption(uri, 'get', null, token)
    return new Promise((resolve, reject) => {
      client(options)
        .then((res: AxiosResponse<User>) => {
          resolve(res.data)
        })
        .catch((err: AxiosError<{ error: string }>) => {
          reject(err)
        })
    })
  }

  checkExistsUsername(username: string, token: string | null = null): Promise<void> {
    const uri = `member/account/${username}`
    const options = getRequestOption(uri, 'head', null, token)
    return new Promise((resolve, reject) => {
      client(options)
        .then(() => {
          resolve()
        })
        .catch((err: AxiosError<{ error: string }>) => {
          reject(err)
        })
    })
  }

  save(vals: UserFormVals, token: string | null = null): Promise<User> {
    const uri = 'member/account'
    const options = getRequestOption(uri, 'post', null, token)
    return new Promise((resolve, reject) => {
      client
        .post(uri, vals, options)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err))
    })
  }

  delete(token: string | null = null): Promise<User> {
    const uri = 'member/account'
    const options = getRequestOption(uri, 'delete', null, token)
    return new Promise((resolve, reject) => {
      client
        .delete(uri, options)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err))
    })
  }
}

export default new MemberAccountApi()
