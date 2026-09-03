import { createFileRoute } from '@tanstack/react-router'
import {Card, CardHeader, CardTitle} from "#/components/ui/card.tsx";
import {getAlbums} from "#/lib/album.function.ts";

export const Route = createFileRoute('/albums/')({
  component: RouteComponent,
  loader: () => getAlbums(),
})


function RouteComponent() {
  const albums = Route.useLoaderData()
  return (
    <div className={'container mx-auto'}>
      <h1>Liste des albums</h1>
      {albums.length === 0 ? (
        <p>Pas d'albums actuellement</p>
      ) : (
        <div className={'grid md:grid-cols-2 lg:grid-cols-3 gap-5'}>
          {albums.map((album) => (
              <Card key={album.id}>
                <CardHeader>
                  <CardTitle>Album {album.title}</CardTitle>
                </CardHeader>
              </Card>
          ))}
        </div>
      )}
    </div>
  )
}
