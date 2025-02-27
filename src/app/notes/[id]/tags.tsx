import classNames from 'classnames'
import { ArrowDownOnSquareIcon } from '@heroicons/react/24/solid'
import { useForm, type SubmitHandler } from 'react-hook-form'

import { Button } from '@/components/ui'
import { type Note } from '@/lib/types'
import { saveNote } from '@/server/actions'

type Inputs = {
  tag: string
}

export default function Tags({
  note,
  allTags,
}: {
  note: Note
  allTags: string[]
}) {
  const tags = note?.tags ?? []

  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm<Inputs>({
    defaultValues: {
      tag: '',
    },
  })
  const onSubmit: SubmitHandler<Inputs> = async data => {
    const newTags = [...tags]
    newTags.push(data.tag)
    const newNote = {
      ...note,
      tags: newTags,
    }
    await saveNote(newNote)
    close()
  }
  return (
    <div className='space-y-2 px-2'>
      <ul className='grid grid-cols-6 gap-2'>
        {allTags.map(tag => (
          <li key={tag}>
            <button
              className={classNames(
                'rounded-lg border bg-cb-blue p-2',
                note.tags?.includes(tag) ? 'border-cb-pink' : 'border-cb-blue'
              )}
              onClick={async () => {
                const newTags = [...tags]
                const index = newTags.findIndex(t => t === tag)
                if (index > -1) {
                  newTags.splice(index, 1)
                } else {
                  newTags.push(tag)
                }
                const newNote = {
                  ...note,
                  tags: newTags,
                }
                await saveNote(newNote)
              }}
            >
              {tag}
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
        <input
          className='w-full bg-cobalt'
          placeholder='new tag'
          {...register('tag')}
        />
        <Button
          type='submit'
          className='disabled:pointer-events-none disabled:opacity-25'
          disabled={!isDirty}
        >
          <ArrowDownOnSquareIcon className='h-6 w-full' />
        </Button>
      </form>
    </div>
  )
}
