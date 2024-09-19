import { Main } from '@/components/ui'
import { getNote } from '@/server/queries'
import Note from './note'

export default async function NotePage({ params }: { params: { id: string } }) {
  const note = await getNote(Number(params.id))
  if (!note) {
    return (
      <Main className='flex flex-col px-4 pb-4'>
        <div className='flex flex-grow flex-col space-y-4'>
          <p>note does not exist</p>
        </div>
      </Main>
    )
  }
  return <Note note={note} />
}
