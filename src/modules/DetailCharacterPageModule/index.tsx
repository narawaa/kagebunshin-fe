"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchCharacterDetail } from '@/services/detailCharacterService';
import type {
  CharacterDetailProps,
  CharacterDetailResponseProps,
  CharacterAttribute,
} from './interface';

type Props = { pk: string };

export default function DetailCharacterPageModule({ pk }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CharacterDetailProps | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resolvingMap, setResolvingMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!pk) return;
    setLoading(true);
    setError(null);
    fetchCharacterDetail(pk)
      .then((res: CharacterDetailResponseProps) => {
        console.debug('[DetailCharacterPageModule] raw response=', res);
        if (res?.status === 200) {
          let payload: any = res.data;
          if (payload && !Array.isArray(payload)) payload = [payload];
          if (Array.isArray(payload) && payload.length > 0) {
            // ensure attributes parsed from JSON string if needed
            const item: CharacterDetailProps = payload[0];
            if (item.attributes && typeof item.attributes === 'string') {
              try {
                (item as any).attributes = JSON.parse(item.attributes) as CharacterAttribute[];
              } catch (e) {
                console.warn('Failed to parse attributes JSON', e);
              }
            }
            setData(item);
            try { console.log('[DetailCharacterPageModule] data JSON:\n' + JSON.stringify(item, null, 2)); } catch (e) { }
          } else {
            setData(null);
            setError(res?.message ?? 'Data tidak ditemukan');
          }
        } else {
          setData(null);
          setError(res?.message ?? 'Data tidak ditemukan');
        }
      })
      .catch((e) => {
        console.error('[DetailCharacterPageModule] fetch error', e);
        setError(String(e));
      })
      .finally(() => setLoading(false));
  }, [pk]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!data) return <div>Data tidak tersedia</div>;

  const chipStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '4px 8px',
    margin: '4px',
    borderRadius: 9999,
    background: '#f1f5f9',
    fontSize: 12,
  };

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

  const buttonStyle: React.CSSProperties = {
    padding: '8px 12px',
    margin: '6px 6px 6px 0',
    borderRadius: 8,
    border: '1px solid #e2e8f0',
    background: 'white',
    cursor: 'pointer',
    color: '#0f172a',
  };

  const primaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: '#2563eb',
    color: 'white',
    border: '1px solid #2563eb',
  };

  return (
    <div className="detail-character min-h-screen" style={{ maxWidth: 880, margin: '0 auto', padding: 24 }}>
      <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 6px 18px rgba(15,23,42,0.06)', padding: 20 }}>
        <h1 style={{ fontSize: 34, margin: '4px 0 12px 0', textAlign: 'center', lineHeight: 1.05 }}>{data.name}</h1>

        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          {data.url && (
            <div style={{ flex: '0 0 160px' }}>
              <a href={data.url} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>
                External Link
              </a>
            </div>
          )}

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
              {data.altName && <div style={{ color: '#475569' }}><strong>Alt:</strong> {data.altName}</div>}
              {data.foafName && <div style={{ color: '#475569' }}><strong>FOAF:</strong> {data.foafName}</div>}
            </div>

            {data.description && <p style={{ color: '#334155', marginTop: 4 }}>{data.description}</p>}

            {Array.isArray(data.attributes) && data.attributes.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <strong>Attributes</strong>
                <ul style={{ marginTop: 8 }}>
                  {data.attributes.map((a, i) => (
                    <li key={i} style={{ marginBottom: 6 }}>
                      <strong>{a.name}:</strong> <span style={{ marginLeft: 6 }}>{a.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {Array.isArray(data.animeList) && data.animeList.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <strong>Appears In</strong>
                <div style={{ marginTop: 10 }} className="appears-grid">
                  {data.animeList.map((t, i) => {
                    const label = nameOf(t);
                    const pk = animePk(t);

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
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
