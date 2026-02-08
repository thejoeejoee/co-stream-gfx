import { z } from 'zod'

// Zod schemas for runtime validation
export const LiveFeedRunnerSchema = z.object({
  position: z.string(),
  name: z.string(),
  nationality: z.string(),
  club: z.string(),
  time: z.string(),
  change: z.number().optional()
})

export const LiveFeedSchema = z.object({
  label: z.string(),
  is_national: z.boolean(),
  is_relay: z.boolean(),
  has_leader: z.boolean(),
  finish: z.boolean(),
  leader: LiveFeedRunnerSchema,
  punched: z.boolean(),
  row_idx: z.number(),
  data: z.array(LiveFeedRunnerSchema).optional().nullable()
})

export const KeyValueSchema = z.object({
  key: z.string(),
  value: z.string()
})

export const ParametersSchema = z.object({
  class: z.string(),
  data: z.array(KeyValueSchema)
})

export const FreeTextSchema = z.object({
  title: z.string(),
  text: z.string()
})

export const RaceTitleSchema = z.object({
  title: z.string(),
  date: z.string(),
  place: z.string()
})

export const SpeakerSchema = z.object({
  title: z.string(),
  commentators: z.string()
})

export const WeatherSchema = z.object({
  title: z.string(),
  date: z.string(),
  place: z.string(),
  temperature: z.string(),
  humidity: z.string(),
  wind_speed: z.string()
})

export const StartListRunnerSchema = z.object({
  bib_number: z.string(),
  name: z.string(),
  nationality: z.string(),
  club: z.string(),
  start_time: z.string().optional(),
  start_time_ts: z.number().optional()
})

export const StartListSchema = z.object({
  label: z.string(),
  class: z.string(),
  page: z.number(),
  data: z.array(StartListRunnerSchema),
  is_national: z.boolean(),
  is_relay: z.boolean()
})

export const SingleRunnerSchema = z.object({
  bib_number: z.string(),
  name: z.string(),
  nationality: z.string(),
  club: z.string(),
  detail: z.string(),
  class: z.string(),
  is_national: z.boolean(),
  is_relay: z.boolean()
})

export const StartDetailSchema = z.object({
  bib_number: z.string(),
  name: z.string(),
  nationality: z.string(),
  club: z.string(),
  detail: z.string(),
  start_time: z.string(),
  class: z.string(),
  is_national: z.boolean(),
  is_relay: z.boolean()
})

export const ResultsRunnerSchema = z.object({
  position: z.string(),
  name: z.string(),
  nationality: z.string(),
  club: z.string(),
  time: z.string(),
  change: z.number().optional()
})

export const ResultsSchema = z.object({
  label: z.string(),
  class: z.string(),
  page: z.number(),
  data: z.array(ResultsRunnerSchema),
  is_national: z.boolean(),
  is_relay: z.boolean(),
  finish: z.boolean()
})

export const FlowersRunnerSchema = z.object({
  position: z.string(),
  name: z.string(),
  nationality: z.string(),
  club: z.string()
})

export const FlowersSchema = z.object({
  label: z.string(),
  class: z.string(),
  rows: z.number(),
  data: z.array(FlowersRunnerSchema),
  is_relay: z.boolean(),
  is_national: z.boolean()
})

export const PositionHistoryEntrySchema = z.object({
  position: z.number(),
  time_loss: z.number()
})

export const PositionHistoryRunnerSchema = z.object({
  name: z.string(),
  club: z.string(),
  nationality: z.string(),
  history: z.array(PositionHistoryEntrySchema)
})

export const PositionHistorySchema = z.object({
  class: z.string(),
  is_national: z.boolean(),
  is_relay: z.boolean(),
  controls: z.array(z.string()),
  data: z.array(PositionHistoryRunnerSchema)
})
