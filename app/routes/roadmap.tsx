import type { Comment, Post, Upvote, User } from '@prisma/client'
import * as Tabs from '@radix-ui/react-tabs'
import { type LoaderFunction, type SerializeFrom } from '@remix-run/node'
import { Link, type V2_MetaFunction, useLoaderData } from '@remix-run/react'

import { Card } from '~/components'
import { TabContent } from '~/containers'
import { IconArrowBack } from '~/icons'
import { getUser } from '~/lib/db.server'
import { db } from '~/utils'

interface ILoaderData {
  inProgress: SerializeFrom<(Post & { comments: Comment[]; upvotes: Upvote[] })[]>
  live: SerializeFrom<(Post & { comments: Comment[]; upvotes: Upvote[] })[]>
  planned: SerializeFrom<(Post & { comments: Comment[]; upvotes: Upvote[] })[]>
  user: User
}

export const meta: V2_MetaFunction = () => [
  { title: 'Roadmap | Pheedback', description: 'Checkout the roadmap for Pheedback' },
]

export const loader: LoaderFunction = async ({ request }) => {
  // TODO: parallelize this
  const user = await getUser(request)

  const posts = await db.post.findMany({
    where: { status: { not: 'Suggestion' } },
    include: { comments: true, upvotes: true },
  })

  const inProgress: (Post & { comments: Comment[] })[] = []
  const live: (Post & { comments: Comment[] })[] = []
  const planned: (Post & { comments: Comment[] })[] = []

  posts.forEach((post) => {
    if (post.status === 'Live') {
      live.push(post)
    } else if (post.status === 'In Progress') {
      inProgress.push(post)
    } else if (post.status === 'Planned') {
      planned.push(post)
    }
  })

  return { inProgress, live, planned, user }
}

export default function RoadmapRoute() {
  const { inProgress, live, planned, user } = useLoaderData<ILoaderData>()

  return (
    <div className="mx-auto mt-0 max-w-screen-xl md:mt-8 md:px-4">
      <Card className="flex items-center justify-between gap-2 rounded-none border-0 bg-gray-700 p-4 text-sm text-white dark:border dark:border-gray-600 sm:p-6 sm:text-base md:rounded-lg">
        <div className="space-y-2">
          <Link className="group flex items-center gap-2 font-medium" to="/">
            <IconArrowBack className="transition-all duration-300 group-hover:-translate-x-1" />
            Go Back
          </Link>
          <h2 className="text-xl font-bold">Roadmap</h2>
        </div>
        <Link
          className="link-btn px-4 py-3 focus:ring-white focus:ring-offset-gray-700"
          prefetch="intent"
          to="/post/new"
        >
          + Add Feedback
        </Link>
      </Card>
      {/* For mobile devices */}
      <Tabs.Root className="mx-4 mt-6 md:hidden" defaultValue="planned" orientation="horizontal">
        <Tabs.List aria-label="Feedback Status" className="flex justify-between gap-2">
          <Tabs.Trigger className="tab-btn border-b-4 border-gray-400 font-bold dark:text-gray-200" value="planned">
            Planned ({planned.length})
          </Tabs.Trigger>
          <Tabs.Trigger className="tab-btn border-b-4 border-gray-400 font-bold dark:text-gray-200" value="inProgress">
            In-Progress ({inProgress.length})
          </Tabs.Trigger>
          <Tabs.Trigger className="tab-btn border-b-4 border-gray-400 font-bold dark:text-gray-200" value="live">
            Live ({live.length})
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="planned">
          <TabContent content={planned} desc="Ideas prioritized for research" user={user} />
        </Tabs.Content>
        <Tabs.Content value="inProgress">
          <TabContent content={inProgress} desc="Currently being developed" user={user} />
        </Tabs.Content>
        <Tabs.Content value="live">
          <TabContent content={live} desc="Released features" user={user} />
        </Tabs.Content>
      </Tabs.Root>
      {/* For desktop */}
      <div className="my-8 hidden md:flex md:gap-4 lg:gap-8">
        <div className="flex-1">
          <TabContent
            content={planned}
            desc="Ideas prioritized for research"
            title={`Planned (${planned.length})`}
            user={user}
          />
        </div>
        <div className="flex-1">
          <TabContent
            content={inProgress}
            desc="Currently being developed"
            title={`In-Progress (${inProgress.length})`}
            user={user}
          />
        </div>
        <div className="flex-1">
          <TabContent content={live} desc="Released features" title={`Live (${live.length})`} user={user} />
        </div>
      </div>
    </div>
  )
}
