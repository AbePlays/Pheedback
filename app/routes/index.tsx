import type { Post, User } from '@prisma/client'
import type { LoaderFunction, MetaFunction } from 'remix'
import { Form, Link, useLoaderData, useTransition } from 'remix'

import Card from '~/components/Card'
import { categoryOptions, sortByEnum } from '~/data'
import { getUser } from '~/lib/db.server'
import { db } from '~/utils'

type TLoaderData = {
  category: string
  sortBy: string
  posts: Post[]
  user: User
}

export const meta: MetaFunction = () => {
  return {
    title: 'Home | Pheedback',
    description: 'Welcome to Pheedback!',
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  //TODO: Fetch user data and posts in parallel, export logic to a function
  const user = await getUser(request)

  const url = new URL(request.url)
  const category = url.searchParams.get('category')
  const sortBy = url.searchParams.get('sortBy')

  let posts = []
  let order: 'asc' | 'desc' = 'desc'

  if (sortBy && sortBy === sortByEnum.LEAST_UPVOTES) {
    order = 'asc'
  }

  if (category && sortBy) {
    posts = await db.post.findMany({
      where: { category },
      orderBy: { upvotes: order },
    })
  } else if (category) {
    posts = await db.post.findMany({
      where: { category },
      orderBy: { createdAt: 'desc' },
    })
  } else if (sortBy) {
    posts = await db.post.findMany({ orderBy: { upvotes: order } })
  } else {
    posts = await db.post.findMany({ orderBy: { createdAt: 'desc' } })
  }

  return { category, sortBy, posts, user }
}

const IndexRoute = () => {
  const loaderData = useLoaderData<TLoaderData>()
  const transition = useTransition()

  const isFormSubmitting = transition.submission
  const showPosts =
    loaderData.posts &&
    Array.isArray(loaderData.posts) &&
    loaderData.posts.length > 0

  return (
    <div>
      <main className="text-center">
        {/* User Info */}
        {loaderData?.user ? (
          <div>
            <h2>{loaderData.user?.fullname}</h2>
            <span>@{loaderData.user?.username}</span>
            <Form action="/logout" method="post">
              <button type="submit">Logout</button>
            </Form>
          </div>
        ) : null}

        {/* Sort By Form */}
        <Card>
          <Form>
            <input
              type="hidden"
              name="category"
              value={loaderData?.category || ''}
            />
            {Object.values(sortByEnum).map((sortBy) => (
              <button
                className="block"
                disabled={Boolean(isFormSubmitting)}
                key={sortBy}
                name="sortBy"
                type="submit"
                value={sortBy}
              >
                {sortBy}
              </button>
            ))}
          </Form>
        </Card>

        {/* Category Form */}
        <Card>
          <Form>
            <input
              type="hidden"
              name="sortBy"
              value={loaderData?.sortBy || ''}
            />
            <button
              className="block"
              disabled={Boolean(isFormSubmitting)}
              name="category"
              type="submit"
              value=""
            >
              All
            </button>
            {categoryOptions.map((category) => (
              <button
                className="block"
                disabled={Boolean(isFormSubmitting)}
                key={category}
                name="category"
                type="submit"
                value={category}
              >
                {category}
              </button>
            ))}
          </Form>
        </Card>

        {/* Posts */}
        {showPosts ? (
          <ul>
            {loaderData.posts.map((post, index) => {
              return (
                <li key={post.id}>
                  <Link to={`/post/${post.id}`}>
                    <h2>{`${index + 1}. ${post.title}`}</h2>
                    <p>{post.detail}</p>
                    <p>{post.category}</p>
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <p>No posts available</p>
        )}
      </main>
    </div>
  )
}

export default IndexRoute
