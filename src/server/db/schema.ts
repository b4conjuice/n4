// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from 'drizzle-orm'
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  integer,
  bigint,
} from 'drizzle-orm/pg-core'

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(name => `podz_${name}`)

export const favorites = createTable(
  'favorite',
  {
    id: serial('id').primaryKey(),
    trackId: integer('track_id').notNull(),
    trackName: varchar('track_name', { length: 256 }).notNull(),
    trackViewUrl: varchar('track_view_url', { length: 1024 }).notNull(),
    artistName: varchar('artist_name', { length: 256 }).notNull(),
    primaryGenreName: varchar('primary_genre_name', { length: 256 }).notNull(),
    userId: varchar('userId', { length: 256 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  example => ({
    nameIndex: index('name_idx').on(example.trackName),
  })
)

export const notes = createTable('note', {
  id: serial('id').primaryKey(),
  podcastId: bigint('podcast_id', { mode: 'number' }).notNull(),
  podcastEpisodeId: bigint('podcast_episode_id', { mode: 'number' }).notNull(),
  text: varchar('text').notNull(),
  title: varchar('title', { length: 256 }).notNull(),
  body: varchar('body').notNull(),
  author: varchar('author', { length: 256 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
})
