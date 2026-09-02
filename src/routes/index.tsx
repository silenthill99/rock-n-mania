import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { prisma } from '#/db.ts'

export const Route = createFileRoute('/')({
  component: Home,
  loader: () => getTodos(),
})

const getTodos = createServerFn({ method: 'GET' }).handler(() =>
  prisma.todo.findMany(),
)

function Home() {
  const todos = Route.useLoaderData()
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Welcome to TanStack Start12345</h1>
      <p className="mt-4 text-lg">
        Edit <code>src/routes/index.tsx</code> to get started.
      </p>
      <p>{todos.length}</p>
    </div>
  )
}
