"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { fetchDetail } from "@/services/detailAnimeService";
import type { AnimeDetailProps, AnimeDetailResponseProps } from "./interface";

type Props = {
  pk: string;
};

export default function DetailAnimePageModule({ pk }: Props) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnimeDetailProps | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pk) return;
    setLoading(true);
    setError(null);
    fetchDetail(pk)
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
            } catch (e) { /* ignore */ }
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

  if (loading) return <div>Loading...</div>;
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
      // try to detect uri-like values
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

  const chipStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '4px 8px',
    margin: '4px',
    borderRadius: 9999,
    background: '#f1f5f9',
    fontSize: 12,
  };

  return (
    <div className="detail-anime min-h-screen" style={{ maxWidth: 880, margin: '0 auto', padding: 16 }}>
      <h1 style={{ fontSize: 36, margin: '8px 0 16px 0', textAlign: 'center', lineHeight: 1.1 }}>{data.title}</h1>
      <div style={{ display: 'flex', gap: 16 }}>
        {data.image && (
          <div className="thumb" style={{ flex: '0 0 240px' }}>
            <img src={data.image} alt={data.title} style={{ maxWidth: '100%', borderRadius: 8 }} />
          </div>
        )}

        <div style={{ flex: 1 }}>
          {data.description && <p style={{ color: '#334155' }}>{data.description}</p>}

          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 8 }}>
            {data.type && (
              <div>
                <strong>Type:</strong>
                <div style={{ marginTop: 4 }}>{nameOf(data.type)}</div>
              </div>
            )}

            {data.episodes && (
              <div>
                <strong>Episodes:</strong>
                <div style={{ marginTop: 4 }}>{nameOf(data.episodes)}</div>
              </div>
            )}

            {data.score && (
              <div>
                <strong>Score:</strong>
                <div style={{ marginTop: 4 }}>{nameOf(data.score)}</div>
              </div>
            )}

            {data.releasedYear && (
              <div>
                <strong>Year:</strong>
                <div style={{ marginTop: 4 }}>{nameOf(data.releasedYear)}</div>
              </div>
            )}

            {data.studio && (
              <div>
                <strong>Studio:</strong>
                <div style={{ marginTop: 6 }}>
                  {(() => {
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
                  })()}
                </div>
              </div>
            )}
          </div>

          {Array.isArray(data.genres) && data.genres.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <strong>Genres:</strong>
              <div style={{ marginTop: 6 }}>
                {data.genres.map((g, i) => (
                  <span key={i} style={chipStyle}>
                    {nameOf(g)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(data.producers) && data.producers.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <strong>Producers:</strong>
              <div style={{ marginTop: 6 }}>
                {data.producers.map((p, i) => (
                  <span key={i} style={chipStyle}>
                    {nameOf(p)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}