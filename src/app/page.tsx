import { SignedOut } from '@clerk/nextjs'

import TopNav from '@/app/_components/topNav'
import { Main } from '@/components/ui'
import HomePageNote from './_components/homepage-note'

export default function Home() {
  return (
    <>
      <SignedOut>
        <TopNav />
      </SignedOut>
      <Main className='flex flex-col'>
        <div className='flex flex-grow flex-col space-y-4'>
          <SignedOut>
            <p className='px-4'>sign in to save notes</p>
          </SignedOut>
          <div className='flex flex-grow flex-col'>
            <HomePageNote />
          </div>
        </div>
      </Main>
    </>
  )
}
