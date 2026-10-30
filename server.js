const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

process.on('uncaughtException',  (e) => { console.error('UNCAUGHT:',  e.stack || e); process.exit(1) })
process.on('unhandledRejection', (e) => { console.error('UNHANDLED:', e && e.stack || e); process.exit(1) })

app.prepare().then(() => {
  createServer((req, res) => handle(req, res, parse(req.url, true)))
    .listen(3000, '127.0.0.1', (err) => {
      if (err) { console.error('LISTEN ERROR:', err); process.exit(1) }
      console.log('> Custom server ready on http://127.0.0.1:3000')
    })
}).catch((ex) => {
  console.error('PREPARE FAILED:', ex.stack || ex)
  process.exit(1)
})
