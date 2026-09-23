import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { Field, FieldError, FieldLabel } from '#/components/ui/field.tsx'
import { Input } from '#/components/ui/input.tsx'
import { Button } from '#/components/ui/button.tsx'
import { createAlbum } from '#/lib/album.function.ts'
import { Textarea } from '#/components/ui/textarea.tsx'
import type { ChangeEvent } from 'react'
import { useState } from 'react'
import { createServerFn } from '@tanstack/react-start'
import { prisma } from '#/db.ts'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '#/components/ui/select.tsx'

export const Route = createFileRoute('/_protected/albums/new')({
  component: RouteComponent,
  loader: () => getArtists()
})

const formValidators = z.object({
  title: z.string().refine((value) => value !== '', 'Le titre est obligatoire'),
  tracklist: z.string().min(1),
  releasedAt: z
    .date()
    .nullable()
    .refine((value) => value !== null, 'La date est obligatoire'),
  image: z
    .file()
    .max(8 * 1024 * 1024, 'image')
    .mime(['image/jpeg', 'image/png', 'image/webp'])
    .nullable()
    .refine((value) => value !== null, "L'image est obligatoire"),
  deezer_url: z
    .string()
    .refine(
      (value) =>
        value === '' ||
        /^(?:https?:\/\/)?(?:www\.)?deezer\.com\/fr\/album\/[0-9]+\/?$/.test(
          value,
        ),
      'Le lien Deezer est invalide',
    ),
  artist: z.array(z.number().int().positive())
})

type FormValues = z.input<typeof formValidators>

const getArtists = createServerFn({ method: 'GET' }).handler(
  async () =>
    await prisma.artist.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    }),
)

function formatDateInput(value: Date | null) {
  if (!value) return ''

  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function RouteComponent() {
  const [path, setPath] = useState<string | null>(null)

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPath(url)
    }
  }

  const defaultValues: FormValues = {
    title: '',
    tracklist: '',
    releasedAt: null,
    image: null,
    deezer_url: '',
    artist: []
  }

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: formValidators,
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData()
      formData.append('title', value.title)
      formData.append('tracklist', value.tracklist)
      formData.append('releasedAt', value.releasedAt!.toISOString())
      formData.append('image', value.image!)
      formData.append('deezer_url', value.deezer_url)
      value.artist.forEach((artistId) => {
        formData.append('artistId', String(artistId))
      })

      await createAlbum({ data: formData })
    },
  })
  const artists = Route.useLoaderData()
  const items = artists.map((item) => ({
    label: item.name,
    value: item.id,
  }))
  return (
    <div className={'container mx-auto'}>
      <h1>Ajouter un album</h1>
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
              <FieldLabel htmlFor={field.name}>Titre de l'album</FieldLabel>
              <Input
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
          name={'tracklist'}
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Liste des titres</FieldLabel>
              <Textarea
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
          name={'releasedAt'}
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Date de sortie</FieldLabel>
              <Input
                type={'date'}
                id={field.name}
                name={field.name}
                value={formatDateInput(field.state.value)}
                className="[&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:bg-white [&::-webkit-calendar-picker-indicator]:rounded-sm"
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(
                    e.target.value
                      ? new Date(`${e.target.value}T00:00:00`)
                      : null,
                  )
                }
                aria-invalid={!field.state.meta.isValid}
              />
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        />
        <form.Field
          name="image"
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Pochette</FieldLabel>
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onBlur={field.handleBlur}
                onChange={(e) => {
                  field.handleChange(e.target.files?.[0] ?? null)
                  handleImageChange(e)
                }}
              />
              <FieldError errors={field.state.meta.errors} />
              {path && <img className={'w-50!'} src={path} alt={'Visuel'} />}
            </Field>
          )}
        />
          <form.Field name={"deezer_url"} children={(field) => (
              <Field>
                  <FieldLabel htmlFor={field.name}>Lien Deezer</FieldLabel>
                  <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                      aria-invalid={!field.state.meta.isValid}
                  />
                  <FieldError errors={field.state.meta.errors}/>
              </Field>
          )}/>
        <form.Field name={"artist"} children={(field) => (
          <Field>
            <FieldLabel htmlFor={field.name}></FieldLabel>
            <Select
              name={field.name}
              id={field.name}
              items={items}
              multiple
              value={field.state.value}
              onValueChange={(value) => field.handleChange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={"Nom de l'artiste"}/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {items.map((item) => (
                    <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        )}/>
        <Button type={'submit'}>Créer un album</Button>
      </form>
    </div>
  )
}
