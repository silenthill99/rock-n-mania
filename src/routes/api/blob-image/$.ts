import { createFileRoute } from '@tanstack/react-router'
import { get } from '@vercel/blob'

export const Route = createFileRoute('/api/blob-image/$')({
  server: {
    handlers: {
      GET: async ({request}: {request: Request}) => {
        const url = new URL(request.url).searchParams.get('url')

        if (!url) {
          return new Response('URL manquante', {status: 400})
        }

        const blob = await get(url, {
          access: 'private',
          token: process.env.BLOB_READ_WRITE_TOKEN,
        })

        if (!blob) {
          return new Response('Image introuvable', { status: 404 })
        }

        return new Response(blob.stream, {
          headers: {
            'Content-Type': blob.blob.contentType ?? 'application/octet-stream',
            'Cache-Control': 'public, max-age=3600',
          },
        })
      }
    }
  }
})