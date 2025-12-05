import {
  SearchAllResultResponse,
  SearchAnimeResultResponse,
  SearchCharacterResultResponse
} from "@/modules/HomePageModule/interface";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function searchAll(query: string): Promise<SearchAllResultResponse> {
  try {
    const response = await fetch(`${API}/search/all/query/?search=${query}`);
    return await response.json();
  } catch {
    return {
      status: 500,
      message: "Server tidak merespons. Silakan coba lagi nanti.",
      data: [],
    };
  }
}

export async function searchAnime(query: string): Promise<SearchAnimeResultResponse> {
  try {
    const response = await fetch(`${API}/search/anime/query/?search=${query}`);
    return await response.json();
  } catch {
    return {
      status: 500,
      message: "Server tidak merespons. Silakan coba lagi nanti.",
      data: [],
    };
  }
}

export async function searchAnimeByGenre(
  query: string,
  genre: string
): Promise<SearchAnimeResultResponse> {
  try {
    const response = await fetch(
      `${API}/search/anime/query/?search=${query}&genre=${genre}`
    );
    return await response.json();
  } catch {
    return {
      status: 500,
      message: "Server tidak merespons. Silakan coba lagi nanti.",
      data: [],
    };
  }
}

export async function searchCharacter(query: string): Promise<SearchCharacterResultResponse> {
  try {
    const response = await fetch(`${API}/search/character/query/?search=${query}`);
    return await response.json();
  } catch {
    return {
      status: 500,
      message: "Server tidak merespons. Silakan coba lagi nanti.",
      data: [],
    };
  }
}