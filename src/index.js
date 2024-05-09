import { createServer } from 'node:http'
import { PORT } from './config.js'

const server = createServer((req, res) => {
  console.log(req, res)
  res.end('hello world')
})

const serverMessage = `Server running on port http://localhost:${PORT}`
server.listen(3000, () => console.log(serverMessage))
