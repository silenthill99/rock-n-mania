export function getVideoId(link: string): any {
  const url = new URL(link);
  return url.searchParams.get("v")
}