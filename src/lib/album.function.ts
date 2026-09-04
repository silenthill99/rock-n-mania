import { createServerFn } from '@tanstack/react-start'
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
  .validator((data: Album) => data)
  .handler(async ({ data }) => {
    const session = await ensureSession()
    const slug = data.title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    return await prisma.album.create({
      data: {
        userId: session.user.id,
        title: data.title,
        tracklist: data.tracklist,
        releasedAt: data.releasedAt,
        slug,
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
