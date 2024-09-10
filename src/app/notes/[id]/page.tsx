'use client'

import { Main, Title } from '@/components/ui'
import { api } from '@/trpc/react'

const TEST_PODCAST_EPISODE_ID = 1000668311628

export default function Note() {
  const { data: note } = api.note.get.useQuery({
    podcastEpisodeId: TEST_PODCAST_EPISODE_ID,
  })
  if (!note)
    return (
      <Main className='flex flex-col p-4'>
        <div className='flex flex-grow flex-col items-center justify-center space-y-4'>
          loading
        </div>
      </Main>
    )
  const { title } = note
  return (
    <Main className='flex flex-col p-4'>
      <div className='flex flex-grow flex-col items-center justify-center space-y-4'>
        <Title>{title}</Title>
      </div>
    </Main>
  )
}
