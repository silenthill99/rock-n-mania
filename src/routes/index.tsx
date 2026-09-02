import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { prisma } from '#/db.ts'

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => Promise.all([await getUsers(), await getClips()]),
})

const getUsers = createServerFn({ method: 'GET' }).handler(() =>
  prisma.user.findMany(),
)

const getClips = createServerFn({ method: 'GET' }).handler(() =>
  prisma.clip.findMany()
)

function Home() {
  const [users, clips] = Route.useLoaderData()
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Welcome to TanStack Start12345</h1>
      <p className="mt-4 text-lg">
        Edit <code>src/routes/index.tsx</code> to get started.
      </p>
      <p>{users.length}</p>
      <p>{clips.length}</p>
    </div>
  )
}
