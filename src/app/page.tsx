import { SignedIn, SignedOut } from '@clerk/nextjs'

import TopNav from '@/app/_components/topNav'
import { Main } from '@/components/ui'
import Note from './notes/[id]/note'

export default function Home() {
  return (
    <>
      <SignedOut>
        <TopNav />
        <Main className='flex flex-col px-4 pb-4'>
          <div className='flex flex-grow flex-col space-y-4'>
            <p>sign in to create notes</p>
          </div>
        </Main>
      </SignedOut>
      <SignedIn>
        <Note />
      </SignedIn>
    </>
  )
}
