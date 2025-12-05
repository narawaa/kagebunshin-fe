export interface SearchResultProps {
  id: number
  label: string
  description?: string
  type?: string
  born?: string
};

export interface SearchAllAnime {
  resource: string;
  typeLabel: "anime";
  title: string;
  image: string;
}

export interface SearchAllCharacter {
  resource: string;
  typeLabel: "character";
  fullName: string;
}

export type SearchAllResult = SearchAllAnime | SearchAllCharacter;

export interface SearchAnimeResult {
  anime: string;
  image: string;
  title: string;
  themes: string[];
  score: number;
}

export interface SearchCharacterResult {
  char: string;
  name: string;
  animeList: string[];
  score: number;
}

export interface SearchAllResultResponse {
  status: number;
  message: string;
  data: SearchAllResult[];
}

export interface SearchAnimeResultResponse {
  status: number;
  message: string;
  data: SearchAnimeResult[];
}

export interface SearchCharacterResultResponse {
  status: number;
  message: string;
  data: SearchCharacterResult[];
}
