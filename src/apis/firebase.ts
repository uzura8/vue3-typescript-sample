import type { Auth, User, UserCredential, AuthProvider, ActionCodeInfo } from '@firebase/auth'
import {
  getAuth,
  onAuthStateChanged,
  //getIdToken,
  updateProfile,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  applyActionCode,
  checkActionCode,
  verifyPasswordResetCode,
  confirmPasswordReset,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  // reauthenticateWithCredential,
  // updateEmail,
  signOut
} from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import firebaseConfig from '@/configs/firebase-app-sdk-config.json'

const app = initializeApp(firebaseConfig)

type UpdateProfile = {
  displayName?: string | null
  photoURL?: string | null
}

class FirebaseApi {
  getCurrentUser(): User | null {
    const auth: Auth = getAuth(app)
    return auth.currentUser
  }

  onAuthStateChanged(): Promise<User | null> {
    return new Promise((resolve, reject) => {
      try {
        const auth: Auth = getAuth(app)
        onAuthStateChanged(auth, (user) => {
          resolve(user)
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  //async getIdToken(): Promise<string | null> {
  //  const auth: Auth = getAuth(app)
  //  if (auth.currentUser) {
  //    const idToken = await auth.currentUser.getIdToken()
  //    return idToken
  //  }
  //  return null
  //}

  updateProfile(profile: UpdateProfile): Promise<User> {
    return new Promise((resolve, reject) => {
      const auth: Auth = getAuth(app)
      if (auth.currentUser) {
        updateProfile(auth.currentUser, profile)
          .then(() => {
            if (auth.currentUser) {
              resolve(auth.currentUser)
            } else {
              reject(new Error('Unable to fetch updated user after profile update.'))
            }
          })
          .catch((err) => {
            reject(err)
          })
      } else {
        reject(new Error('No user is currently signed in.'))
      }
    })
  }

  signIn(email: string, password: string): Promise<UserCredential> {
    return new Promise((resolve, reject) => {
      const auth: Auth = getAuth(app)
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential: UserCredential) => {
          resolve(userCredential)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  signInWithOAuthGoogle(): Promise<UserCredential> {
    return new Promise((resolve, reject) => {
      const auth: Auth = getAuth(app)
      const provider: AuthProvider = new GoogleAuthProvider()
      signInWithPopup(auth, provider)
        .then((userCredential: UserCredential) => {
          resolve(userCredential)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  signUp(email: string, password: string): Promise<UserCredential> {
    return new Promise((resolve, reject) => {
      const auth: Auth = getAuth(app)
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential: UserCredential) => {
          resolve(userCredential)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  sendEmailVerification(): Promise<void> {
    return new Promise((resolve, reject) => {
      const auth: Auth = getAuth(app)
      if (!auth.currentUser) {
        reject(new Error('No user is currently signed in.'))
        return
      }
      sendEmailVerification(auth.currentUser)
        .then(() => resolve())
        .catch((err) => reject(err))
    })
  }

  sendPasswordResetEmail(email: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const auth: Auth = getAuth(app)
      sendPasswordResetEmail(auth, email)
        .then(() => resolve())
        .catch((err) => reject(err))
    })
  }

  applyActionCode(actionCode: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const auth: Auth = getAuth(app)
      applyActionCode(auth, actionCode)
        .then(() => resolve())
        .catch((err) => reject(err))
    })
  }

  checkActionCode(actionCode: string): Promise<ActionCodeInfo> {
    return new Promise((resolve, reject) => {
      const auth: Auth = getAuth(app)
      checkActionCode(auth, actionCode)
        .then((res) => resolve(res))
        .catch((err) => reject(err))
    })
  }

  verifyPasswordResetCode(actionCode: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const auth: Auth = getAuth(app)
      verifyPasswordResetCode(auth, actionCode)
        .then((email) => resolve(email))
        .catch((err) => reject(err))
    })
  }

  confirmPasswordReset(actionCode: string, newPassword: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const auth: Auth = getAuth(app)
      confirmPasswordReset(auth, actionCode, newPassword)
        .then((res) => resolve(res))
        .catch((err) => reject(err))
    })
  }

  // reauthenticateWithCredential(email: string): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     const auth: Auth = getAuth(app)
  //     if (!auth.currentUser) {
  //       reject(new Error('No user is currently signed in.'))
  //       return
  //     }
  //     reauthenticateWithCredential(auth.currentUser, email)
  //       .then(() => resolve())
  //       .catch((err) => reject(err))
  //   })
  // }

  // updateEmail(email: string): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     const auth: Auth = getAuth(app)
  //     if (!auth.currentUser) {
  //       reject(new Error('No user is currently signed in.'))
  //       return
  //     }
  //     updateEmail(auth.currentUser, email)
  //       .then(() => resolve())
  //       .catch((err) => reject(err))
  //   })
  // }

  signOut(): Promise<null> {
    return new Promise((resolve, reject) => {
      const auth: Auth = getAuth(app)
      signOut(auth)
        .then(() => resolve(null))
        .catch((err) => reject(err))
    })
  }
}

export default new FirebaseApi()
