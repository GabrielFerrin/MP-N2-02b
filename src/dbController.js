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
export function getUsers (res) {
  const sql = 'SELECT * FROM user'
  pool.query(sql, (err, result) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      res.end(JSON.stringify(err))
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(result))
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
