import type { User, UserFormVals } from '@/types/User'
import { client, getRequestOption } from '@/apis/client'

class MemberProfileApi {
  save(vals: UserFormVals, token: string | null = null): Promise<User> {
    const uri = 'member/profile'
    const options = getRequestOption(uri, 'post', null, token)
    return new Promise((resolve, reject) => {
      client
        .post(uri, vals, options)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err))
    })
  }

  uploadImage(
    type: 'profile' | 'cover',
    fileInput: File,
    token: string | null = null
  ): Promise<string> {
    let uri = ''
    if (type === 'profile') {
      uri = 'member/profile/images/profile'
    } else {
      uri = 'member/profile/images/cover'
    }
    const options = getRequestOption(uri, 'post', null, token)

    const formData = new FormData()
    formData.append('file', fileInput)
    options.data = formData
    if (!options.headers) options.headers = {}
    options.headers['Content-Type'] = 'multipart/form-data'
    console.log(options)

    return new Promise((resolve, reject) => {
      client
        .request(options)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err))
    })
  }

  deleteImage(type: 'profile' | 'cover', token: string | null = null): Promise<void> {
    let uri = ''
    if (type === 'profile') {
      uri = 'member/profile/images/profile'
    } else {
      uri = 'member/profile/images/cover'
    }
    const options = getRequestOption(uri, 'delete', null, token)
    return new Promise((resolve, reject) => {
      client
        .delete(uri, options)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err))
    })
  }
}

export default new MemberProfileApi()
