import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { authClient } from '../../auth-client.ts'
import { Field, FieldError, FieldLabel } from '#/components/ui/field.tsx'
import { Input } from '#/components/ui/input.tsx'
import { Button } from '#/components/ui/button.tsx'

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

const baseFormValidator = z.object({
  email: z.string().email().min(1).max(255),
  name: z.string().min(1).max(255),
  password: z.string().min(8).max(255),
  passwordConfirmation: z.string().min(8).max(255),
})

const formValidator = baseFormValidator.refine(
  (data) => data.password === data.passwordConfirmation,
  {
    error: "Password and Password Confirmation aren't similar",
    path: ['password'],
  },
)

function RouteComponent() {
  const form = useForm({
    defaultValues: {
      email: '',
      name: '',
      password: '',
      passwordConfirmation: '',
    },
    validators: {
      onSubmit: formValidator,
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          name: value.name,
          password: value.password,
        },
        {
          onError: () => {
            form.resetField('password')
            form.resetField('passwordConfirmation')
          },
        },
      )
    },
  })
  return (
    <div className={'container mx-auto'}>
      <h1>Créer un compte</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.Field
          name={'email'}
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Adresse mail</FieldLabel>
              <Input
                type={'email'}
                name={field.name}
                id={field.name}
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
          name={'name'}
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Nom</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                aria-invalid={!field.state.meta.isValid}
              />
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        />
        <form.Field
          name={'password'}
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Mot de passe</FieldLabel>
              <Input
                type={'password'}
                name={field.name}
                id={field.name}
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
          name={'passwordConfirmation'}
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>
                Confirmer le mot de passe
              </FieldLabel>
              <Input
                type={'password'}
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
        <Button type={'submit'}>Créer un compte</Button>
      </form>
    </div>
  )
}
