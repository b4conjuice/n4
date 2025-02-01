'use client'

import Link from 'next/link'

import { type Note } from '@/lib/types'
import useSearch from '@/lib/useSearch'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function NoteList({ notes }: { notes: Note[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const query = searchParams.get('q')

  const { search, setSearch, results, searchRef } = useSearch({
    initialSearch: query ? String(query) : '',
    list: notes,
    options: {
      keys: ['title', 'body'],
    },
  })
  useEffect(() => {
    if (query) {
      setSearch(String(query))
    }
  }, [query, setSearch])
  return (
    <>
      <div className='flex'>
        <input
          ref={searchRef}
          type='text'
          className='w-full bg-cb-blue disabled:pointer-events-none disabled:opacity-25'
          placeholder='search'
          value={search}
          onChange={e => {
            const { value } = e.target
            setSearch(value)
            const url = `${pathname}${value ? `?q=${value}` : ''}`
            router.push(url)
          }}
          disabled={!(notes?.length && notes?.length > 0)}
        />
      </div>
      <ul className='divide-y divide-cb-dusty-blue'>
        {results.map(note => (
          <li key={note.id} className='flex py-4 first:pt-0 last:pb-0'>
            <Link
              href={`/notes/${note.id}`}
              className='grow text-cb-pink hover:text-cb-pink/75'
            >
              {note.title}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
