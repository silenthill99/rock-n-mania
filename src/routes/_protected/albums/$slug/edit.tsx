import { createFileRoute } from '@tanstack/react-router'
import { getAlbum } from '#/lib/album.function.ts'

export const Route = createFileRoute('/_protected/albums/$slug/edit')({
  component: RouteComponent,
  loader: ({params}) => getAlbum({
    data: {
      slug: params.slug
    }
  })
})

function RouteComponent() {
  const {user} = Route.useRouteContext()

  const album = Route.useLoaderData()

  if (!album) {
    throw new Error('Album not found')
  }

  if (user.id !== album.userId) {
    throw new Error("You're not the owner of this album")
  }

  return <div>
  </div>
}
