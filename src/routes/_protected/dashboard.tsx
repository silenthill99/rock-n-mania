import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { authClient } from '../../../auth-client.ts'
import { Button, buttonVariants } from '#/components/ui/button.tsx'
import { createServerFn } from '@tanstack/react-start'
import { prisma } from '#/db.ts'
import { ensureSession } from '#/lib/auth.functions.ts'
import { Separator } from '#/components/ui/separator.tsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '#/components/ui/table.tsx'
import { deleteAlbum } from '#/lib/album.function.ts'

export const Route = createFileRoute('/_protected/dashboard')({
  component: RouteComponent,
  loader: () => Promise.all([getUserWithAlbums(), getUserWithClips()]),
})

const getUserWithAlbums = createServerFn().handler(async () => {
  const { user } = await ensureSession()
  return await prisma.album.findMany({
    where: {
      userId: user.id,
    },
  })
})

const getUserWithClips = createServerFn({method: "GET"})
  .handler(async () => {
    const {user} = await ensureSession()
    return await prisma.clip.findMany({
      where: {
        userId: user.id,
      }
    })
  })

function RouteComponent() {
  const navigate = useNavigate()
  const { user } = Route.useRouteContext()
  const [albums, clips] = Route.useLoaderData()
  const form = useForm({
    onSubmit: async () => {
      await authClient.signOut()
      navigate({
        to: '/',
      })
    },
  })
  return (
    <div className={'container mx-auto'}>
      <h1>Tableau de bord de {user.name}</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <Button type={'submit'} variant={'destructive'}>
          Se déconnecter
        </Button>
      </form>
      <Separator />
      <section>
        <h2>Albums</h2>
        <Link
          to={'/albums/new'}
          className={buttonVariants({ variant: 'secondary' })}
        >
          Ajouter un nouvel album
        </Link>
        {albums.length !== 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {albums.map((album) => (
                <TableRow key={album.id}>
                  <TableCell>{album.id}</TableCell>
                  <TableCell>{album.title}</TableCell>
                  <TableCell>
                    <Button type={"submit"}
                            onClick={() => deleteAlbum({data: {slug: album.slug, image_path: album.image_path}})}
                    >Supprimer</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>Pas d'albums actuellement</p>
        )}
      </section>
      <Separator />
      <section>
        <h2>Clips</h2>
        {clips.length !== 0 ? (
          <Table>
            <TableHeader className={'text-white'}>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clips.map((clip) => (
                <TableRow key={clip.id}>
                  <TableCell>{clip.id}</TableCell>
                  <TableCell>{clip.title}</TableCell>
                  <TableCell>
                    <Link to={"/clips/$id/update"} params={{id: String(clip.id)}} className={buttonVariants()}>Modifier le clip</Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>Pas de clips actuellement</p>
        )}
      </section>
    </div>
  )
}
