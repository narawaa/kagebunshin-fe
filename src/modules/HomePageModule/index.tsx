'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { motion } from 'framer-motion'
import { SearchAllResult, SearchAnimeResult, SearchCharacterResult } from './interface'
import { searchAll, searchAnime, searchCharacter, searchAnimeByTheme } from "@/services/searchService";
import { ButtonGroup } from '@/components/ui/button-group'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useRouter } from "next/navigation";
import { THEMES } from './const'
import Image from 'next/image'


export const HomePageModule = () => {
  const [query, setQuery] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('first');
  const [results, setResults] = useState<(SearchAllResult | SearchAnimeResult | SearchCharacterResult)[]>([]);
  
  // state for filter: isActiveFilter nunjukin apakah ada filter yg aktif, whichFilter nunjukin filter apa yg aktif (anime/character/theme:namatheme)
  const [isActiveFilter, setIsActiveFilter] = useState<boolean>(false);
  const [whichFilter, setWhichFilter] = useState<string | null>(null)
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  
  const getPkFromResource = (resource: string) => {
    const parts = resource.split("/");
    return parts[parts.length - 1];
  };
  
  const handleFilterChange = (filter: string) => {
    if (whichFilter === filter) {
      setIsActiveFilter(!isActiveFilter);
      setWhichFilter(null);

      return;
    }
    
    setIsActiveFilter(true);
    setWhichFilter(filter);
  }

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    setSearchQuery(query)
    console.log("Searching for:", query, "with filter:", whichFilter, "active:", isActiveFilter);

    setLoading(true);
    setResults([]);

    if (query.trim() === '') {
      setResults([])
      setLoading(false);
      return
    }

    try {
      let response;

      // jika query kosong → stop
      if (query.trim() === '') {
        return;
      }

      // 1. no filter
      if (!isActiveFilter || whichFilter === null) {
        response = await searchAll(query);
        setResults(response.data);
        return;
      }

      // 2. anime filter
      if (whichFilter === "anime") {
        response = await searchAnime(query);
        setResults(response.data);
        return;
      }

      // 3. character filter
      if (whichFilter === "character") {
        response = await searchCharacter(query);
        setResults(response.data);
        return;
      }

      // 4. theme filter
      if (whichFilter.startsWith("theme:")) {
        const theme = whichFilter.split(":")[1];
        response = await searchAnimeByTheme(query, theme);
        setResults(response.data);
        return;
      }

    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 md:px-8 lg:px-16 bg-linear-to-b from-white to-slate-100">
      {/* header */}
      <div className="flex flex-col items-center mt-32 text-center w-full">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-semibold text-black mb-2"
        >
          Search Your Anime
        </motion.h1>

        <div className='flex flex-row items-center gap-3 mb-3 pt-8'>
          <p className='text-sm md:text-base font-bold'>Filter pencarian berdasarkan:</p>
          <ButtonGroup className='border-2 border-black rounded-lg '>
            <Button
              onClick={() => handleFilterChange('anime')}
              className={isActiveFilter && whichFilter === 'anime' ? 'bg-gray-700' : 'bg-black text-gray-300'}
            >
              Anime
            </Button>

            <Button
              onClick={() => handleFilterChange('character')}
              className={isActiveFilter && whichFilter === 'character' ? 'bg-gray-700' : 'bg-black text-gray-300'}
            >
              Character
            </Button>

            <Select
              value={whichFilter?.startsWith("theme:") ? whichFilter : ""}
              onValueChange={(v) => handleFilterChange(v)}
            >
              <SelectTrigger
                className={cn(
                  "h-9! min-w-[120px] px-4 border rounded-md flex items-center border-none",
                  "[&>span]:flex [&>span]:items-center",
                  isActiveFilter && whichFilter?.startsWith("theme:")
                    ? "bg-gray-700 text-white font-medium"
                    : "bg-black text-white font-medium"
                )}
              >
                <SelectValue
                  placeholder="Theme"
                  className="text-white data-placeholder:text-white"
                />
              </SelectTrigger>

              <SelectContent className="max-h-64 overflow-y-auto">
                {THEMES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ButtonGroup>
        </div>

        {/* search bar */}
        <form
          onSubmit={handleSearch}
          className="flex items-center w-full max-w-3xl bg-white border-2 border-black rounded-2xl shadow-sm overflow-hidden"
        >
          <div className='bg-black rounded-l-xl py-3.5 pr-3'>
            <Search className="ml-4 text-orange-500" strokeWidth={3} size={20} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search animes, characters, and more..."
            className="w-full px-4 py-3 outline-none text-slate-800"
          />
          <button type="submit" className="hidden"></button>
        </form>

        {loading && (
          <ul className="mt-4 w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            {[...Array(5)].map((_, i) => (
              <li key={i} className="flex items-start gap-4 pb-8">
                <div className="w-20 h-28 rounded-lg bg-slate-200 animate-pulse" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-slate-200 rounded w-1/2 animate-pulse" />
                  <div className="h-3 bg-slate-200 rounded w-1/3 mt-2 animate-pulse" />
                </div>
              </li>
            ))}
          </ul>
        )}

        {!loading && searchQuery !== 'first' && results.length === 0 && (
          <p className="mt-12 text-slate-500">
            No results found. Try searching for something else!
          </p>
        )}

        {/* results list */}
        <div className="mt-4 w-full pb-8">
          {!loading && searchQuery !== 'first' && results.length > 0 && (
            <ul className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
              {results.map((item, index) => {
                const placeholderImg =
                  "https://static.vecteezy.com/system/resources/thumbnails/007/126/491/small/music-play-button-icon-vector.jpg";

                const charPlaceholderImg =
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNwcJGXZGTtXwL4g3uisEOX71bNZsnyTmR4w&s";

                // Search all
                if ("typeLabel" in item) {
                  const isAnime = item.typeLabel === "anime";

                  return (
                    <li
                      key={index}
                      className="flex items-start gap-4 p-4 hover:bg-slate-50 transition"
                      onClick={() => {
                        const pk = getPkFromResource(item.resource);
                        const basePath = isAnime ? "/anime" : "/character";
                        router.push(`${basePath}/${pk}`);
                      }}
                    >
                      {/* IMAGE */}
                      {isAnime ? (
                        <Image
                          src={item.image || placeholderImg}
                          alt={item.title}
                          width={80}
                          height={112}
                          className="w-20 h-28 object-cover rounded-lg border"
                        />
                      ) : (
                        <Image
                          src={charPlaceholderImg}
                          alt="character"
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded-full border"
                        />
                      )}

                      {/* TEXT */}
                      <div className="flex flex-col text-left">
                        <p className="font-semibold text-lg">
                          {isAnime ? item.title : item.fullName}
                        </p>

                        <span
                          className={`text-xs mt-1 px-2 py-1 rounded-full capitalize w-fit
                            ${item.typeLabel === "anime" 
                              ? "bg-green-200 text-green-800" 
                              : "bg-blue-200 text-blue-800"
                            }`}
                        >
                          {item.typeLabel}
                        </span>

                      </div>
                    </li>
                  );
                }

                // search anime
                if ("anime" in item) {
                  return (
                    <li
                      key={index}
                      className="flex items-start gap-4 p-4 hover:bg-slate-50 transition"
                      onClick={() => {
                        const pk = getPkFromResource(item.anime);
                        router.push(`/anime/${pk}`);
                      }}
                    >
                      <Image
                        src={item.image || placeholderImg}
                        alt={item.title}
                        width={80}
                        height={112}
                        className="w-20 h-28 object-cover rounded-lg border"
                      />

                      <div className="flex flex-col text-left">
                        <p className="font-semibold text-lg">{item.title}</p>

                        <p className="text-sm text-slate-600 mt-1">
                          {item.themes.join(", ")}
                        </p>

                        <p className="text-sm mt-2 text-slate-700">
                          ⭐ Score: {item.score || "N/A"}
                        </p>
                      </div>
                    </li>
                  );
                }

                //search character
                if ("char" in item) {
                  return (
                    <li
                      key={index}
                      className="flex items-start gap-4 p-4 hover:bg-slate-50 transition"
                      onClick={() => {
                        const pk = getPkFromResource(item.char);
                        router.push(`/character/${pk}`);
                      }}
                    >
                      <Image
                          src={charPlaceholderImg}
                          alt="character"
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded-lg border"
                      />

                      <div className="flex flex-col text-left">
                        <p className="font-semibold text-lg">{item.name}</p>

                        <p className="text-sm text-slate-600 mt-1">
                          Anime: {item.animeList.join(", ")}
                        </p>

                        <p className="text-sm mt-2 text-slate-700">
                          ⭐ Score: {item.score || "N/A"}
                        </p>
                      </div>
                    </li>
                  );
                }

                return null;
              })}

            </ul>
          )}
        
        </div>
      </div>
    </main>
  )
}
