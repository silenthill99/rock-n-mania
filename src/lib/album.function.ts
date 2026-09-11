import { createServerFn } from '@tanstack/react-start'
import { put } from '@vercel/blob'
import { ensureSession } from '#/lib/auth.functions.ts'
import { prisma } from '#/db.ts'
import type { Album } from '#/types'

export const getAlbums = createServerFn({ method: 'GET' }).handler(
  async () =>
    await prisma.album.findMany({
      include: {
        user: true,
      },
    }),
)

export const updateAlbum = createServerFn({ method: 'POST' })
  .validator((data: Album) => data)
  .handler(async ({ data }) => {
    const session = await ensureSession()
    return await prisma.album.update({
      where: {
        slug: data.slug,
        userId: session.user.id
      },
      data: {
        title: data.title,
        releasedAt: data.releasedAt,
        tracklist: data.tracklist
      },
    })
  })

export const createAlbum = createServerFn({ method: 'POST' })
  .validator((data: FormData) => data)
  .handler(async ({ data }) => {
    const session = await ensureSession()

    const title = data.get('title')
    const tracklist = data.get('tracklist')
    const releasedAt = data.get('releasedAt')
    const image = data.get('image')

    if (
      typeof title !== 'string' ||
      typeof tracklist !== 'string' ||
      typeof releasedAt !== 'string' ||
      !(image instanceof File)
    ) {
      throw new Error('Données invalides')
    }

    if (!image.type.startsWith('image/')) {
      throw new Error('Le fichier doit être une image')
    }

    const parsedReleasedAt = new Date(releasedAt)
    if (Number.isNaN(parsedReleasedAt.getTime())) {
      throw new Error('Date de sortie invalide')
    }

    const blob = await put(
      `albums/${crypto.randomUUID()}-${image.name}`,
      image,
      {
        access: 'public',
        contentType: image.type,
      },
    )

    const slug = title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    return await prisma.album.create({
      data: {
        userId: session.user.id,
        title,
        tracklist,
        releasedAt: parsedReleasedAt,
        slug,
        image_path: blob.url,
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
  .validator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const session = await ensureSession()
    return await prisma.album.delete({
      where: {
        slug: data.slug,
        userId: session.user.id,
      },
    })
  })
