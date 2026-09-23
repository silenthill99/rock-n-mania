import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router'
import { formValidator, getClip, updateClip } from '#/lib/clip.config.ts'
import { useForm } from '@tanstack/react-form'
import { Field, FieldError, FieldLabel } from '#/components/ui/field.tsx'
import { Input } from '#/components/ui/input.tsx'
import { Button } from '#/components/ui/button.tsx'

export const Route = createFileRoute('/_protected/clips/$id/update')({
  component: RouteComponent,
  loader: ({ params }) => getClip({ data: { id: Number(params.id) } }),
})

function RouteComponent() {
  const clip = Route.useLoaderData()

  if (!clip) {
    throw notFound()
  }

  const form = useForm({
    defaultValues: {
      url: clip.url,
      title: clip.title,
    },
    validators: {
      onSubmit: formValidator,
    },
    onSubmit: async () => {
      const updatedClip = await updateClip({
        data: {
          id: clip.id,
          title: form.state.values.title,
          url: form.state.values.url,
        },
      })
      form.reset()
      navigate({ to: '/clips' })
      return updatedClip
    },
  })
  const navigate = useNavigate()
  return (
    <div className={'container mx-auto'}>
      <h1>Modifier un clip</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.Field
          name={'title'}
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Titre</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                aria-invalid={!field.state.meta.isValid}
              />
              <FieldError errors={field.state.meta.errors}/>
            </Field>
          )}
        />
        <form.Field
          name={'url'}
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>URL</FieldLabel>
              <Input
                type={"url"}
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={e => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                aria-invalid={!field.state.meta.isValid}
              />
              <FieldError errors={field.state.meta.errors}/>
            </Field>
          )}
        />
        <Button type={"submit"}>Modifier le clip</Button>
      </form>
    </div>
  )
}
