import type { StudioDetailResponseProps } from "@/modules/DetailStudioPageModule/interface";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function fetchStudioDetail(pk: string): Promise<StudioDetailResponseProps> {
  try {
    const url = `${API}/search/studio/pk/?pk=${encodeURIComponent(pk)}`;
    console.debug('[detailStudioService] fetchStudioDetail pk=', pk, 'url=', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      let body = '';
      try { body = await response.text(); } catch (e) { body = String(e); }
      console.error('[detailStudioService] fetch failed', { status: response.status, statusText: response.statusText, body });
      return { status: response.status, message: `Server error ${response.status}`, data: null as any } as StudioDetailResponseProps;
    }

    const data: StudioDetailResponseProps = await response.json();
    try { console.debug('[detailStudioService] fetched data=', data); } catch (e) { /* ignore */ }
    return data;
  } catch (e) {
    console.error('[detailStudioService] unexpected error', e);
    return {
      status: 500,
      message: 'Server tidak merespons. Silakan coba lagi nanti.',
      data: null as any,
    } as StudioDetailResponseProps;
  }
}

export default fetchStudioDetail;
