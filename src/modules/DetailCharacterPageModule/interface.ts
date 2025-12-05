export interface CharacterAttribute {
  name: string;
  value: string;
}

export interface CharacterDetailProps {
  uri?: string;
  name: string;
  fullName?: string;
  altName?: string;
  description?: string;
  attributes?: CharacterAttribute[];
  url?: string;
  animeList?: string[];
}

export interface CharacterDetailResponseProps {
  status: number;
  message: string;
  data: CharacterDetailProps;
}
