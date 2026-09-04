import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { Field, FieldError, FieldLabel } from '#/components/ui/field.tsx'
import { Input } from '#/components/ui/input.tsx'
import { Button } from '#/components/ui/button.tsx'

export const Route = createFileRoute('/_protected/albums/new')({
  component: RouteComponent,
})

const formValidators = z.object({
  title: z.string().refine((value) => value !== "", "Le titre est obligatoire"),
  tracklist: z.string().min(1),
  releasedAt: z
    .date()
    .nullable()
    .refine((value) => value !== null, 'La date est obligatoire'),
})

type FormValues = z.input<typeof formValidators>

function RouteComponent() {
  const defaultValues: FormValues = {
    title: '',
    tracklist: '',
    releasedAt: null,
  }

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: formValidators,
    },
  })
  return (
    <div>
      <h1>Ajouter un album</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.Field name={"title"} children={field => (
          <Field>
            <FieldLabel htmlFor={field.name}>Titre de l'album</FieldLabel>
            <Input
              name={field.name}
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={e => field.handleChange(e.target.value)}
              aria-invalid={!field.state.meta.isValid}
            />
            <FieldError errors={field.state.meta.errors}/>
          </Field>
        )}/>
        <Button type={"submit"}>Créer un album</Button>
      </form>
    </div>
  )
}
