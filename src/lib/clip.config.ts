import { z } from 'zod'
import { createServerFn } from '@tanstack/react-start'
import { prisma } from '#/db.ts'
import { ensureSession } from '#/lib/auth.functions.ts'

export const formValidator = z.object({
  title: z.string().min(1).max(255),
  url: z
    .string()
    .min(1)
    .max(255)
    .regex(
      /^(?:https?:\/\/)?(?:www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}(?:&.*)?$/,
      "Format de l'URL incorrect",
    ),
})

export const createClip = createServerFn({ method: 'POST' })
  .validator(formValidator)
  .handler(async ({ data }) => {
    const session = await ensureSession()

    return await prisma.clip.create({
      data: {
        title: data.title,
        url: data.url,
        userId: session.user.id,
      },
    })
  })

export const getClips = createServerFn({ method: 'GET' }).handler(
  async () => await prisma.clip.findMany(),
)

export const getClip = createServerFn({ method: 'GET' })
  .validator((data: { id: number }) => data)
  .handler(
    async ({ data }) =>
      await prisma.clip.findFirst({
        where: {
          id: data.id,
        },
      }),
  )

export const updateClip = createServerFn({method: 'POST'})
  .validator((data: {id: number, title: string, url: string}) => data)
  .handler(async ({ data }) => {
    const session = await ensureSession();
    return await prisma.clip.update({
      where: {
        id: data.id,
        userId: session.user.id
      },
      data: {
        title: data.title,
        url: data.url,
      }
    })
  })
