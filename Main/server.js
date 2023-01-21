const express = require('express')
const mysql = require('mysql2')
const inquirer = require('inquirer')
const consoleTable = require('console.table')

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

//could I remove the 'AS deparment' from the sql line?
app.get('/api/department', async (req, res) => {
    try {
        const result = await db.promise().query('SELECT id, department_name AS department FROM departments')
        res.json(result[0])
    } catch (err) {
        res.status(500).json(err)
    }
})

app.get('/api/role', async (req, res) => {
    try {
        const result = await db.promise().query('SELECT id, title, salary, department_id AS role FROM roles')
        res.json(result[0])
    } catch (err) {
        res.status(500).json(err)
    }
})

app.get('/api/employee', async (req, res) => {
    try {
        const result = await db.promise().query('SELECT id, first_name, last_name, role_id, manager AS employee FROM employees')
        res.json(result[0])
    } catch (err) {
        res.status(500).json(err)
    }
})






app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})



//EXAMPLE FOR BONUS DELETES:
// app.delete('/api/department/:id', async (req, res) => {
//     try {
//         const result = await db.promise().query(`DELETE FROM departments WHERE id = ?`, [req.params.id])
//         res.json(result[0])
//     } catch (err) {
//         res.status(500).json(err)
//     }
// })

