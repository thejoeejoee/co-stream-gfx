declare module 'format-duration-time' {
  interface Duration {
    format(pattern: string): string
  }

  export default function duration(value: number, unit?: string): Duration
}
