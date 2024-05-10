import { createServer } from 'node:http'
import { PORT } from './config.js'
import {
  getUsers, homePage, exportUsers, importUsers,
  validateUsers, saveUsers
}
  from './controller.js'
import { test, testUsers } from './test.js'

// COMMENTS:
// - El método POST (/api/usuarios/import) obtiene un archivo
//   que viene del cliente en el cuerpo de la petición.
//   y con eso realiza la importación de los usuarios
// - Se valida que no ser repitan el Id y el correo.
// - Se valida que los campos estén presentes, con excepción
//   de la fecha de creación y el id, los cuales se crean
//   automaticamente. Si el campo Id está presenta se lo
//   usa para crear el usuario.
// - El archivo de la base de datos está en la raiz del proyecto.

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
