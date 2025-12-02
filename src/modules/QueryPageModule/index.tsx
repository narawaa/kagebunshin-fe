'use client';

import { useState, useMemo } from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { AnimatePresence, motion } from 'framer-motion';
import { SparqlRowProps } from './interface';
import { Textarea } from '@/components/ui/textarea';
import { executeSparqlQuery } from '@/services/queryService';

interface QueryEditorProps {
  value: string;
  onChange: (value: string) => void;
}
  
const QueryEditor = ({ value, onChange }: QueryEditorProps) => {
  const lineCount = Math.max(value.split('\n').length, 4);

  return (
    <div className="flex border border-slate-300 rounded-md overflow-hidden bg-white">
      {/* line numbers */}
      <div
        className="bg-slate-100 px-3 py-2 text-slate-600 text-sm text-right select-none"
        style={{
          whiteSpace: 'pre',
          lineHeight: '1.5',
          minHeight: `${lineCount * 1.5 * 14}px`,
        }}
      >
        {Array.from({ length: lineCount }, (_, i) => `${i + 1}`).join('\n')}
      </div>

      {/* textarea */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="contoh: SELECT ?item WHERE { ?item a ?class } LIMIT 10"
        className="w-full p-2 outline-none text-sm"
        rows={lineCount}
        style={{
          whiteSpace: 'pre',
          resize: 'none',
          lineHeight: '1.5',
        }}
      />
    </div>
  );
};

export const QueryPageModule = () => {
  const [queryType, setQueryType] = useState('sparql');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SparqlRowProps[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const handleRun = async () => {
    const res = await executeSparqlQuery(query);

    if (res.status !== 200) {
      setError(res.message || "Terjadi kesalahan saat menjalankan query. Silakan coba lagi.");
      setResult([]);
      return;
    }

    setError(null);
    setResult(res.data);
  };


  // sorting logic
  const sortedResult = useMemo(() => {
    if (!result) return null;
    if (!sortConfig) return result;

    const { key, direction } = sortConfig;

    return [...result].sort((a, b) => {
      const av = a[key];
      const bv = b[key];

      if (av < bv) return direction === 'asc' ? -1 : 1;
      if (av > bv) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [result, sortConfig]);

  return (
    <div className="w-full min-h-screen px-4 md:px-8 lg:px-16 pb-8 pt-10 space-y-4 bg-white">
      <div className="space-y-1">
        <Label className="text-slate-700">Jenis Console</Label>
        <Select value={queryType} onValueChange={setQueryType}>
          <SelectTrigger className="w-[180px] border-slate-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sparql">SPARQL</SelectItem>
            {/* <SelectItem value="qa">Question Answering</SelectItem> */}
          </SelectContent>
        </Select>
      </div>

      <Card className="border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800 border-l-4 border-orange-400 pl-2">
            {queryType === "sparql"
              ? "SPARQL Query Console"
              : "Question Answering Console"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label className="text-slate-700">
              {queryType === "sparql" ? "Tulis Query" : "Tulis Pertanyaan"}
            </Label>
            
            {queryType === "sparql" ? (
              <QueryEditor value={query} onChange={setQuery} />
            ) : (
              <Textarea
                className="border-slate-300"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="contoh: Apa kandungan gizi dari bawang bombay?"
              />
            )}
            
          </div>

          <Button
            onClick={handleRun}
            className="flex items-center gap-2 text-white"
          >
            <Play size={18} />
            {queryType === "sparql" ? "Jalankan Query" : "Tanya Jawaban"}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-sm text-center text-red-600 border border-red-200">
          {error}
        </p>
      )}

      {!error &&sortedResult && (
        <Card className="border border-slate-300 rounded-xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-800 border-l-4 border-orange-400 pl-2">
              Hasil
            </CardTitle>
          </CardHeader>

          {sortedResult && sortedResult.length > 0 && (
            <CardContent>
              <Table className="rounded-xl overflow-hidden">
                <TableHeader>
                  <TableRow className="bg-orange-200 hover:bg-orange-200">
                    {Object.keys(sortedResult[0]).map((k) => {
                      const isActive = sortConfig?.key === k;
                      const direction = sortConfig?.direction;

                      return (
                        <TableHead
                          key={k}
                          className="text-black font-bold cursor-pointer select-none"
                          onClick={() => {
                            setSortConfig((prev) => {
                              if (prev?.key === k) {
                                return {
                                  key: k,
                                  direction: prev.direction === 'asc' ? 'desc' : 'asc',
                                };
                              }
                              return { key: k, direction: 'asc' };
                            });
                          }}
                        >
                          <div className="flex items-center gap-1">
                            {k}
                            {isActive && (
                              <span className="text-xs">
                                {direction === 'asc' ? '▲' : '▼'}
                              </span>
                            )}
                          </div>
                        </TableHead>
                      );
                    })}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  <AnimatePresence>
                    {sortedResult.map((row, idx) => (
                      <motion.tr
                        key={idx}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.45, delay: idx * 0.1 }}
                        className="hover:bg-orange-50"
                      >
                        {Object.values(row).map((v, i) => (
                          <TableCell key={i} className="text-slate-800">
                            {v}
                          </TableCell>
                        ))}
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </CardContent>
          )}

        </Card>
      )}
    </div>
  );
};
