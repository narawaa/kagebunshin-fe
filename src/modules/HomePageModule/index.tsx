'use client'

import { useState } from 'react'
import { Search, Info, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { InfoModal } from './components/InfoModal'
import { SearchResultProps } from './interface'
import { ButtonGroup } from '@/components/ui/button-group'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

export const HomePageModule = () => {
  const [query, setQuery] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('first');
  const [results, setResults] = useState<SearchResultProps[]>([]);

  // state for selected item detail, abaikan, nanti ga dipakai
  const [selected, setSelected] = useState<SearchResultProps | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // state for filter: isActiveFilter nunjukin apakah ada filter yg aktif, whichFilter nunjukin filter apa yg aktif (anime/character/genre:namagenre)
  const [isActiveFilter, setIsActiveFilter] = useState<boolean>(false);
  const [whichFilter, setWhichFilter] = useState<string | null>(null)
  
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

  const handleSearch = (e: React.FormEvent) => {
    setSearchQuery(query)

    e.preventDefault()
    if (query.trim() === '') {
      setResults([])
      setSelected(null)
      return
    }

    const filtered = dummyData.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    )
    setResults(filtered)
    setSelected(null)
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
              value={whichFilter?.startsWith("genre:") ? whichFilter : ""}
              onValueChange={(v) => handleFilterChange(v)}
            >
              <SelectTrigger
                className={cn(
                  "h-9! min-w-[120px] px-4 border rounded-md flex items-center border-none",
                  "[&>span]:flex [&>span]:items-center",
                  isActiveFilter && whichFilter?.startsWith("genre:")
                    ? "bg-gray-700 text-white font-medium"
                    : "bg-black text-white font-medium"
                )}
              >
                <SelectValue
                  placeholder="Genre"
                  className="text-white data-placeholder:text-white"
                />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="genre:action">Action</SelectItem>
                <SelectItem value="genre:romance">Romance</SelectItem>
                <SelectItem value="genre:fantasy">Fantasy</SelectItem>
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
        </form>

        {/* results list */}
        <div className="mt-4 w-full">
          {searchQuery !== 'first' && (
            <ul className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
              {results.map((item) => (
                <li
                  key={item.id}
                  className="p-4 hover:bg-slate-50 hover:rounded-2xl cursor-pointer"
                  onClick={() => handleDetail(item)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-medium text-slate-800">{item.label}</p>
                      <p className="text-sm text-left text-slate-500">{item.type}</p>
                    </div>
                    
                    <div className="relative w-5 h-5">
                      <X
                        className={`absolute inset-0 text-slate-400 transition-all duration-200 ${
                          isOpen && selected && selected.id === item.id ? "opacity-100 scale-100" : "opacity-0 scale-75"
                        }`}
                        size={18}
                      />
                      <Info
                        className={`absolute inset-0 text-slate-400 transition-all duration-200 ${
                          isOpen && selected && selected.id === item.id ? "opacity-0 scale-75" : "opacity-100 scale-100"
                        }`}
                        size={18}
                      />
                    </div>

                  </div>
                </li>
              ))}

              {results.length === 0 && (
                <p className="w-3/4 mx-auto text-slate-500 py-4 my-4 text-sm text-center border border-gray-200 border-dashed rounded-lg">
                  No results found for &quot;{searchQuery}&quot;. Try another term.
                </p>
              )}

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
