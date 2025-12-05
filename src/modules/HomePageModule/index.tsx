'use client'

import { useState } from 'react'
import { Search, Info, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { InfoModal } from './components/InfoModal'
import { SearchAllResult, SearchAnimeResult, SearchCharacterResult, SearchResultProps } from './interface'
import { searchAll, searchAnime, searchCharacter, searchAnimeByTheme } from "@/services/searchService";
import { ButtonGroup } from '@/components/ui/button-group'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useRouter } from "next/navigation";


export const HomePageModule = () => {
  const [query, setQuery] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('first');
  const [results, setResults] = useState<(SearchAllResult | SearchAnimeResult | SearchCharacterResult)[]>([]);
  
  // state for selected item detail, abaikan, nanti ga dipakai
  const [selected, setSelected] = useState<SearchResultProps | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  // state for filter: isActiveFilter nunjukin apakah ada filter yg aktif, whichFilter nunjukin filter apa yg aktif (anime/character/theme:namatheme)
  const [isActiveFilter, setIsActiveFilter] = useState<boolean>(false);
  const [whichFilter, setWhichFilter] = useState<string | null>(null)
  
  const router = useRouter();
  
  const getPkFromResource = (resource: string) => {
    const parts = resource.split("/");
    return parts[parts.length - 1];
  };
    
  // dummy data
  const dummyData = [
    {
      id: 1,
      label: 'Albert Einstein',
      description: 'Theoretical physicist known for the theory of relativity.',
      type: 'Person',
      born: 'Ulm, Germany',
    },
    {
      id: 2,
      label: 'Marie Curie',
      description: 'Physicist and chemist who conducted pioneering research on radioactivity.',
      type: 'Person',
      born: 'Warsaw, Poland',
    },
    {
      id: 3,
      label: 'Theory of Relativity',
      description: 'A fundamental theory in physics developed by Albert Einstein.',
      type: 'Concept',
      born: '-',
    },
  ]
  
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
    setSearchQuery(query)

    if (e) e.preventDefault();
    if (query.trim() === '') {
      setResults([])
      setSelected(null)
      return
    }

    try {
      let response;

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
    }
  }

  const handleDetail = (item: SearchResultProps) => {
    setIsOpen(!isOpen);
    setSelected({
      id: item.id,
      label: item.label,
      description: item.description ?? '',
      type: item.type ?? '',
      born: item.born ?? ''
    })
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
          <p className='text-xs md:text-sm font-bold'>Filter pencarian berdasarkan:</p>
          <ButtonGroup className='border-2 border-black rounded-lg '>
            <Button
              onClick={() => handleFilterChange('anime')}
              className={isActiveFilter && whichFilter === 'anime' ? 'bg-gray-700' : 'bg-black text-muted-foreground'}
            >
              Anime
            </Button>

            <Button
              onClick={() => handleFilterChange('character')}
              className={isActiveFilter && whichFilter === 'character' ? 'bg-gray-700' : 'bg-black text-muted-foreground'}
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
                <SelectItem value="theme:adult%20cast">Adult Cast</SelectItem>
                <SelectItem value="theme:anthropomorphic">Anthropomorphic</SelectItem>
                <SelectItem value="theme:cgdct">CGDCT</SelectItem>
                <SelectItem value="theme:childcare">Childcare</SelectItem>
                <SelectItem value="theme:combat%20sports">Combat Sports</SelectItem>
                <SelectItem value="theme:crossdressing">Crossdressing</SelectItem>
                <SelectItem value="theme:delinquents">Delinquents</SelectItem>
                <SelectItem value="theme:detective">Detective</SelectItem>
                <SelectItem value="theme:educational">Educational</SelectItem>
                <SelectItem value="theme:gag%20humor">Gag Humor</SelectItem>
                <SelectItem value="theme:gore">Gore</SelectItem>
                <SelectItem value="theme:harem">Harem</SelectItem>
                <SelectItem value="theme:high%20stakes%20game">High Stakes Game</SelectItem>
                <SelectItem value="theme:historical">Historical</SelectItem>
                <SelectItem value="theme:idols%20female">Idols (Female)</SelectItem>
                <SelectItem value="theme:idols%20male">Idols (Male)</SelectItem>
                <SelectItem value="theme:isekai">Isekai</SelectItem>
                <SelectItem value="theme:iyashikei">Iyashikei</SelectItem>
                <SelectItem value="theme:love%20polygon">Love Polygon</SelectItem>
                <SelectItem value="theme:love%20status%20quo">Love Status Quo</SelectItem>
                <SelectItem value="theme:magical%20sex%20shift">Magical Sex Shift</SelectItem>
                <SelectItem value="theme:mahou%20shoujo">Mahou Shoujo</SelectItem>
                <SelectItem value="theme:martial%20arts">Martial Arts</SelectItem>
                <SelectItem value="theme:mecha">Mecha</SelectItem>
                <SelectItem value="theme:medical">Medical</SelectItem>
                <SelectItem value="theme:military">Military</SelectItem>
                <SelectItem value="theme:music">Music</SelectItem>
                <SelectItem value="theme:mythology">Mythology</SelectItem>
                <SelectItem value="theme:organized%20crime">Organized Crime</SelectItem>
                <SelectItem value="theme:otaku%20culture">Otaku Culture</SelectItem>
                <SelectItem value="theme:parody">Parody</SelectItem>
                <SelectItem value="theme:performing%20arts">Performing Arts</SelectItem>
                <SelectItem value="theme:pets">Pets</SelectItem>
                <SelectItem value="theme:psychological">Psychological</SelectItem>
                <SelectItem value="theme:racing">Racing</SelectItem>
                <SelectItem value="theme:reincarnation">Reincarnation</SelectItem>
                <SelectItem value="theme:reverse%20harem">Reverse Harem</SelectItem>
                <SelectItem value="theme:samurai">Samurai</SelectItem>
                <SelectItem value="theme:school">School</SelectItem>
                <SelectItem value="theme:showbiz">Showbiz</SelectItem>
                <SelectItem value="theme:space">Space</SelectItem>
                <SelectItem value="theme:strategy%20game">Strategy Game</SelectItem>
                <SelectItem value="theme:super%20power">Super Power</SelectItem>
                <SelectItem value="theme:survival">Survival</SelectItem>
                <SelectItem value="theme:team%20sports">Team Sports</SelectItem>
                <SelectItem value="theme:time%20travel">Time Travel</SelectItem>
                <SelectItem value="theme:urban%20fantasy">Urban Fantasy</SelectItem>
                <SelectItem value="theme:vampire">Vampire</SelectItem>
                <SelectItem value="theme:video%20game">Video Game</SelectItem>
                <SelectItem value="theme:villainess">Villainess</SelectItem>
                <SelectItem value="theme:visual%20arts">Visual Arts</SelectItem>
                <SelectItem value="theme:workplace">Workplace</SelectItem>
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
            placeholder="Search entities, concepts, or relationships..."
            className="w-full px-4 py-3 outline-none text-slate-800"
          />
          <button type="submit" className="hidden"></button>
        </form>

        {/* results list */}
        <div className="mt-4 w-full">
          {searchQuery !== 'first' && (
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
                        <img
                          src={item.image || placeholderImg}
                          alt={item.title}
                          className="w-20 h-28 object-cover rounded-lg border"
                        />
                      ) : (
                        <img
                          src={charPlaceholderImg}
                          alt="character"
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
                      <img
                        src={item.image || placeholderImg}
                        alt={item.title}
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
                      <img
                          src={charPlaceholderImg}
                          alt="character"
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

        {/* info box */}
        {selected && isOpen && (
          <InfoModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            selected={selected}
          />
        )}
      </div>
    </main>
  )
}
