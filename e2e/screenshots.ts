import { chromium } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'

const DEMOS = [
  'flowers.json', 'flowers.jwoc-men.json', 'flowers.jwoc-men-tie1.json',
  'flowers.jwoc-men-tie1-all.json', 'flowers.jwoc-men-tie3.json',
  'freetext.json', 'live-feed.json', 'live-feed.01.json',
  'live-feed.GFX1.json', 'live-feed.GFX2.json', 'live-feed.projected-2.json',
  'live-feed.relay.01.json',
  'params.json', 'params.01.json', 'position-history.01.json',
  'results.json', 'results.01.json', 'results.changes.json', 'results.ps-dshs.json',
  'single-runner.json', 'single-runner.01.json', 'single-runner.02.json',
  'single-runner.03.json', 'single-runner.04.json', 'speaker.json',
  'start.01.json', 'start.02.json', 'start.03.json', 'start.04.json',
  'start-group.json',
  'startlist.json', 'startlist.01.json', 'startlist.02.json',
  'title.json', 'weather.json',
] as const

const THEMES = [
  { name: 'co', param: '' },
  { name: 'iof', param: '&theme=iof' },
] as const

const CHECKERBOARD_CSS = `
.GfxScreen {
  background-image: repeating-conic-gradient(#cccccc44 0 25%, #0000 0 50%) !important;
  background-position: bottom center !important;
  background-size: 96px 96px !important;
}
`

const ANIMATION_WAIT_MS = 1500

function parseArgs(argv: string[]): { baseUrl: string, outputDir: string } {
  let baseUrl = 'http://localhost:3000'
  let outputDir = './screenshots'

  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--base-url' && argv[i + 1]) {
      baseUrl = argv[i + 1]
      i++
    }
    else if (argv[i] === '--output-dir' && argv[i + 1]) {
      outputDir = argv[i + 1]
      i++
    }
  }

  return { baseUrl, outputDir }
}

function demoName(filename: string): string {
  return filename.replace(/\.json$/, '')
}

async function main() {
  const { baseUrl, outputDir } = parseArgs(process.argv.slice(2))

  fs.mkdirSync(outputDir, { recursive: true })

  const total = DEMOS.length * THEMES.length
  console.log(`Capturing ${total} screenshots (${DEMOS.length} demos x ${THEMES.length} themes)`)
  console.log(`Base URL: ${baseUrl}`)
  console.log(`Output:   ${path.resolve(outputDir)}`)

  const browser = await chromium.launch()
  let count = 0

  for (const demo of DEMOS) {
    for (const theme of THEMES) {
      count++
      const name = demoName(demo)
      const filename = `${name}-${theme.name}.png`
      const url = `${baseUrl}/?show=${demo}${theme.param}`

      const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } })
      const page = await context.newPage()

      await page.goto(url, { waitUntil: 'networkidle' })
      await page.waitForSelector('.GfxScreen', { state: 'visible' })
      await page.addStyleTag({ content: CHECKERBOARD_CSS })
      await page.waitForTimeout(ANIMATION_WAIT_MS)

      const element = page.locator('.GfxScreen')
      await element.screenshot({ path: path.join(outputDir, filename) })

      console.log(`[${count}/${total}] Captured: ${filename}`)
      await context.close()
    }
  }

  await browser.close()
  console.log(`Done. ${count} screenshots saved to ${path.resolve(outputDir)}`)
}

main().catch((error) => {
  console.error('Screenshot capture failed:', error)
  process.exit(1)
})
