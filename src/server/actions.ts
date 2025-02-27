'use server'

import 'server-only'

import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'
import { and } from 'drizzle-orm'

import { type Note } from '@/lib/types'
import { db } from './db'
import {
  saveNote as coreSaveNote,
  deleteNote as coreDeleteNote,
} from './db/notes'

export async function saveNote(note: Note) {
  const user = await auth()

  if (!user.userId) throw new Error('unauthorized')

  const noteId = await coreSaveNote(note)
  revalidatePath(`/notes/${noteId}`)
  return noteId
}

export async function getNotes() {
  const user = await auth()

  if (!user.userId) throw new Error('unauthorized')

  const notes = await db.query.notes.findMany({
    where: (model, { eq }) => eq(model.author, user.userId),
    orderBy: (model, { desc }) => desc(model.updatedAt),
  })
  return notes
}

export async function getNote(id: number) {
  const note = await db.query.notes.findFirst({
    where: (model, { eq }) => and(eq(model.id, id)),
  })

  return note
}

export async function deleteNote(id: number, currentPath = '/') {
  const user = await auth()

  if (!user.userId) throw new Error('unauthorized')

  // TODO: somehow check if note is related to an item in a different table
  await coreDeleteNote(id)
  revalidatePath(currentPath)
}

export async function getTags() {
  const user = await auth()

  if (!user.userId) throw new Error('unauthorized')

  const notes = await getNotes()

  const allTags = notes
    ? [
        ...new Set(
          notes.reduce((allTagsFoo: string[], note: Note) => {
            const { tags } = note
            const noteTags = tags ? [...tags] : []
            return [...allTagsFoo, ...noteTags]
          }, [])
        ),
      ]
    : []

  return allTags
}
