type Props = {
  videoId: string
}

const YoutubeVideos = ({videoId}: Props) => {
  return (
    <iframe
      className={"max-w-full"}
      width="560"
      height="315"
      src={`https://www.youtube.com/embed/${videoId}`}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  )
}

export default YoutubeVideos