import { type NextRequest } from 'next/server'

import { getNote } from '@/server/actions'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id
  const note = await getNote(Number(id))
  return Response.json(note)
}
