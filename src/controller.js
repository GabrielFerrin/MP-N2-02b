import mysql2 from 'mysql2'
import { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE }
  from './config.js'
import fs from 'node:fs'
import path from 'node:path'

// GET | Home
export function homePage (res) {
  const filePath = path.resolve('./public/home.html')
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/html' })
      res.end('<h2>Error interno: No se pudo acceder al archivo html</h2>')
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(data)
    }
  })
}

// GET | Users
export async function getUsers (res) {
  try {
    const users = await getUsersInternal()
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ Users: users }))
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: err.message }))
  }
}

// GET | Export Users
export async function exportUsers (res) {
  try {
    // get info
    const users = await getUsersInternal()
    // create csv
    const csvFile = createCsv(users)
    // save and send file to the client
    const file = await saveCsv(csvFile)
    res.writeHead(200, { 'Content-Type': 'text/csv' })
    res.end(file)
  } catch (err) {
    // send error
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(err.message)
  }
}

// POST | Import Users
export async function importUsers (req, res) {
  try {
    const preUsers = await getUsersFromFile(req)
    const results = []
    const users = await validateUsers(preUsers, results)
    await saveUsers(users, results)
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: results }))
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: err.message }))
  }
}

// Internal | Get Users
function getUsersInternal () {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM user'
    pool.query(sql, (err, result) => {
      if (err) {
        const message = 'No se pudo acceder a la base de datos'
        reject(new Error(JSON.stringify({ message })))
      } else { resolve(result) }
    })
  })
}

// Internal | Create CSV
function createCsv (users) {
  let csvFile = 'nombres,apellidos,direccion,correo,dni,edad,' +
    'fecha_creacion,telefono\n'
  users.forEach((user, i) => {
    csvFile += user.id + ',' + user.nombres + ',' +
      user.apellidos + ',' + user.direccion + ',' +
      user.correo + ',' + user.dni + ',' + user.edad +
      ',' + user.fecha_creacion + ',' + user.telefono +
      (i !== users.length - 1 ? '\n' : '')
  })
  return csvFile
}

// Internal | Save CSV
function saveCsv (csvFile) {
  return new Promise((resolve, reject) => {
    const filePath = path.resolve('./assets/temp/users.csv')
    fs.writeFile(filePath, csvFile, (err) => {
      if (err) {
        const message = 'No se pudo guardar el archivo CSV'
        reject(new Error(JSON.stringify({ message })))
      } else {
        fs.readFile(filePath, 'utf-8', (err, data) => {
          if (err) {
            const message = 'No se pudo leer el archivo CSV generado'
            reject(new Error(JSON.stringify({ message })))
          } else {
            resolve(data)
          }
        })
      }
    })
  })
}

// Internal | Get Attached File
function getUsersFromFile (req) {
  return new Promise((resolve, reject) => {
    let csvFile = ''
    req.on('data', (chunk) => {
      csvFile += chunk
    })
    req.on('end', () => {
      const users = parseCsv(csvFile)
      resolve(users)
    })
    req.on('error', (err) => {
      reject(new Error(JSON.stringify({ message: err.message })))
    })
  })
}

// Internal | Parse CSV
function parseCsv (csvFile) {
  const lines = csvFile.split('\n')
  const headers = lines[0].split(',')
  const users = []
  lines.forEach((line, i) => {
    const values = line.split(',')
    if (i === 0) return // skip header
    const user = {}
    values.forEach((value, i) => {
      user[headers[i]] = value
    })
    users.push(user)
  })
  return users
}

// Internal | Save Users
export async function saveUsers (users, results) {
  if (!users) { throw new Error('No users provided') }
  for (let i = 0; i < users.length; i++) {
    const user = users[i]
    try {
      results.push(await saveUser(user))
    } catch (err) {
      results.push(JSON.parse(err.message))
    }
  }
}

// Internal | Save User
async function saveUser (user) {
  return new Promise((resolve, reject) => {
    // TODO: la validación del Id y correo no siempre
    // funciona.
    // validate user id
    if (user.id !== undefined) {
      validateUserId(user, reject)
        .catch(error => { reject(error) })
    }
    // validate email
    if (user.correo !== undefined) {
      validateUserEmail(user, reject)
        .catch(error => { reject(error) })
    }
    // save user
    const sql = 'INSERT INTO user SET ?'
    pool.query(sql, user, (err) => {
      if (err) {
        reject(new Error(JSON.stringify({
          id: user.id,
          nombres: user.nombres,
          message: 'Unable to save user in the database',
          error: err.message
        })))
      } else {
        resolve({
          id: user.id,
          nombres: user.nombres,
          message: 'success'
        })
      }
    })
  })
}

// Internal | Validate Users
export function validateUsers (preUsers, results) {
  const invalidList = []
  preUsers.forEach((user, i) => {
    if (!validateUser(user, results)) { invalidList.push(user.id) }
  })
  return preUsers.filter((user) => !invalidList.includes(user.id))
}

// Internal | Validate User
function validateUser (user, results) {
  const errorsList = []
  if (!user?.nombres) errorsList.push('Falta el campo "nombres"')
  if (!user?.apellidos) errorsList.push('Falta el campo "apellido"')
  if (!user?.direccion) errorsList.push('Falta el campo "dirección"')
  if (!user?.correo) errorsList.push('Falta el campo "correo"')
  if (!user?.dni) errorsList.push('Falta el campo "DNI"')
  if (!user?.edad) errorsList.push('Falta el campo "edad"')
  if (!user?.telefono) errorsList.push('Falta el campo "teléfono"')
  if (errorsList.length > 0) {
    results.push({
      id: user?.id || '',
      nombres: user?.nombres || '',
      message: 'Invalid user',
      errors: errorsList
    })
    return false
  } else return true
}

// Internal | Validate User Id
async function validateUserId (user, reject) {
  const sql = 'SELECT * FROM user WHERE id = ?'
  pool.query(sql, user.id, (err, result) => {
    if (err) {
      throw new Error(JSON.stringify({
        id: user.id,
        nombres: user.nombres,
        message: 'Unable to validate user in the database',
        error: err.message
      }))
    } else if (result.length > 0) {
      reject(new Error(JSON.stringify({
        id: user.id,
        nombres: user.nombres,
        message: 'Id: ' + user.id +
          ' already exists in the database'
      })))
    }
  })
}

// Internal | Validate User Email
async function validateUserEmail (user, reject) {
  const sql = 'SELECT * FROM user WHERE correo = ?'
  pool.query(sql, user.correo, (err, result) => {
    if (err) {
      reject(new Error(JSON.stringify({
        id: user.id,
        nombres: user.nombres,
        message: 'Unable to validate user in the database',
        error: err.message
      })))
    } else if (result.length > 0) {
      reject(new Error(JSON.stringify({
        id: user.id,
        nombres: user.nombres,
        message: 'Email: ' + user.correo +
          ' already exists in the database'
      })))
    }
  })
}

// DB
const pool = mysql2.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  dateStrings: 'date'
})
