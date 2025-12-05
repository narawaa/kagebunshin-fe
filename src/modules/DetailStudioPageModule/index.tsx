"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import fetchStudioDetail from '@/services/detailStudioService';
import type { StudioDetailProps, StudioDetailResponseProps } from './interface';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

type Props = { pk: string };

export default function DetailStudioPageModule({ pk }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<StudioDetailProps | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tooltipMap, setTooltipMap] = useState<Record<string, boolean>>({});

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
            localAnime: Array.isArray(payload.localAnime)
              ? payload.localAnime.map((a: any) => ({ uri: a?.uri ?? a?.anime ?? a?.resource, title: a?.title ?? a?.name ?? a?.label }))
              : [],
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

  const fieldOrEmpty = (value: any) => {
    if (value === null || value === undefined) return 'Informasi tidak tersedia.';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'Informasi tidak tersedia.';
      return value.join(', ');
    }
    if (typeof value === 'string' && value.trim() === '') return 'Informasi tidak tersedia.';
    return String(value);
  };

  return (
    <div className="detail-studio min-h-screen" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 880 }}>
        <Card>
        <CardHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {data.logo ? (
              <img src={data.logo} alt={`${data.name} logo`} style={{ width: 160, height: 160, objectFit: 'contain', borderRadius: 12 }} />
            ) : (
              <div style={{ width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', borderRadius: 12, color: '#9ca3af', fontSize: 14 }}>
                Logo
              </div>
            )}

            <div>
              <CardTitle style={{ fontSize: 34, lineHeight: 1 }}>{fieldOrEmpty(data.name)}</CardTitle>
              <CardDescription style={{ marginTop: 8, fontSize: 15 }}>
                {data.officialWebsite ? (
                  <a href={data.officialWebsite} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>
                    Official website
                  </a>
                ) : (
                  'Informasi tidak tersedia.'
                )}
                {' · '}
                {data.wikidataUri ? (
                  <a href={data.wikidataUri} target="_blank" rel="noreferrer" style={{ color: '#475569' }}>
                    Wikidata
                  </a>
                ) : (
                  'Informasi tidak tersedia.'
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
            <div>
              <strong>Origin Country:</strong>
              <div style={{ marginTop: 6 }}>{fieldOrEmpty(data.originCountry)}</div>
            </div>

            <div>
              <strong>Founders:</strong>
              <div style={{ marginTop: 6 }}>
                {Array.isArray(data.founders) && data.founders.length > 0 ? (
                  <ul>
                    {data.founders.map((f, i) => (
                      <li key={i} style={{ marginBottom: 6 }}>{f}</li>
                    ))}
                  </ul>
                ) : (
                  <div>Informasi tidak tersedia.</div>
                )}
              </div>
            </div>

            <div>
              <strong>Notable Works:</strong>
              <div style={{ marginTop: 6 }}>
                {Array.isArray(data.notableWorks) && data.notableWorks.length > 0 ? (
                  <ul>
                    {data.notableWorks.map((w, i) => (
                      <li key={i} style={{ marginBottom: 6 }}>{nameOf(w)}</li>
                    ))}
                  </ul>
                ) : (
                  <div>Informasi tidak tersedia.</div>
                )}
              </div>
            </div>

            <div>
              <strong>List of Works:</strong>
              <div style={{ marginTop: 6 }}>
                {Array.isArray(data.localAnime) && data.localAnime.length > 0 ? (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {data.localAnime.map((a, i) => {
                      const label = a?.title || nameOf(a?.uri);
                      const pk = animePk(a?.uri);
                      const handleClick = () => {
                        if (pk) {
                          router.push(`/anime/${encodeURIComponent(pk)}`);
                        } else {
                          alert(`Tidak dapat menavigasi ke anime (pk tidak ditemukan) untuk: ${label}`);
                        }
                      };

                      const show = !!tooltipMap[String(i)];

                      return (
                        <div key={a?.uri || i} style={{ position: 'relative', display: 'inline-block' }}>
                          <div
                            style={{
                              position: 'absolute',
                              bottom: 'calc(100% + 8px)',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              background: 'rgba(17,24,39,0.95)',
                              color: '#fff',
                              padding: '6px 8px',
                              borderRadius: 6,
                              fontSize: 12,
                              whiteSpace: 'nowrap',
                              boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
                              opacity: show ? 1 : 0,
                              pointerEvents: show ? 'auto' : 'none',
                              transition: 'opacity 0.12s ease-in-out'
                            }}
                            aria-hidden={!show}
                          >
                            {`Buka: ${label}`}
                          </div>

                          <div
                            onMouseEnter={() => setTooltipMap((m) => ({ ...m, [String(i)]: true }))}
                            onMouseLeave={() => setTooltipMap((m) => ({ ...m, [String(i)]: false }))}
                          >
                            <Button variant="secondary" size="sm" onClick={handleClick}>
                              {label}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
    </div>
  );
}
