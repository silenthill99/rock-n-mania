import { createServerFn } from '@tanstack/react-start'
import { del, put } from '@vercel/blob'
import { ensureSession } from '#/lib/auth.functions.ts'
import { prisma } from '#/db.ts'
import type { Album } from '#/types'
import { z } from 'zod'

export const getAlbums = createServerFn({ method: 'GET' }).handler(async () => {
  return await prisma.album.findMany({
    include: {
      user: true,
    },
  })
})

export const updateAlbum = createServerFn({ method: 'POST' })
  .validator((data: Album) => data)
  .handler(async ({ data }) => {
    const session = await ensureSession()
    return await prisma.album.update({
      where: {
        slug: data.slug,
        userId: session.user.id,
      },
      data: {
        title: data.title,
        releasedAt: data.releasedAt,
        tracklist: data.tracklist,
      },
    })
  })

export const createAlbum = createServerFn({ method: 'POST' })
  .validator((data: FormData) => data)
  .handler(async ({ data }) => {
    const session = await ensureSession()
    const title = data.get('title') as string
    const image = data.get('image') as File
    const blob = await put(
      `albums/${crypto.randomUUID()}-${image.name}`,
      image,
      {
        access: 'private',
        contentType: image.type,
      },
    )

    return prisma.album.create({
      data: {
        userId: session.user.id,
        title,
        tracklist: data.get('tracklist') as string,
        releasedAt: new Date(data.get('releasedAt') as string),
        slug: z.string().slugify().parse(title),
        image_path: blob.url,
        deezer_url: data.get('deezer_url') as string,
        artists: {
          connect: data.getAll('artistId').map((id) => ({ id: Number(id) })),
        },
      },
    })
  })

export const getAlbum = createServerFn({ method: 'GET' })
  .validator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    return await prisma.album.findFirst({
      where: {
        slug: data.slug,
      },
      include: {
        user: true,
      },
    })
  })

export const deleteAlbum = createServerFn({ method: 'POST' })
  .validator((data: { slug: string, image_path: string }) => data)
  .handler(async ({ data }) => {
    const session = await ensureSession()
    await del(
      data.image_path, {
        token: process.env.BLOB_READ_WRITE_TOKEN
      }
    )
    return await prisma.album.delete({
      where: {
        slug: data.slug,
        userId: session.user.id,
      },
    })
  })
