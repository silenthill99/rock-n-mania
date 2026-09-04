export interface Menu {
  label: string;
  url: string
}

export interface Album {
  id: number
  title: string,
  slug: string,
  tracklist: string,
  releasedAt: Date
}