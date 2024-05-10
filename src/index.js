import { createServer } from 'node:http'
import { PORT } from './config.js'
import {
  getUsers, homePage, exportUsers, importUsers,
  validateUsers, saveUsers
}
  from './controller.js'
import { test, testUsers } from './test.js'

// PREGUNTAS: Line 13 | Se necesita await? Funciona sin await.

const server = createServer((req, res) => {
  if (req.method === 'GET') {
    // GET
    switch (req.url) {
      case '/': homePage(res); break
      case '/api/usuarios': getUsers(res); break
      case '/api/usuarios/export': exportUsers(res); break
      default:
        res.writeHead(404, { 'Content-Type': 'text/html' })
        res.end('<h1>Get method not found</h1>')
        break
    }
  } else if (req.method === 'POST') {
    // POST
    switch (req.url) {
      case '/api/usuarios/import': importUsers(req, res); break
      default:
        res.writeHead(404, { 'Content-Type': 'text/html' })
        res.end('<h1>Post method not found</h1>')
        break
    }
  } else {
    // 404
    res.writeHead(404, { 'Content-Type': 'text/html' })
    res.end('<h1>Method not implemented</h1>')
  }
})
const serverMessage = `Server running on http://localhost:${PORT}`
server.listen(3000, () => console.log(serverMessage))

// TESTS: executed if test is true in test.js
if (test) {
  const results = []
  const users = validateUsers(testUsers, results)
  await saveUsers(users, results)
  console.log(results)
}
