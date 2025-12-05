export interface CharacterAttribute {
  name: string;
  value: string;
}

export interface CharacterDetailProps {
  id: number;
  name: string;
  altName?: string;
  description?: string;
  attributes?: CharacterAttribute[];
  url?: string;
  foafName?: string;
  animeList?: string[];
}

export interface CharacterDetailResponseProps {
  status: number;
  message: string;
  data: CharacterDetailProps[];
}
