export interface AnimeDetailProps {
  uri?: string
  id?: number
  title: string
  description?: string
  type?: string
  image?: string
  episodes?: string
  airingStatus?: string
  premiered?: string
  duration?: string
  score?: string
  rank?: string
  popularity?: string
  members?: string
  favorites?: string
  source?: string
  studio?: string | { id?: string | number; uri?: string; label?: string }
  producers?: Array<string | { id?: string | number; label?: string }>
  genres?: Array<string | { id?: string | number; label?: string }>
  themes?: string[]
  charactersUri?: string[]
  charactersName?: string[]
  releasedYear?: string
  releasedSeason?: string
};

export interface AnimeDetailResponseProps {
  status: number
  message: string
  data: AnimeDetailProps[]
};