import bcrypt from 'bcrypt'
import { createCookieSessionStorage, redirect } from 'remix'

import { db } from '~/utils'

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
  throw new Error('SESSION_SECRET not set')
}

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: 'Pheedback-Session',
    secure: true,
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
  },
})

export const register = async (fields: Record<string, unknown>) => {
  const { username, password, fullname, email } = fields
  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    typeof fullname !== 'string' ||
    typeof email !== 'string'
  ) {
    return { fields, formError: `Invalid fields` }
  }
  // Check if username is taken
  const userExists = await db.user.findFirst({ where: { username } })
  if (userExists) {
    return {
      fields,
      formError: `User with username ${username} already exists`,
    }
  }
  // Create a hashed password
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await db.user.create({
    data: { username, passwordHash, fullname, email },
  })
  if (!user) {
    return {
      fields,
      formError: `Something went wrong trying to create a new user.`,
    }
  }
  return createUserSession(user.id, '/')
}

export const login = async (fields: Record<string, unknown>) => {
  const { username, password } = fields
  if (typeof username !== 'string' || typeof password !== 'string') {
    return { fields, formError: `Invalid fields` }
  }
  // Check if user exists
  const user = await db.user.findUnique({ where: { username } })
  if (!user) {
    return { fields, formError: `Username/Password combination is incorrect` }
  }
  // Check if password is correct
  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash)
  if (!isCorrectPassword) {
    return { fields, formError: `Username/Password combination is incorrect` }
  }
  return createUserSession(user.id, '/')
}

export const logout = async (request: Request) => {
  const session = await getSession(request.headers.get('Cookie'))
  return redirect('/auth', {
    headers: { 'Set-Cookie': await destroySession(session) },
  })
}

export async function getUserId(request: Request) {
  const session = await getSession(request.headers.get('Cookie'))
  const userId = session.get('userId')
  if (!userId || typeof userId !== 'string') return null
  return userId
}

export const createUserSession = async (userId: string, redirectTo: string) => {
  const session = await getSession()
  session.set('userId', userId)
  return redirect(redirectTo, {
    headers: { 'Set-Cookie': await commitSession(session) },
  })
}

export const getUser = async (request: Request, config: Record<string, boolean> = {}) => {
  const userId = await getUserId(request)
  if (!userId) return null

  const selecConfig = { ...config, id: true, fullname: true, username: true }

  try {
    const user = await db.user.findUnique({ where: { id: userId }, select: selecConfig })
    return user
  } catch {
    throw logout(request)
  }
}

export const createPost = async (fields: Record<string, unknown>, userId: string) => {
  const { title, category, detail } = fields
  if (typeof title !== 'string' || typeof category !== 'string' || typeof detail !== 'string') {
    return { fields, formError: 'Invalid fields' }
  }

  await db.post.create({ data: { title, category, detail, userId } })

  return redirect('/')
}

export const createComment = async (fields: Record<string, unknown>) => {
  const { comment: content, postId, userId } = fields
  if (typeof content !== 'string' || typeof postId !== 'string' || typeof userId !== 'string') {
    return { fields, formError: 'Invalid fields' }
  }

  return db.comment.create({ data: { content, postId, userId } })
}

export const toggleUpvote = async (fields: Record<string, unknown>) => {
  const { postId, userId } = fields
  if (typeof postId !== 'string' || typeof userId !== 'string') {
    return { fields, formError: `Invalid fields` }
  }
  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) return null

  const post = await db.post.findUnique({ where: { id: postId } })
  if (!post) return null

  let upvote = await db.upvote.findFirst({ where: { postId, userId } })
  if (!upvote) {
    upvote = await db.upvote.create({ data: { postId, userId } })
  } else {
    upvote = await db.upvote.delete({ where: { id: upvote.id } })
  }
  return upvote
}
