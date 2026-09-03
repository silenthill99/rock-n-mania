import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { authClient } from '../../../auth-client.ts'
import { Button } from '#/components/ui/button.tsx'

export const Route = createFileRoute('/_protected/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const {user} = Route.useRouteContext()
  const form = useForm({
    onSubmit: async () => {
      await authClient.signOut()
      navigate({
        to: "/"
      })
    }
  })
  return <div className={"container mx-auto"}>
    <h1>Tableau de bord de {user.name}</h1>
    <form onSubmit={e => {
      e.preventDefault()
      e.stopPropagation()
      form.handleSubmit()
    }}>
      <Button type={"submit"} variant={"destructive"}>Se déconnecter</Button>
    </form>
  </div>
}
