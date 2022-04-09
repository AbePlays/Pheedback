import type { Post, Comment } from '@prisma/client'
import { LoaderFunction, MetaFunction, useLoaderData } from 'remix'
import { Link } from 'remix'
import * as Tabs from '@radix-ui/react-tabs'

import { Card } from '~/components'
import { TabContent } from '~/containers'
import { IconArrowBack } from '~/icons'
import { db } from '~/utils'

interface ILoaderData {
  inProgress: (Post & { comment: Comment[] })[]
  live: (Post & { comment: Comment[] })[]
  planned: (Post & { comment: Comment[] })[]
}

export const meta: MetaFunction = () => {
  return {
    title: 'Roadmap | Pheedback',
    description: 'Checkout the roadmap for Pheedback',
  }
}

export const loader: LoaderFunction = async () => {
  const posts = await db.post.findMany({ where: { status: { not: 'Suggestion' } }, include: { comment: true } })

  const inProgress: (Post & { comment: Comment[] })[] = []
  const live: (Post & { comment: Comment[] })[] = []
  const planned: (Post & { comment: Comment[] })[] = []

  posts.forEach((post) => {
    if (post.status === 'Live') {
      live.push(post)
    } else if (post.status === 'In Progress') {
      inProgress.push(post)
    } else if (post.status === 'Planned') {
      planned.push(post)
    }
  })

  return { inProgress, live, planned }
}

const RoadmapRoute = () => {
  const { inProgress, live, planned } = useLoaderData<ILoaderData>()

  return (
    <div className="mx-auto mt-0 max-w-screen-xl md:mt-8 md:px-4">
      <Card className="flex items-center justify-between gap-2 rounded-none border-0 bg-gray-700 p-4 text-sm text-white sm:p-6 sm:text-base md:rounded-lg">
        <div className="space-y-2">
          <Link className="group flex items-center gap-2 font-medium" to="/">
            <IconArrowBack className="transition-all duration-300 group-hover:-translate-x-1" />
            Go Back
          </Link>
          <h2 className="text-xl font-bold">Roadmap</h2>
        </div>
        <Link
          className="link-btn py-3 px-4 focus:ring-white focus:ring-offset-gray-700"
          prefetch="intent"
          to="/post/new"
        >
          + Add Feedback
        </Link>
      </Card>
      {/* For mobile devices */}
      <Tabs.Root className="mx-4 mt-6 md:hidden" defaultValue="planned" orientation="horizontal">
        <Tabs.List aria-label="Feedback Status" className="flex justify-between gap-2">
          <Tabs.Trigger className="tab-btn border-b-4 border-gray-400 font-bold" value="planned">
            Planned ({planned.length})
          </Tabs.Trigger>
          <Tabs.Trigger className="tab-btn border-b-4 border-gray-400 font-bold" value="inProgress">
            In-Progress ({inProgress.length})
          </Tabs.Trigger>
          <Tabs.Trigger className="tab-btn border-b-4 border-gray-400 font-bold" value="live">
            Live ({live.length})
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="planned">
          <TabContent content={planned} desc="Ideas prioritized for research" />
        </Tabs.Content>
        <Tabs.Content value="inProgress">
          <TabContent content={inProgress} desc="Currently being developed" />
        </Tabs.Content>
        <Tabs.Content value="live">
          <TabContent content={live} desc="Released features" />
        </Tabs.Content>
      </Tabs.Root>
      {/* For desktop */}
      <div className="my-8 hidden md:flex md:gap-4 lg:gap-8">
        <div className="flex-1">
          <TabContent content={planned} desc="Ideas prioritized for research" title={`Planned (${planned.length})`} />
        </div>
        <div className="flex-1">
          <TabContent
            content={inProgress}
            desc="Currently being developed"
            title={`In-Progress (${inProgress.length})`}
          />
        </div>
        <div className="flex-1">
          <TabContent content={live} desc="Released features" title={`Live (${live.length})`} />
        </div>
      </div>
    </div>
  )
}
export default RoadmapRoute
