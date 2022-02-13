import type { ActionFunction, MetaFunction } from 'remix'
import { useState } from 'react'
import { Form, Link, useActionData, useTransition } from 'remix'

import { Button, Input } from '~/components'
import { IconArrowBack, IconLoading } from '~/icons'
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
    <div className="min-w-screen relative flex min-h-screen flex-col bg-gradient-to-r from-[rgba(148,187,233,1)] to-[rgba(238,174,202,1)] p-4">
      <Link
        className="group ml-0 mt-0 flex items-center justify-start gap-2 text-white sm:ml-4 sm:mt-4"
        to="/"
      >
        <IconArrowBack classes="group-hover:-translate-x-1 transition-all duration-300" />
        Go Back
      </Link>
      <div className="flex h-full w-full flex-1 items-center justify-center">
        <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-2xl md:p-12">
          <Form method="post" replace>
            <input type="hidden" name="loginType" value={loginType} />
            {loginType === 'register' ? (
              <>
                <label className="font-bold" htmlFor="fullname-input">
                  Full Name
                </label>
                <Input
                  classes="my-4"
                  type="text"
                  id="fullname-input"
                  name="fullname"
                  defaultValue={actionData?.fields?.fullname}
                  aria-invalid={Boolean(actionData?.fieldErrors?.fullname)}
                  aria-describedby={
                    actionData?.fieldErrors?.fullname
                      ? 'fullname-error'
                      : undefined
                  }
                />
                {actionData?.fieldErros?.fullname ? (
                  <p
                    className="mb-4 text-sm text-red-600"
                    id="fullname-error"
                    role="alert"
                  >
                    {actionData.fieldErros.fullname}
                  </p>
                ) : null}
              </>
            ) : null}
            <label className="font-bold" htmlFor="username-input">
              User Name
            </label>
            <Input
              classes="my-4"
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
              <p
                className="mb-4 text-sm text-red-600"
                id="username-error"
                role="alert"
              >
                {actionData.fieldErros.username}
              </p>
            ) : null}
            {loginType === 'register' ? (
              <>
                <label className="font-bold" htmlFor="email-input">
                  Email
                </label>
                <Input
                  classes="my-4"
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
                  <p
                    className="mb-4 text-sm text-red-600"
                    id="email-error"
                    role="alert"
                  >
                    {actionData.fieldErros.email}
                  </p>
                ) : null}
              </>
            ) : null}
            <label className="font-bold" htmlFor="password-input">
              Password
            </label>
            <Input
              classes="my-4"
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
              <p
                className="mb-4 text-sm text-red-600"
                id="password-error"
                role="alert"
              >
                {actionData.fieldErros.password}
              </p>
            ) : null}
            {actionData?.formError ? (
              <p className="text-sm text-red-600" role="alert">
                {actionData.formError}
              </p>
            ) : null}
            <Button classes="mt-4" type="submit">
              {isFormSubmitting ? (
                <>
                  <IconLoading classes="mr-2" />
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </Form>
          {loginType === 'login' ? (
            <p className="md:text-md mt-4 text-center text-sm">
              Don&apos;t have an account?&nbsp;
              <Button onClick={toggleLoginType} type="button" variant="link">
                Sign up&nbsp;
              </Button>
              instead?
            </p>
          ) : (
            <p className="md:text-md mt-4 text-center text-sm">
              Already have an account?&nbsp;
              <Button type="button" onClick={toggleLoginType} variant="link">
                Log in&nbsp;
              </Button>
              instead?
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthRoute
