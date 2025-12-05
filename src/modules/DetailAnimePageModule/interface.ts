export interface AnimeDetailProps {
  id: number
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
  // studio can be a plain name or an object with id/uri and label
  studio?: string | { id?: string | number; uri?: string; label?: string }
  // producers/genres may be arrays of names or objects; UI will display only names
  producers?: Array<string | { id?: string | number; label?: string }>
  genres?: Array<string | { id?: string | number; label?: string }>
  themes?: string[]
  characters?: string[]
  releasedYear?: string
  releasedSeason?: string
};

export interface AnimeDetailResponseProps {
  status: number
  message: string
  data: AnimeDetailProps[]
};