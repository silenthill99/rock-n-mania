import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { createClip, formValidator } from '#/lib/clip.config.ts'
import { Button } from '#/components/ui/button.tsx'
import { Field, FieldError, FieldLabel } from '#/components/ui/field.tsx'
import { Input } from '#/components/ui/input.tsx'

export const Route = createFileRoute('/_protected/clips/new')({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Ajouter un clip"
      }
    ]
  })
})

function RouteComponent() {
  const form = useForm({
    defaultValues: {
      title: "",
      url: "",
    }, onSubmit: async ({value}) => {
      form.reset()
      await createClip({
        data: {
          title: value.title,
          url: value.url,
        }
      })
    },
    validators: {
      onSubmit: formValidator
    }
  })
  return (
    <div className={'container mx-auto'}>
      <h1>Ajouter un clip</h1>
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
              <FieldLabel htmlFor={field.name}>Nom</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={!field.state.meta.isValid}
              />
              <FieldError errors={field.state.meta.errors} />
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
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
                aria-invalid={!field.state.meta.isValid}
              />
              <FieldError errors={field.state.meta.errors}/>
            </Field>
          )}
        />
        <Button type={'submit'}>Créer un clip</Button>
      </form>
    </div>
  )
}
