const express = require('express')
const mysql = require('mysql2')
const PORT = process.env.PORT || 3001
const app = express()

//EXPRESS MIDDLEWARE 
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//CONNECT TO DB
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Riceball11!',
        database: 'company_db'
    },
    console.log('Connected to company_db')
)










app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})