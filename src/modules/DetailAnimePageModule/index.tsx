"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchAnimeDetail } from "@/services/detailAnimeService";
import type { AnimeDetailProps, AnimeDetailResponseProps } from "./interface";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from "next/image";
import { AnimeDetailSkeleton } from "@/components/skeletons/DetailSkeleton";

type Props = {
  pk: string;
};

export default function DetailAnimePageModule({ pk }: Props) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnimeDetailProps | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [resolvingMap, setResolvingMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!pk) return;
    setLoading(true);
    setError(null);
    fetchAnimeDetail(pk)
      .then((res: AnimeDetailResponseProps) => {
        try { console.debug('[DetailAnimePageModule] raw response=', res); } catch (e) { /* ignore */ }

        if (res?.status === 200) {
          // normalize data: backend may return an object or an array
          let payload: any = res.data;
          if (payload && !Array.isArray(payload)) payload = [payload];

          if (Array.isArray(payload) && payload.length > 0) {
            setData(payload[0]);
            // print the fetched payload to browser console for debugging (pretty printed)
            try {
              console.debug('[DetailAnimePageModule] data=', payload[0]);
              console.log('[DetailAnimePageModule] data JSON:\n' + JSON.stringify(payload[0], null, 2));
            } catch (e) {}
          } else {
            setData(null);
            setError(res?.message ?? "Data tidak ditemukan");
            try { console.warn('[DetailAnimePageModule] empty payload', res); } catch (e) { }
          }
        } else {
          setData(null);
          setError(res?.message ?? "Data tidak ditemukan");
          try { console.error('[DetailAnimePageModule] non-200 response', res); } catch (e) { }
        }
      })
      .catch((e) => {
        console.error('[DetailAnimePageModule] fetch error', e);
        setError(String(e));
      })
      .finally(() => setLoading(false));
  }, [pk]);

  if (loading) {
    return <AnimeDetailSkeleton />;
  }

  if (error) return <div>{error}</div>;
  if (!data) return <div>Data tidak tersedia</div>;
  // helper: extract name from possible shapes
  const nameOf = (v: any) => {
    if (v === null || v === undefined) return '';
    if (typeof v === 'string') {
      // If looks like a URI or namespaced value, extract last segment
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

  // helper: get studio PK (from object or from URI last segment)
  const studioPk = (studio: any) => {
    if (!studio) return null;
    if (typeof studio === 'object') {
      if (studio.id) return String(studio.id);
      if (studio.pk) return String(studio.pk);
      if (studio.uri) return String(studio.uri).split('/').pop();
    }
    if (typeof studio === 'string') {
      try {
        const parts = studio.split('/');
        const last = parts[parts.length - 1] || parts[parts.length - 2];
        return last || null;
      } catch (e) {
        return studio;
      }
    }
    return null;
  };

  // helper: get character PK (from object or from URI/URL last segment)
  
  const characterPk = (ch: any) => {
    if (!ch) return null;
    if (typeof ch === 'object') {
      if (ch.id) return String(ch.id);
      if (ch.pk) return String(ch.pk);
      if (ch.uri) return String(ch.uri).split('/').filter(Boolean).pop() || null;
      if (ch.url) return String(ch.url).split('/').filter(Boolean).pop() || null;
      if (ch.label) return String(ch.label);
    }
    if (typeof ch === 'string') {
      if (ch.includes('/')) {
        const parts = ch.split('/').filter(Boolean);
        return parts.pop() || null;
      }
      return null;
    }
    return null;
  };

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
      return value.map((v: any) => (typeof v === 'string' ? v : nameOf(v))).join(', ');
    }
    if (typeof value === 'string' && value.trim() === '') return 'Informasi tidak tersedia.';
    return String(value);
  };

  return (
    <div className="detail-anime min-h-screen" style={{ maxWidth: 880, margin: '0 auto', padding: 16 }}>
      <Card>
        <CardHeader>
          <div style={{ textAlign: 'center' }}>
            <CardTitle style={{ fontSize: 36, lineHeight: 1.1 }}>{fieldOrEmpty(data.title)}</CardTitle>
            <CardDescription style={{ marginTop: 8 }}>{}</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <div style={{ display: 'flex', gap: 16 }}>
            {data.image ? (
              <div className="thumb" style={{ flex: '0 0 240px' }}>
                <Image
                  src={data.image}
                  alt={data.title}
                  width={240}
                  height={340}
                  className="rounded-lg object-cover"
                />

              </div>
            ) : (
              <div className="thumb" style={{ flex: '0 0 240px', borderRadius: 8, background: '#f3f4f6', height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                Gambar tidak tersedia
              </div>
            )}

            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: 8 }}>{fieldOrEmpty(data.description)}</div>

              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 8 }}>
                <div>
                  <strong>Type:</strong>
                  <div style={{ marginTop: 4 }}>{fieldOrEmpty(data.type ? nameOf(data.type) : null)}</div>
                </div>

                <div>
                  <strong>Episodes:</strong>
                  <div style={{ marginTop: 4 }}>{fieldOrEmpty(data.episodes)}</div>
                </div>

                <div>
                  <strong>Score:</strong>
                  <div style={{ marginTop: 4 }}>{fieldOrEmpty(data.score)}</div>
                </div>

                <div>
                  <strong>Year:</strong>
                  <div style={{ marginTop: 4 }}>{fieldOrEmpty(data.releasedYear)}</div>
                </div>

                <div>
                  <strong>Studio:</strong>
                  <div style={{ marginTop: 6 }}>
                    {data.studio ? (() => {
                      const pk = studioPk(data.studio);
                      const label = nameOf(data.studio);
                      if (pk) {
                        return (
                          <Link href={`/studio/${encodeURIComponent(pk)}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                            {label}
                          </Link>
                        );
                      }
                      return <span>{label}</span>;
                    })() : 'Informasi tidak tersedia.'}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <strong>Genres:</strong>
                <div style={{ marginTop: 6 }}>
                  {Array.isArray(data.genres) && data.genres.length > 0 ? (
                    data.genres.map((g, i) => (
                      <span key={i} style={chipStyle}>{nameOf(g)}</span>
                    ))
                  ) : (
                    <div>Informasi tidak tersedia.</div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <strong>Producers:</strong>
                <div style={{ marginTop: 6 }}>
                  {Array.isArray(data.producers) && data.producers.length > 0 ? (
                    data.producers.map((p, i) => (
                      <span key={i} style={chipStyle}>{nameOf(p)}</span>
                    ))
                  ) : (
                    <div>Informasi tidak tersedia.</div>
                  )}
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <strong>Additional Info</strong>
                <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <strong>ID:</strong>
                    <div style={{ marginTop: 4 }}>{fieldOrEmpty(data.id)}</div>
                  </div>

                  <div>
                    <strong>Airing status:</strong>
                    <div style={{ marginTop: 4 }}>{fieldOrEmpty(data.airingStatus)}</div>
                  </div>

                  <div>
                    <strong>Premiered:</strong>
                    <div style={{ marginTop: 4 }}>{fieldOrEmpty(data.premiered)}</div>
                  </div>

                  <div>
                    <strong>Duration:</strong>
                    <div style={{ marginTop: 4 }}>{fieldOrEmpty(data.duration)}</div>
                  </div>

                  <div>
                    <strong>Rank:</strong>
                    <div style={{ marginTop: 4 }}>{fieldOrEmpty(data.rank)}</div>
                  </div>

                  <div>
                    <strong>Popularity:</strong>
                    <div style={{ marginTop: 4 }}>{fieldOrEmpty(data.popularity)}</div>
                  </div>

                  <div>
                    <strong>Members:</strong>
                    <div style={{ marginTop: 4 }}>{fieldOrEmpty(data.members)}</div>
                  </div>

                  <div>
                    <strong>Favorites:</strong>
                    <div style={{ marginTop: 4 }}>{fieldOrEmpty(data.favorites)}</div>
                  </div>

                  <div>
                    <strong>Source:</strong>
                    <div style={{ marginTop: 4 }}>{data.source ? nameOf(data.source) : 'Informasi tidak tersedia.'}</div>
                  </div>

                  <div>
                    <strong>Released season:</strong>
                    <div style={{ marginTop: 4 }}>{fieldOrEmpty(data.releasedSeason)}</div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <strong>Themes:</strong>
                <div style={{ marginTop: 6 }}>
                  {Array.isArray(data.themes) && data.themes.length > 0 ? (
                    data.themes.map((t, i) => (
                      <span key={i} style={chipStyle}>{nameOf(t)}</span>
                    ))
                  ) : (
                    <div>Informasi tidak tersedia.</div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <strong>Characters:</strong>
                <div style={{ marginTop: 10 }} className="appears-grid">
                  {Array.isArray(data.charactersUri) && data.charactersUri.length > 0 ? (
                    data.charactersUri.map((uri, i) => {
                      const nameFromList = Array.isArray(data.charactersName) ? data.charactersName[i] : undefined;
                      const label = nameFromList && nameFromList.trim() !== '' ? nameFromList : nameOf(uri);
                      const parts = String(uri).split('/').filter(Boolean);
                      const pk = parts.pop() || null;
                      const resolving = !!resolvingMap[i];

                      const handleClick = async () => {
                        if (pk) {
                          router.push(`/character/${encodeURIComponent(pk)}`);
                          return;
                        }

                        try {
                          setResolvingMap((m) => ({ ...m, [i]: true }));
                          const API = process.env.NEXT_PUBLIC_API_URL || '';
                          const url = `${API}/search/character/query/?search=${encodeURIComponent(label)}`;
                          console.debug('[DetailAnime] resolving character', label, 'via', url);
                          const res = await fetch(url);
                          const json = await res.json();
                          console.debug('[DetailAnime] resolver response', json);
                          if (res.ok && json?.status === 200 && Array.isArray(json.data) && json.data.length > 0) {
                            const found = json.data[0];
                            const charUri = found.character || found.uri || found.resource || found?.character;
                            if (charUri && typeof charUri === 'string') {
                              const parts2 = charUri.split('/').filter(Boolean);
                              const resolvedPk = parts2.pop();
                              if (resolvedPk) {
                                router.push(`/character/${encodeURIComponent(resolvedPk)}`);
                                return;
                              }
                            }
                          }

                          alert(`Tidak dapat menemukan karakter untuk "${label}"`);
                        } catch (e) {
                          console.error('[DetailAnime] resolve error', e);
                          alert('Terjadi kesalahan saat mencari karakter');
                        } finally {
                          setResolvingMap((m) => ({ ...m, [i]: false }));
                        }
                      };

                      return (
                        <Button
                          key={i}
                          variant={pk ? 'default' : 'outline'}
                          size="sm"
                          onClick={handleClick}
                          title={pk ? `Open character ${label}` : `Resolve and open ${label}`}
                          aria-label={pk ? `Open character ${label}` : `Resolve and open ${label}`}
                          style={{ margin: 4 }}
                        >
                          {resolving ? 'Loading…' : label}
                        </Button>
                      );
                    })
                  ) : Array.isArray(data.charactersName) && data.charactersName.length > 0 ? (
                    data.charactersName.map((name, i) => {
                      const label = nameOf(name);
                      const resolving = !!resolvingMap[i];
                      const handleClick = async () => {
                        try {
                          setResolvingMap((m) => ({ ...m, [i]: true }));
                          const API = process.env.NEXT_PUBLIC_API_URL || '';
                          const url = `${API}/search/character/query/?search=${encodeURIComponent(label)}`;
                          const res = await fetch(url);
                          const json = await res.json();
                          if (res.ok && json?.status === 200 && Array.isArray(json.data) && json.data.length > 0) {
                            const found = json.data[0];
                            const charUri = found.character || found.uri || found.resource || found?.character;
                            if (charUri && typeof charUri === 'string') {
                              const parts2 = charUri.split('/').filter(Boolean);
                              const resolvedPk = parts2.pop();
                              if (resolvedPk) {
                                router.push(`/character/${encodeURIComponent(resolvedPk)}`);
                                return;
                              }
                            }
                          }
                          alert(`Tidak dapat menemukan karakter untuk "${label}"`);
                        } catch (e) {
                          console.error('[DetailAnime] resolve error', e);
                          alert('Terjadi kesalahan saat mencari karakter');
                        } finally {
                          setResolvingMap((m) => ({ ...m, [i]: false }));
                        }
                      };
                      return (
                        <Button key={i} variant="outline" size="sm" onClick={handleClick} style={{ margin: 4 }}>
                          {resolving ? 'Loading…' : label}
                        </Button>
                      );
                    })
                  ) : (
                    <div>Informasi tidak tersedia.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter />
      </Card>
    </div>
  );
}