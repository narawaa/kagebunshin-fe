'use client'

import { useState } from 'react'
import { Search, Info, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { InfoModal } from './components/InfoModal'
import { SearchResultProps } from './interface'

export const HomePageModule = () => {
  const [query, setQuery] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('first');
  const [results, setResults] = useState<SearchResultProps[]>([]);
  const [selected, setSelected] = useState<SearchResultProps | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
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
      <div className="mt-32 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-semibold text-black mb-2"
        >
          Search Your Anime
        </motion.h1>

        {/* search bar */}
        <form
          onSubmit={handleSearch}
          className="flex items-center w-full max-w-xl bg-white border-2 border-black rounded-full shadow-sm overflow-hidden"
        >
          <div className='bg-black rounded-l-full py-3.5 pr-3'>
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
