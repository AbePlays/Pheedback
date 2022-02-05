const validateAuthForm = (data: Record<string, unknown>) => {
  if (data?.loginType === 'login') {
    // Validate login form
    if (!data?.username || !data?.password) {
      return { formError: 'Please fill in all fields' }
    }
    const { username, password } = data
    const fields = { username, password }

    const fieldErros = {
      username: validateUsername(username),
      password: validatePassword(password),
    }

    if (Object.values(fieldErros).some(Boolean)) {
      return { fieldErros, fields }
    }
  } else if (data?.loginType === 'register') {
    // Validate register form
    if (!data?.username || !data?.password || !data?.fullname || !data?.email) {
      return { formError: 'Please fill in all fields' }
    }
    const { username, password, fullname, email } = data
    const fields = { username, password, fullname, email }

    const fieldErros = {
      username: validateUsername(username),
      password: validatePassword(password),
      fullname: validateFullname(fullname),
      email: validateEmail(email),
    }

    if (Object.values(fieldErros).some(Boolean)) {
      return { fieldErros, fields }
    }
  }
}

const validateEmail = (email: unknown) => {
  if (typeof email !== 'string' || !email.includes('@')) {
    return 'Please enter a valid email address'
  }
}

const validateFullname = (fullname: unknown) => {
  if (typeof fullname !== 'string' || fullname.length < 0) {
    return 'Please enter your full name'
  }
}

const validatePassword = (password: unknown) => {
  if (typeof password !== 'string' || password.length < 6) {
    return 'Passwords must be at least 6 characters long'
  }
}
const validateUsername = (username: unknown) => {
  if (typeof username !== 'string' || username.length < 3) {
    return 'Username must be at least 3 characters long'
  }
}

export default validateAuthForm
