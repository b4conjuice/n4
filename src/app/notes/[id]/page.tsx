import { Main } from '@/components/ui'
import { getNoteById } from '@/server/queries'

export default async function Note({ params }: { params: { id: string } }) {
  const note = await getNoteById(Number(params.id))
  if (!note) {
    return (
      <Main className='flex flex-col px-4 pb-4'>
        <div className='flex flex-grow flex-col space-y-4'>
          <p>note does not exist</p>
        </div>
      </Main>
    )
  }
  const { title } = note
  return (
    <Main className='flex flex-col px-4 pb-4'>
      <div className='flex flex-grow flex-col space-y-4'>
        <h2>{title}</h2>
      </div>
    </Main>
  )
}
