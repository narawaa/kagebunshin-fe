"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchCharacterDetail } from '@/services/detailCharacterService';
import type {
  CharacterDetailProps,
  CharacterDetailResponseProps,
  CharacterAttribute,
} from './interface';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

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
        if (res?.status === 200 && res.data) {
          let item: any = res.data;
          // back-compat: if backend accidentally returns an array, take first
          if (Array.isArray(item)) item = item[0] || null;

          if (item) {
            // ensure attributes parsed from JSON string if needed
            if (item.attributes && typeof item.attributes === 'string') {
              try {
                item.attributes = JSON.parse(item.attributes) as CharacterAttribute[];
              } catch (e) {
                console.warn('Failed to parse attributes JSON', e);
              }
            }

            setData(item as CharacterDetailProps);
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

  const fieldOrEmpty = (value: any) => {
    if (value === null || value === undefined) return 'Informasi tidak tersedia.';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'Informasi tidak tersedia.';
      return value.join(', ');
    }
    if (typeof value === 'string' && value.trim() === '') return 'Informasi tidak tersedia.';
    return String(value);
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
      <Card>
        <CardHeader>
          <div style={{ textAlign: 'center' }}>
            <CardTitle style={{ fontSize: 34, lineHeight: 1.05 }}>{fieldOrEmpty(data.name)}</CardTitle>
            <CardDescription style={{ marginTop: 8 }}>
              {data.url ? (
                <a href={data.url} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>
                  MyAnimeList Page
                </a>
              ) : (
                'Informasi tidak tersedia.'
              )}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
            <div>
              <strong>Alt Name:</strong>
              <div style={{ marginTop: 6 }}>{fieldOrEmpty(data.altName)}</div>
            </div>
            <div>
              <strong>Full Name:</strong>
              <div style={{ marginTop: 6 }}>{fieldOrEmpty(data.fullName)}</div>
            </div>
            <div>
              <strong>Description:</strong>
              <div style={{ marginTop: 6, color: '#334155' }}>{fieldOrEmpty(data.description)}</div>
            </div>

            <div>
              <strong>Attributes:</strong>
              <div style={{ marginTop: 6 }}>
                {Array.isArray(data.attributes) && data.attributes.length > 0 ? (
                  <ul>
                    {data.attributes.map((a, i) => (
                      <li key={i} style={{ marginBottom: 6 }}>
                        <strong>{a.name}:</strong> <span style={{ marginLeft: 6 }}>{a.value ?? 'Informasi tidak tersedia.'}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div>Informasi tidak tersedia.</div>
                )}
              </div>
            </div>

            <div>
              <strong>Appears In:</strong>
              <div style={{ marginTop: 10 }} className="appears-grid">
                {Array.isArray(data.animeList) && data.animeList.length > 0 ? (
                  data.animeList.map((t, i) => {
                    const label = nameOf(t);
                    const pk = animePk(t);
                    const resolving = !!resolvingMap[i];

                    const handleClick = async () => {
                      if (pk) {
                        router.push(`/anime/${encodeURIComponent(pk)}`);
                        return;
                      }

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
                  })
                ) : (
                  <div>Informasi tidak tersedia.</div>
                )}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter />
      </Card>
    </div>
  );
}
