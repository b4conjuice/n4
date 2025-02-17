import { SignedIn, SignedOut } from '@clerk/nextjs'

import TopNav from '@/app/_components/topNav'
import { Main } from '@/components/ui'
import { getNotes } from '@/server/queries'
import NoteList from './note-list'

async function Notes() {
  const notes = await getNotes()
  if (notes.length === 0) return <p>no notes</p>
  return <NoteList notes={notes} />
}

export default function NotesPage() {
  return (
    <>
      <TopNav />
      <Main className='flex flex-col px-4'>
        <div className='flex flex-grow flex-col space-y-4'>
          <SignedIn>
            <Notes />
          </SignedIn>
          <SignedOut>
            <p>sign in to view your notes</p>
          </SignedOut>
        </div>
      </Main>
    </>
  )
}
