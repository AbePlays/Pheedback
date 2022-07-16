import { assertString } from './assertions'

export default function validateAuthForm(data: Record<string, FormDataEntryValue>) {
  try {
    if (data?.loginType === 'login') {
      // Validate login form
      const { password, username } = data
      if (!username || !password) {
        return { formError: 'Please fill out all the fields' }
      }

      assertString(password)
      assertString(username)

      const fields = { password, username }

      const fieldErrors = {
        password: validatePassword(password),
        username: validateUsername(username),
      }

      if (Object.values(fieldErrors).some(Boolean)) {
        return { fieldErrors, fields }
      }
    } else if (data?.loginType === 'register') {
      // Validate register form
      const { email, fullname, password, username } = data
      if (!username || !password || !fullname || !email) {
        return { formError: 'Please fill out all the fields' }
      }
      const fields = { username, password, fullname, email }

      assertString(email)
      assertString(fullname)
      assertString(password)
      assertString(username)

      const fieldErrors = {
        email: validateEmail(email),
        fullname: validateFullname(fullname),
        password: validatePassword(password),
        username: validateUsername(username),
      }

      if (Object.values(fieldErrors).some(Boolean)) {
        return { fieldErrors, fields }
      }
    }
  } catch (e) {
    if (e instanceof Error) {
      return { formError: e.message }
    }
    return { formError: 'Something went wrong' }
  }
}

function validateEmail(email: string) {
  if (typeof email !== 'string' || !email.includes('@')) {
    return 'Please enter a valid email address'
  }
}

function validateFullname(fullname: string) {
  if (typeof fullname !== 'string' || fullname.length < 0) {
    return 'Please enter your full name'
  }
}

function validatePassword(password: string) {
  if (typeof password !== 'string' || password.length < 6) {
    return 'Passwords must be at least 6 characters long'
  }
}

function validateUsername(username: string) {
  if (typeof username !== 'string' || username.length < 3) {
    return 'Username must be at least 3 characters long'
  }
}
