import { ActionArgs, LoaderArgs, json, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useNavigation, type V2_MetaFunction } from '@remix-run/react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '~/components'
import { IconArrowBack, IconLoading } from '~/icons'
import { getUser, login, register } from '~/lib/db.server'
import { CustomInput } from '~/templates'
import { validateAuthForm } from '~/utils'

export const meta: V2_MetaFunction = () => [
  { title: 'Auth | Pheedback', description: 'Sign In or Create an account to get started!' },
]

export async function loader({ request }: LoaderArgs) {
  // redirect user to home if already logged in
  const user = await getUser(request)
  if (user) return redirect('/')
  return {}
}

export async function action({ request }: ActionArgs) {
  const formData = Object.fromEntries(await request.formData())

  // validate form and return error if invalid
  const errors = validateAuthForm(formData)
  if (errors) return json(errors, { status: 400 })

  // otherwise, handle the form submission
  switch (formData?.loginType) {
    case 'login':
      return login(formData)
    case 'register':
      return register(formData)
    default:
      return json({ fields: formData, formError: `Invalid form submission` }, { status: 400 })
  }
}

export default function AuthRoute() {
  const actionData = useActionData()
  const navigation = useNavigation()

  const formRef = useRef<HTMLFormElement>(null)
  const [loginType, setLoginType] = useState<'login' | 'register'>('login')

  const toggleLoginType = () => setLoginType((prev) => (prev === 'login' ? 'register' : 'login'))

  const isFormSubmitting = navigation.state === 'submitting'

  useEffect(() => {
    // reset form on transition
    formRef.current?.reset()
  }, [loginType])

  return (
    <div className="min-w-screen relative bg-gradient-to-b from-[#94bbe9] to-[#eeaeca] dark:from-[#285486] dark:to-[#a75c7c] md:bg-gradient-to-r">
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
          <div className="w-full max-w-lg rounded-xl bg-gray-50 p-8 shadow-2xl animate-in fade-in zoom-in duration-300 dark:bg-gray-800 dark:text-gray-300 md:p-12">
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
