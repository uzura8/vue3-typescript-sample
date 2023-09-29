import type { MediaType } from '@/types/Media'
import config from '@/configs/config.json'
import { getExtensionByMimetype } from '@/utils/media'

export function mediaUrl(
  prefix: string,
  type: MediaType,
  fileId: string,
  mimeType: string,
  size = 'raw'
): string {
  const ext = getExtensionByMimetype(mimeType)
  const pathItems = [config.media.url, prefix]
  if (type === 'image') {
    const fileName = `${size}.${ext}`
    pathItems.push('images', fileId, fileName)
  } else {
    const fileName = `${fileId}.${ext}`
    pathItems.push('docs', fileName)
  }
  return pathItems.join('/')
}

export function assetUrl(path: string): string {
  const items = [path]
  items.unshift(config.media.url)
  return items.join('/')
}

export function getUploadConfigs() {
  return {
    acceptMimeType: 'image/png,image/gif,image/jpeg',
    maxFileSize: 1024 * 1024 * 10
  }
}

export function convFirebaseErrorCodeToI18nKey(code: string, method = ''): string {
  let i18nKey = ''
  switch (code) {
    //case 'auth/cancelled-popup-request':
    //case 'auth/popup-closed-by-user':
    //   return null;
    case 'auth/email-already-in-use':
      if (method === 'signup') {
        i18nKey = 'msg.emailIsAlredyInUse'
      } else {
        i18nKey = 'msg.emailOrPasswordsDoNotMatchOurRecords'
      }
      break
    case 'auth/invalid-email':
      i18nKey = 'msg.emailIsNotValid'
      break
    case 'auth/user-disabled':
      i18nKey = 'msg.serviceUnavailable'
      break
    case 'auth/user-not-found':
      i18nKey = 'msg.emailOrPasswordsDoNotMatchOurRecords'
      break
    case 'auth/user-mismatch':
      if (method === 'signin/popup') {
        return '認証されているユーザーと異なるアカウントが選択されました'
      } else {
        i18nKey = 'msg["Email or passwords do not match our records"]'
      }
      break
    case 'auth/weak-password':
      i18nKey = 'msg["Password must be at least 6 characters"]'
      break
    case 'auth/wrong-password':
      i18nKey = 'msg.emailOrPasswordsDoNotMatchOurRecords'
      break
    case 'auth/credential-already-in-use':
      i18nKey = 'msg.credentialAlreadyInUse'
      break
    //case 'auth/popup-blocked':
    //  return '認証ポップアップがブロックされました。ポップアップブロックをご利用の場合は設定を解除してください';
    //case 'auth/operation-not-supported-in-this-environment':
    //case 'auth/auth-domain-config-required':
    //case 'auth/operation-not-allowed':
    //case 'auth/unauthorized-domain':
    //  return '現在この認証方法はご利用頂けません';
    //case 'auth/requires-recent-login':
    //  return '認証の有効期限が切れています';
    default:
      if (method === 'signin') {
        i18nKey = 'msg.signInFailed'
      } else {
        i18nKey = 'msg.errorOccurred'
      }
  }
  return i18nKey
}
