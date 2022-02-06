import { useState } from 'react'
import type { ActionFunction, MetaFunction } from 'remix'
import { Form, useActionData, useTransition } from 'remix'

import { login, register } from '~/lib/db.server'
import { validateAuthForm } from '~/utils'

export const meta: MetaFunction = () => {
  return {
    title: 'Auth | Pheedback',
    description: 'Sign In or Create an account to get started!',
  }
}

export const action: ActionFunction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData())

  // validate form and return error if invalid
  const errors = validateAuthForm(formData)
  if (errors) return errors

  // otherwise, handle the form submission
  switch (formData?.loginType) {
    case 'login':
      return login(formData)
    case 'register':
      return register(formData)
    default:
      return { fields: { ...formData }, formError: `Login type invalid` }
  }
}

const AuthRoute = () => {
  const actionData = useActionData()
  const transition = useTransition()

  const [loginType, setLoginType] = useState<'login' | 'register'>('login')

  const toggleLoginType = () =>
    setLoginType((prev) => (prev === 'login' ? 'register' : 'login'))

  const isFormSubmitting = transition.submission

  return (
    <div>
      <Form method="post">
        <input type="hidden" name="loginType" value={loginType} />
        {loginType === 'register' ? (
          <>
            <label htmlFor="fullname-input">Full Name</label>
            <input
              className="block border"
              type="text"
              id="fullname-input"
              name="fullname"
              defaultValue={actionData?.fields?.fullname}
              aria-invalid={Boolean(actionData?.fieldErrors?.fullname)}
              aria-describedby={
                actionData?.fieldErrors?.fullname ? 'fullname-error' : undefined
              }
            />
            {actionData?.fieldErros?.fullname ? (
              <p id="fullname-error" role="alert">
                {actionData.fieldErros.fullname}
              </p>
            ) : null}
          </>
        ) : null}
        <label htmlFor="username-input">User Name</label>
        <input
          className="block border"
          type="text"
          id="username-input"
          name="username"
          defaultValue={actionData?.fields?.username}
          aria-invalid={Boolean(actionData?.fieldErrors?.username)}
          aria-describedby={
            actionData?.fieldErrors?.username ? 'username-error' : undefined
          }
        />
        {actionData?.fieldErros?.username ? (
          <p id="username-error" role="alert">
            {actionData.fieldErros.username}
          </p>
        ) : null}
        {loginType === 'register' ? (
          <>
            <label htmlFor="email-input">Email</label>
            <input
              className="block border"
              type="email"
              id="email-input"
              name="email"
              defaultValue={actionData?.fields?.email}
              aria-invalid={Boolean(actionData?.fieldErrors?.email)}
              aria-describedby={
                actionData?.fieldErrors?.email ? 'email-error' : undefined
              }
            />
            {actionData?.fieldErros?.email ? (
              <p id="email-error" role="alert">
                {actionData.fieldErros.email}
              </p>
            ) : null}
          </>
        ) : null}
        <label htmlFor="password-input">Password</label>
        <input
          className="block border"
          type="password"
          id="password-input"
          name="password"
          defaultValue={actionData?.fields?.password}
          aria-invalid={Boolean(actionData?.fieldErrors?.password)}
          aria-describedby={
            actionData?.fieldErrors?.password ? 'password-error' : undefined
          }
        />
        {actionData?.fieldErros?.password ? (
          <p id="password-error" role="alert">
            {actionData.fieldErros.password}
          </p>
        ) : null}
        {actionData?.formError ? (
          <p role="alert">{actionData.formError}</p>
        ) : null}
        <button type="submit">
          {isFormSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </Form>
      {loginType === 'login' ? (
        <p>
          Don&apos;t have an account?&nbsp;
          <button onClick={toggleLoginType}>Sign up&nbsp;</button>instead?
        </p>
      ) : (
        <p>
          Already have an account?&nbsp;
          <button onClick={toggleLoginType}>Log in&nbsp;</button>instead?
        </p>
      )}
    </div>
  )
}

export default AuthRoute
