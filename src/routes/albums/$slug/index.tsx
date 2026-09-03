import { createFileRoute, notFound } from '@tanstack/react-router'
import { getAlbum } from '#/lib/album.function.ts'

export const Route = createFileRoute('/albums/$slug/')({
  component: RouteComponent,
  loader: ({ params }) =>
    getAlbum({
      data: {
        slug: params.slug
      },
    }),
})


function RouteComponent() {
  const album = Route.useLoaderData()
  if (!album) {
    throw notFound()
  }
  return <div>Hello "/albums/$slug/"!
    <p>{album.title}</p>
  </div>
}
