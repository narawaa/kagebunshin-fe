import { CharacterDetailResponseProps } from "@/modules/DetailCharacterPageModule/interface";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function fetchCharacterDetail(pk: string): Promise<CharacterDetailResponseProps> {
  try {
    const url = `${API}/search/character/pk/?pk=${encodeURIComponent(pk)}`;
    console.debug('[detailCharacterService] fetchCharacterDetail pk=', pk, 'url=', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      let body = '';
      try { body = await response.text(); } catch (e) { body = String(e); }
      console.error('[detailCharacterService] fetch failed', { status: response.status, statusText: response.statusText, body });
      return { status: response.status, message: `Server error ${response.status}`, data: null as any };
    }

    const data: CharacterDetailResponseProps = await response.json();
    try { console.debug('[detailCharacterService] fetched data=', data); } catch (e) { /* ignore */ }
    return data;
  } catch (e) {
    console.error('[detailCharacterService] unexpected error', e);
    return {
      status: 500,
      message: 'Server tidak merespons. Silakan coba lagi nanti.',
      data: null as any,
    };
  }
}

export default fetchCharacterDetail;
