import { SignedIn, SignedOut } from '@clerk/nextjs'

import { Main } from '@/components/ui'
import { getNotes } from '@/server/queries'
import Link from 'next/link'

async function Notes() {
  const notes = await getNotes()
  if (notes.length === 0) return <p>no notes</p>
  return (
    <ul className='divide-y divide-cb-dusty-blue'>
      {notes.map(note => (
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
  )
}

export default function Home() {
  return (
    <Main className='flex flex-col px-4 pb-4'>
      <div className='flex flex-grow flex-col space-y-4'>
        <SignedIn>
          <Notes />
        </SignedIn>
        <SignedOut>
          <p>sign in to view your notes</p>
        </SignedOut>
      </div>
    </Main>
  )
}
