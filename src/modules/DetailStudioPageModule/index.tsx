"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import fetchStudioDetail from '@/services/detailStudioService';
import type { StudioDetailProps, StudioDetailResponseProps } from './interface';

type Props = { pk: string };

export default function DetailStudioPageModule({ pk }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<StudioDetailProps | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resolvingMap, setResolvingMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!pk) return;
    setLoading(true);
    setError(null);
    fetchStudioDetail(pk)
      .then((res: StudioDetailResponseProps) => {
        console.debug('[DetailStudioPageModule] raw response=', res);
        if (res?.status === 200 && res.data) {
          let payload = res.data;
          // normalize notableWorks and founders into string[]
          const normalizeList = (v: any): string[] => {
            if (!v) return [];
            if (Array.isArray(v)) return v.flatMap((x) => (typeof x === 'string' ? x.split(/,\s*/) : [])).map(s => s.trim()).filter(Boolean);
            if (typeof v === 'string') return v.split(/,\s*/).map(s => s.trim()).filter(Boolean);
            return [];
          };

          const normalized: StudioDetailProps = {
            wikidataUri: payload.wikidataUri,
            name: payload.name,
            notableWorks: normalizeList(payload.notableWorks),
            founders: normalizeList(payload.founders),
            originCountry: payload.originCountry,
            officialWebsite: payload.officialWebsite,
            logo: payload.logo,
          };

          setData(normalized);
        } else {
          setData(null);
          setError(res?.message ?? 'Data tidak ditemukan');
        }
      })
      .catch((e) => {
        console.error('[DetailStudioPageModule] fetch error', e);
        setError(String(e));
      })
      .finally(() => setLoading(false));
  }, [pk]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!data) return <div>Data tidak tersedia</div>;

  const nameOf = (v: any) => {
    if (v === null || v === undefined) return '';
    if (typeof v === 'string') {
      if (v.includes('/') || v.includes('#') || v.includes(':')) {
        const parts = v.split(/[/#]/).filter(Boolean);
        let last = parts.pop() || v;
        if (last.includes(':')) last = last.split(':').pop() || last;
        last = last.split(/[?&]/)[0];
        return decodeURIComponent(last).replace(/[_\-]/g, ' ');
      }
      return v;
    }
    if (typeof v === 'number') return String(v);
    if (v.label) return v.label;
    if (v.name) return v.name;
    if (v.uri) {
      const uri = String(v.uri);
      const parts = uri.split(/[/#]/).filter(Boolean);
      let last = parts.pop() || uri;
      if (last.includes(':')) last = last.split(':').pop() || last;
      last = last.split(/[?&]/)[0];
      return decodeURIComponent(last).replace(/[_\-]/g, ' ');
    }
    return String(v);
  };

  const animePk = (v: any) => {
    if (!v) return null;
    if (typeof v === 'object') {
      if (v.id) return String(v.id);
      if (v.pk) return String(v.pk);
      if (v.uri) {
        const parts = String(v.uri).split('/').filter(Boolean);
        return parts.pop() || null;
      }
      if (v.url) {
        const parts = String(v.url).split('/').filter(Boolean);
        return parts.pop() || null;
      }
    }
    if (typeof v === 'string') {
      if (v.includes('/')) {
        const parts = v.split('/').filter(Boolean);
        return parts.pop() || null;
      }
      return null;
    }
    return null;
  };

  return (
    <div className="detail-studio min-h-screen" style={{ maxWidth: 880, margin: '0 auto', padding: 24 }}>
      <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 6px 18px rgba(15,23,42,0.06)', padding: 20 }}>
        <h1 style={{ fontSize: 34, margin: '4px 0 12px 0', textAlign: 'center', lineHeight: 1.05 }}>{data.name}</h1>

        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          {data.logo && (
            <div style={{ flex: '0 0 160px' }}>
              <img src={data.logo} alt={`${data.name} logo`} style={{ maxWidth: '100%', borderRadius: 8 }} />
            </div>
          )}

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
              {data.officialWebsite && (
                <a href={data.officialWebsite} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>
                  Official website
                </a>
              )}

              {data.wikidataUri && (
                <a href={data.wikidataUri} target="_blank" rel="noreferrer" style={{ color: '#475569' }}>
                  Wikidata
                </a>
              )}
            </div>

            {Array.isArray(data.originCountry) && data.originCountry.length > 0 && (
              <div style={{ marginTop: 6 }}>
                <strong>Country:</strong> <span style={{ marginLeft: 8 }}>{data.originCountry.join(', ')}</span>
              </div>
            )}

            {Array.isArray(data.founders) && data.founders.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <strong>Founders</strong>
                <ul style={{ marginTop: 8 }}>
                  {data.founders.map((f, i) => (
                    <li key={i} style={{ marginBottom: 6 }}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {Array.isArray(data.notableWorks) && data.notableWorks.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <strong>Notable works</strong>
                <ul style={{ marginTop: 8 }}>
                  {data.notableWorks.map((w, i) => {
                    const label = nameOf(w);
                    const pk = animePk(w);

                    const resolving = !!resolvingMap[i];

                    const handleClick = async () => {
                      if (pk) {
                        router.push(`/anime/${encodeURIComponent(pk)}`);
                        return;
                      }

                      // resolve by querying the backend search endpoint
                      try {
                        setResolvingMap((m) => ({ ...m, [i]: true }));
                        const API = process.env.NEXT_PUBLIC_API_URL || '';
                        const url = `${API}/search/anime/query/?search=${encodeURIComponent(label)}`;
                        console.debug('[DetailCharacter] resolving anime', label, 'via', url);
                        const res = await fetch(url);
                        const json = await res.json();
                        console.debug('[DetailCharacter] resolver response', json);
                        if (res.ok && json?.status === 200 && Array.isArray(json.data) && json.data.length > 0) {
                          const found = json.data[0];
                          const animeUri = found.anime || found.uri || found.resource || found?.anime;
                          if (animeUri && typeof animeUri === 'string') {
                            const parts = animeUri.split('/').filter(Boolean);
                            const resolvedPk = parts.pop();
                            if (resolvedPk) {
                              router.push(`/anime/${encodeURIComponent(resolvedPk)}`);
                              return;
                            }
                          }
                        }

                        // fallback: notify user if not found
                        alert(`Tidak dapat menemukan anime untuk "${label}"`);
                      } catch (e) {
                        console.error('[DetailCharacter] resolve error', e);
                        alert('Terjadi kesalahan saat mencari anime');
                      } finally {
                        setResolvingMap((m) => ({ ...m, [i]: false }));
                      }
                    };

                    return (
                      <button
                        key={i}
                        className={"btn " + (pk ? 'btn-primary' : 'btn') + ' appears-btn'}
                        onClick={handleClick}
                        title={pk ? `Open anime ${label}` : `Resolve and open ${label}`}
                        aria-label={pk ? `Open anime ${label}` : `Resolve and open ${label}`}
                        disabled={false}
                      >
                        {resolving ? 'Loading…' : label}
                      </button>
                    );
                })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
