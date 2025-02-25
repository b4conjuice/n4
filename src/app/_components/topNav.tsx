import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/20/solid'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { auth, clerkClient } from '@clerk/nextjs/server'

import TopNavTitle from './topNavTitle'

export default async function TopNav() {
  const { userId }: { userId: string | null } = await auth()
  const client = await clerkClient()
  const user = userId ? await client.users?.getUser(userId) : null
  const username = user?.username
  return (
    <div className='mb-4 flex w-full items-center px-4 pt-4'>
      <TopNavTitle />
      <div className='flex flex-grow justify-end'>
        <SignedOut>
          <SignInButton>
            <ArrowRightStartOnRectangleIcon className='h-6 w-6 hover:cursor-pointer' />
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className='flex space-x-2 text-cb-white'>
            {username && <span>{username}</span>}
            <UserButton />
          </div>
        </SignedIn>
      </div>
    </div>
  )
}
