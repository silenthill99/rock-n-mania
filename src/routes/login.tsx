import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { authClient } from '../../auth-client.ts'
import { z } from 'zod'
import { Field, FieldError, FieldLabel } from '#/components/ui/field.tsx'
import { Input } from '#/components/ui/input.tsx'
import { Button } from '#/components/ui/button.tsx'
import { useState } from 'react'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

const formValidator = z.object({
  email: z.string().email().min(1).max(255),
  password: z.string().min(8).max(255),
})

function RouteComponent() {
  const [authError, setAuthError] = useState<string|null>(null)
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: formValidator,
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          password: value.password,
          email: value.email,
        },
        {
          onError: (ctx) => {
            form.resetField('password')
            if (ctx.error.status === 401) {
              setAuthError("Identifiants invalides !")
            }
          },
        },
      )
    },
  })
  return (
    <div className={"container mx-auto py-5"}>
      <h1>Se connecter</h1>
      <form
        onSubmit={(e) => {
          e.stopPropagation()
          e.preventDefault()
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
                autoComplete={"username"}
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
                value={field.state.value}
                name={field.name}
                id={field.name}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={!field.state.meta.isValid}
                autoComplete={"current-password"}
              />
              <FieldError errors={field.state.meta.errors}/>
            </Field>
          )}
        />
        <Button type={'submit'}>Se connecter</Button>
      </form>
      <FieldError>{authError}</FieldError>
    </div>
  )
}
