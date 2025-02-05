'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowDownOnSquareIcon,
  Bars2Icon,
  TrashIcon,
  WrenchIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid'
import { useDebounce } from '@uidotdev/usehooks'
import { useAuth } from '@clerk/nextjs'

import useLocalStorage from '@/lib/useLocalStorage'
import { type Note } from '@/lib/types'
import { Button, Footer, Main, Modal } from '@/components/ui'
import { FooterListItem } from '@/components/ui/footer'
import { deleteNote, saveNote } from '@/server/queries'

type FooterType = 'default' | 'tools' | 'share'

export default function NoteComponent({ note }: { note?: Note }) {
  const { isSignedIn } = useAuth()
  const router = useRouter()
  const { text: initialText } = note ?? {}
  const [text, setText] = useState(initialText ?? '')
  const [footerType, setFooterType] = useState<FooterType>('default')
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [currentSelectionStart, setCurrentSelectionStart] = useState(0)
  const [currentSelectionEnd, setCurrentSelectionEnd] = useState(0)
  const [commandKey, setCommandKey] = useLocalStorage('n4-commandKey', '!')
  const [isDiscardChangesModalOpen, setIsDiscardChangesModalOpen] =
    useState(false)

  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus()
    }
  }, [])

  const readOnly = false // !user || user.username !== note?.author
  const hasChanges = text !== (note?.text ?? '')
  const canSave = !readOnly && !(!hasChanges || text === '')

  const debouncedText = useDebounce(text, 500)

  useEffect(() => {
    async function updateNote() {
      if (note) {
        const [title, ...body] = text.split('\n\n')
        const newNote = {
          ...note,
          id: note.id,
          text,
          title: title ?? '',
          body: body.join('\n\n'),
        }

        await saveNote(newNote)
      }
    }
    if (isSignedIn && canSave) {
      void updateNote()
    }
  }, [debouncedText])
  return (
    <>
      <Main className='flex flex-col'>
        <div className='flex flex-grow flex-col space-y-4'>
          <textarea
            ref={textAreaRef}
            className='h-full w-full flex-grow border-none bg-cobalt caret-cb-yellow focus:ring-0'
            value={text}
            onChange={e => {
              setText(e.target.value)
            }}
            onKeyDown={e => {
              const { key, altKey } = e

              const target = e.target as HTMLTextAreaElement
              const selectionStart = Number(target.selectionStart)
              const selectionEnd = Number(target.selectionEnd)

              if (key === ' ') {
                const textSplit = text.split('')
                let spaceIndex = -1
                for (let i = selectionStart; i > -1; i--) {
                  if (
                    i === selectionStart &&
                    (textSplit[i] === ' ' || textSplit[i] === '\n')
                  )
                    continue
                  if (textSplit[i] === ' ' || textSplit[i] === '\n') {
                    spaceIndex = i
                    break
                  }
                }
                let lastWord = ''
                for (let i = spaceIndex + 1; i < selectionStart; i++) {
                  lastWord += textSplit[i]
                }

                const replaceText = (string: string, replaceStr: string) => {
                  const newText = text.replace(string, replaceStr)
                  const newSelectionStart =
                    selectionStart + (replaceStr.length - string.length)

                  if (textAreaRef.current) {
                    textAreaRef.current.value = newText

                    textAreaRef.current.setSelectionRange(
                      newSelectionStart,
                      newSelectionStart
                    )
                  }

                  setText(newText)
                }

                type Command = {
                  action?: () => void
                  replaceStr?: string
                  skipReplace?: boolean
                }
                const createCommand =
                  ({ action, replaceStr = '', skipReplace }: Command) =>
                  () => {
                    if (!skipReplace) {
                      replaceText(lastWord, replaceStr)
                    }
                    if (action) {
                      action()
                    }
                  }

                const [commandName, ...commandArguments] = lastWord
                  .replace(commandKey, '')
                  .split('-')

                const commands: Record<string, () => void> = {
                  clear: createCommand({
                    action: () => {
                      setText('')
                    },
                  }),
                  c: createCommand({
                    action: () => {
                      setText('')
                    },
                  }),
                  fs: createCommand({
                    action: () => {
                      setIsFullScreen(!isFullScreen)
                    },
                  }),
                  date: createCommand({
                    replaceStr: new Date().toLocaleDateString(),
                  }),
                  // time: createCommand({
                  //   replaceStr: new Date().toLocaleDateString(),
                  // }),
                  '?': createCommand({
                    replaceStr: `cmd = ${commandKey}[command]`,
                  }),
                  setcmd: createCommand({
                    action: () => {
                      const newCommandKey = commandArguments[0]
                      if (newCommandKey) {
                        setCommandKey(newCommandKey)
                      } else {
                        console.error('no command key provided')
                      }
                    },
                  }),
                  // n: createCommand({
                  //   action: () => {
                  //     navigateToNotesPage()
                  //   },
                  // }),
                  rev: createCommand({
                    action: () => {
                      const [, ...body] = text.split('\n')
                      const newBody = [...body].reverse()
                      replaceText(
                        body.join('\n'),
                        newBody.join('\n').replace(lastWord, '')
                      )
                    },
                  }),
                  t: createCommand({
                    replaceStr: '\t',
                  }),
                  tab: createCommand({
                    replaceStr: '\t',
                  }),
                }

                const command = commands[commandName ?? '']

                const isCommand = lastWord.startsWith(commandKey) && command
                if (isCommand) {
                  e.preventDefault()
                  command()
                }
              } else if (key === 'Tab') {
                e.preventDefault()

                const newText =
                  text.substring(0, selectionStart) +
                  '\t' +
                  text.substring(selectionEnd, text.length)

                if (textAreaRef.current) {
                  textAreaRef.current.focus()
                  textAreaRef.current.value = newText

                  textAreaRef.current.setSelectionRange(
                    selectionStart + 1,
                    selectionStart + 1
                  )
                }

                setText(newText)
              } else if (altKey && (key === 'ArrowUp' || key === 'ArrowDown')) {
                e.preventDefault()
                const contentArray = text.split('\n')
                let index = 0
                let currentLength = 0
                for (let i = 0; i < contentArray.length; i++) {
                  const currentItem = contentArray[i]
                  if (
                    currentItem &&
                    currentLength + currentItem.length + 1 > selectionStart
                  ) {
                    index = i
                    break
                  }
                  currentLength += (currentItem?.length ?? 0) + 1 // for \n
                }
                const offset = selectionStart - currentLength
                const swapLines = (direction: 'ArrowUp' | 'ArrowDown') => {
                  if (textAreaRef.current) {
                    const swapIndex = index + (direction === 'ArrowUp' ? -1 : 1)
                    const item = contentArray[index] ?? ''
                    const removed = contentArray.splice(swapIndex, 1, item)[0]
                    contentArray[index] = removed ?? ''
                    textAreaRef.current?.focus()
                    textAreaRef.current.value = contentArray.join('\n')
                    // set cursor
                    const newStart =
                      contentArray.reduce(
                        (total, line, idx) =>
                          idx <= swapIndex - 1
                            ? total + line.length + 1
                            : total,
                        0
                      ) + offset
                    textAreaRef.current?.setSelectionRange(newStart, newStart)
                  }
                  setText(contentArray.join('\n'))
                }
                if (key === 'ArrowUp') {
                  if (index > 0) {
                    swapLines(key)
                  }
                } else if (index + 1 < contentArray.length) {
                  // ArrowDown
                  swapLines(key)
                }
              }
            }}
            onKeyUp={e => {
              const target = e.target as HTMLTextAreaElement
              const selectionStart = Number(target.selectionStart)
              const selectionEnd = Number(target.selectionEnd)
              setCurrentSelectionStart(selectionStart)
              setCurrentSelectionEnd(selectionEnd)
            }}
            onFocus={e => {
              const target = e.target as HTMLTextAreaElement
              const selectionStart = Number(target.selectionStart)
              const selectionEnd = Number(target.selectionEnd)
              setCurrentSelectionStart(selectionStart)
              setCurrentSelectionEnd(selectionEnd)
            }}
            onClick={e => {
              const target = e.target as HTMLTextAreaElement
              const selectionStart = Number(target.selectionStart)
              const selectionEnd = Number(target.selectionEnd)
              setCurrentSelectionStart(selectionStart)
              setCurrentSelectionEnd(selectionEnd)
            }}
            readOnly={readOnly}
          />
        </div>
      </Main>
      <Footer>
        {footerType === 'tools' ? (
          <>
            <FooterListItem onClick={() => setFooterType('default')}>
              <XMarkIcon className='h-6 w-6' />
            </FooterListItem>
            {/* {mode === 'text' ? (
              <FooterListItem onClick={() => setMode('list')}>
                <ListBulletIcon className='h-6 w-6' />
              </FooterListItem>
            ) : (
              <FooterListItem onClick={() => setMode('text')}>
                <PencilSquareIcon className='h-6 w-6' />
              </FooterListItem>
            )} */}
            {!readOnly && (
              <FooterListItem
                disabled={!note}
                onClick={async () => {
                  // TODO: confirm delete
                  // setIsConfirmModalOpen(true)

                  if (note) {
                    const id = note.id ?? undefined
                    if (id) {
                      await deleteNote(id)
                    }
                    router.push('/')
                  }
                }}
              >
                <TrashIcon className='h-6 w-6 text-red-600' />
              </FooterListItem>
            )}
          </>
        ) : (
          <>
            {hasChanges ? (
              <FooterListItem
                onClick={() => setIsDiscardChangesModalOpen(true)}
              >
                <Bars2Icon className='h-6 w-6' />
              </FooterListItem>
            ) : (
              <FooterListItem>
                <Link className='flex w-full justify-center py-2' href='/notes'>
                  <Bars2Icon className='h-6 w-6' />
                </Link>
              </FooterListItem>
            )}
            <FooterListItem onClick={() => setFooterType('tools')}>
              <WrenchIcon className='h-6 w-6' />
            </FooterListItem>
            {/* <FooterListItem onClick={() => setFooterType('share')}>
              <ShareIcon className='h-6 w-6' />
            </FooterListItem> */}
            {!readOnly && (
              <FooterListItem
                onClick={async () => {
                  if (note) {
                    const [title, ...body] = text.split('\n\n')
                    const newNote = {
                      ...note,
                      id: note.id,
                      text,
                      title: title ?? '',
                      body: body.join('\n\n'),
                    }
                    await saveNote(newNote)
                  } else {
                    const [title, ...body] = text.split('\n\n')
                    const newNote = {
                      text,
                      title: title ?? '',
                      body: body.join('\n\n'),
                      list: [],
                      tags: [],
                    }
                    const id = await saveNote(newNote)
                    router.push(`/notes/${id}`)
                  }
                }}
                disabled={!canSave}
              >
                <ArrowDownOnSquareIcon className='h-6 w-6' />
              </FooterListItem>
            )}
          </>
        )}
      </Footer>
      <Modal
        isOpen={isDiscardChangesModalOpen}
        setIsOpen={setIsDiscardChangesModalOpen}
        title='discard changes?'
      >
        <div className='flex space-x-4'>
          <Button href='/notes' internal>
            yes
          </Button>
          <Button
            onClick={() => {
              setIsDiscardChangesModalOpen(false)
            }}
          >
            no
          </Button>
        </div>
      </Modal>
    </>
  )
}
