import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { authClient } from '../../../auth-client.ts'
import { Button, buttonVariants } from '#/components/ui/button.tsx'
import { createServerFn } from '@tanstack/react-start'
import { prisma } from '#/db.ts'
import { ensureSession } from '#/lib/auth.functions.ts'
import { Separator } from '#/components/ui/separator.tsx'
import { Table } from '#/components/ui/table.tsx'

export const Route = createFileRoute('/_protected/dashboard')({
  component: RouteComponent,
  loader: () => getUserWithAlbums(),
})

const getUserWithAlbums = createServerFn().handler(async () => {
  const { user } = await ensureSession()
  return await prisma.album.findMany({
    where: {
      userId: user.id,
    },
  })
})

function RouteComponent() {
  const navigate = useNavigate()
  const { user } = Route.useRouteContext()
  const albums = Route.useLoaderData()
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
      <Separator/>
      <section>
        <h2>Albums</h2>
        <Link to={"/albums/new"} className={buttonVariants({variant: "secondary"})}>Ajouter un nouvel album</Link>
        {albums.length !== 0 ? (
          <Table>

          </Table>
        ) : (
          <p>Pas d'albums actuellement</p>
        )}
      </section>
    </div>
  )
}
