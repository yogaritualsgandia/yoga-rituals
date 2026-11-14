import { chromium, devices } from "@playwright/test"

const url = process.env.URL ?? "http://localhost:3100/"
const browser = await chromium.launch()
const context = await browser.newContext({ ...devices["Pixel 5"] })
const page = await context.newPage()

const requests = []
page.on("request", (request) => {
  requests.push({ type: request.resourceType(), url: request.url() })
})

await page.coverage.startJSCoverage({ resetOnNavigation: false })
await page.goto(url, { waitUntil: "networkidle" })
await page.waitForTimeout(2500)
const coverage = await page.coverage.stopJSCoverage()

console.log("=== REQUESTS ===")
for (const request of requests) {
  if (request.type === "script" || request.type === "image") {
    console.log(`${request.type}\t${request.url}`)
  }
}

console.log("\n=== JS COVERAGE ===")
for (const entry of coverage) {
  if (!entry.text) continue
  const total = entry.text.length
  let used = 0
  for (const range of entry.ranges) used += range.end - range.start
  if (total > 2000) {
    console.log(
      `${((used / total) * 100).toFixed(1)}% used\t${(used / 1024).toFixed(1)}/${(total / 1024).toFixed(1)} KiB\t${entry.url}`,
    )
  }
}

await browser.close()
