import { createFileRoute, Link } from '@tanstack/react-router'
import { getClips } from '#/lib/clip.config.ts'
import YoutubeVideos from '#/components/youtube-videos.tsx'
import { getVideoId } from '#/lib/getVideoId.ts'
import { authClient } from '../../../auth-client.ts'
import { buttonVariants } from '#/components/ui/button.tsx'

export const Route = createFileRoute('/clips/')({
  component: RouteComponent,
  loader: () => getClips()
})

function RouteComponent() {
  const clips = Route.useLoaderData()
  const { data: session } = authClient.useSession()

  return (
    <div className={'container mx-auto'}>
      <h1 className={"py-10"}>Liste des clips</h1>
      {session?.user && (
        <Link to={"/clips/new"} className={buttonVariants({variant: "secondary"})}>Ajouter un clip</Link>
      )}
      <div className={'grid gap-2 lg:grid-cols-3'}>
        {clips.length > 0 &&
          clips.map((clip, i) => (
            <div key={i} className={'border rounded-xl overflow-hidden p-2'}>
              <YoutubeVideos videoId={getVideoId(clip.url)} />
              <h2 className={"text-2xl font-semibold"}>{clip.title}</h2>
            </div>
          ))}
      </div>
    </div>
  )
}
