import { createServer } from 'node:http'
import { PORT } from './config.js'
import { getUsers, homePage }
  from './dbController.js'

const server = createServer((req, res) => {
  // GET
  if (req.method === 'GET') {
    switch (req.url) {
      case '/': homePage(res); break
      case '/api/usuarios': getUsers(res); break
      default:
        res.writeHead(404, { 'Content-Type': 'text/html' })
        res.end('<h1>Not Found</h1>')
        break
    }
    // POST
  } else if (req.method === 'POST') {
    console.log('POST')
    res.end('Hello World!')
    // NOT IMPLEMENTED
  } else {
    console.log('Error')
    res.end('Not Implemented')
  }
})
const serverMessage = `Server running on port http://localhost:${PORT}`
server.listen(3000, () => console.log(serverMessage))
