import { Main } from '@/components/ui'
import { SignedIn, SignedOut } from '@clerk/nextjs'

export default function Home() {
  return (
    <Main className='flex flex-col px-4 pb-4'>
      <div className='flex flex-grow flex-col space-y-4'>
        <SignedIn>
          <p>your notes</p>
        </SignedIn>
        <SignedOut>
          <p>sign in to view your notes</p>
        </SignedOut>
      </div>
    </Main>
  )
}
