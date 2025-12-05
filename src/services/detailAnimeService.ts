import { AnimeDetailResponseProps } from "@/modules/DetailAnimePageModule/interface";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function fetchAnimeDetail(pk: string): Promise<AnimeDetailResponseProps> {
  try {
    const url = `${API}/search/anime/pk/?pk=${encodeURIComponent(pk)}`;
    console.debug('[detailAnimeService] fetchDetail pk=', pk, 'url=', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    // parse JSON (may be error message or data)
    const data: AnimeDetailResponseProps = await response.json();
    // log the full response for debugging in browser console
    try { console.debug('[detailAnimeService] fetched data=', data); } catch (e) { /* ignore */ }
    return data;
  } catch {
    return {
      status: 500,
      message: 'Server tidak merespons. Silakan coba lagi nanti.',
      data: null as any,
    };
  }
}
