import type { ActionFunction, LoaderFunction, MetaFunction } from 'remix'
import { Form, Link, redirect, useActionData, useTransition } from 'remix'
import { useEffect, useRef, useState } from 'react'

import { Button } from '~/components'
import { IconArrowBack, IconLoading } from '~/icons'
import { getUser, login, register } from '~/lib/db.server'
import { CustomInput } from '~/templates'
import { validateAuthForm } from '~/utils'

export const meta: MetaFunction = () => {
  return {
    title: 'Auth | Pheedback',
    description: 'Sign In or Create an account to get started!',
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  // redirect user to home if already logged in
  const user = await getUser(request)
  if (user) return redirect('/')
  return {}
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

export default function AuthRoute() {
  const actionData = useActionData()
  const transition = useTransition()

  const formRef = useRef<HTMLFormElement>(null)
  const [loginType, setLoginType] = useState<'login' | 'register'>('login')

  const toggleLoginType = () => setLoginType((prev) => (prev === 'login' ? 'register' : 'login'))

  const isFormSubmitting = transition.submission

  useEffect(() => {
    // reset form on transition
    formRef.current?.reset()
  }, [loginType])

  return (
    <div className="min-w-screen relative bg-gradient-to-b from-[rgba(148,187,233,1)] to-[rgba(238,174,202,1)] md:bg-gradient-to-r">
      <main className="mx-auto flex min-h-screen max-w-screen-xl flex-col p-4">
        <Link
          className="group ml-0 mt-0 flex w-max items-center justify-start gap-2 text-white sm:ml-4 sm:mt-4"
          prefetch="intent"
          to="/"
        >
          <IconArrowBack className="transition-all duration-300 group-hover:-translate-x-1" />
          Go Back
        </Link>
        <div className="flex h-full w-full flex-1 items-center justify-center">
          <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-2xl duration-300 animate-in fade-in zoom-in md:p-12">
            <Form className="space-y-4" method="post" ref={formRef} replace>
              {loginType === 'register' ? (
                <CustomInput
                  defaultValue={actionData?.fields?.fullname}
                  error={actionData?.fieldErrors?.fullname}
                  id="fullname"
                  label="Full Name"
                />
              ) : null}
              <CustomInput
                defaultValue={actionData?.fields?.username}
                error={actionData?.fieldErrors?.username}
                id="username"
                label="Username"
              />
              {loginType === 'register' ? (
                <CustomInput
                  defaultValue={actionData?.fields?.email}
                  error={actionData?.fieldErrors?.email}
                  id="email"
                  label="Email"
                  type="email"
                />
              ) : null}
              <CustomInput
                defaultValue={actionData?.fields?.password}
                error={actionData?.fieldErrors?.password}
                id="password"
                label="Password"
                type="password"
              />
              {actionData?.formError ? (
                <p className="text-sm text-red-600" role="alert">
                  {actionData.formError}
                </p>
              ) : null}
              <input type="hidden" name="loginType" value={loginType} />
              <Button className="!mt-6">
                {isFormSubmitting ? (
                  <>
                    <IconLoading className="mr-2" />
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
                <Button onClick={toggleLoginType} variant="link">
                  Sign up&nbsp;
                </Button>
                instead?
              </p>
            ) : (
              <p className="md:text-md mt-4 text-center text-sm">
                Already have an account?&nbsp;
                <Button onClick={toggleLoginType} variant="link">
                  Log in&nbsp;
                </Button>
                instead?
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
