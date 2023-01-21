const express = require('express')
const mysql = require('mysql2')
const inquirer = require('inquirer')
const consoleTable = require('console.table')

const PORT = process.env.PORT || 3001
const app = express()

//EXPRESS MIDDLEWARE 
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//db connection
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Riceball11!',
        database: 'company_db'
    },
    console.log('Connected to company_db')
)

//Inquirer 
function start() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'options',
                message: 'What would you like to do?',
                choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role']
            }
        ]).then((data) => {
            //switch statement for each option / 
            switch (data.choices) {
                case "view all departments":
                    viewAllDepartments()
                    break;
                case "view all roles":
                    viewAllRoles()
                    break;
                case "view all employees":
                    viewAllEmployees()
                    break;
                case "add a department":
                    addADepartment()
                    break;
                case "add a role":
                    addARole()
                    break;
                case "add an employee":
                    addAnEmployee()
                    break;
                case "update an employee role":
                    updateEmployeeRole()
                    break;
                case "exit":
                    process.exit()
            }
        })
}

//create functions for each options 
//could I remove the 'AS deparment' from the sql line?

const viewAllDepartments = () => {
    const sql = 'SELECT id, department_name AS department FROM departments'
    db.query(sql, (err, row) => {
        if (err) {
            console.log(err)
        } else {
            console.log("\n")
            console.table(row[0])
            start()
        }
    })
}

const viewAllRoles = () => {
    const sql = 'SELECT id, title, salary, department_id AS role FROM roles'
    db.query(sql, (err, row) => {
        if (err) {
            console.log(err)
        } else {
            console.log("\n")
            console.table(row)
            start()
        }
    })
}

const viewAllEmployees = () => {
    const sql = 'SELECT id, first_name, last_name, role_id, manager_id AS employee FROM employees'
    db.query(sql, (err, row) => {
        if (err) {
            console.log(err)
        } else {
            console.log("\n")
            console.table(row)
            start()
        }
    })
}

const addADepartment = () => {
    const sql = 'SELECT id, first_name, last_name, role_id, manager_id AS employee FROM employees'
    db.query(sql, (err, row) => {
        if (err) {
            console.log(err)
        } else {
            console.log("\n")
            console.table(row)
            start()
        }
    })
}

start()

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

//COMMENTING OUT FOR TESTING 
// app.get('/api/department', async (req, res) => {
//     try {
//         const result = await db.promise().query('SELECT id, department_name AS department FROM departments')
//         res.json(result[0])
//     } catch (err) {
//         res.status(500).json(err)
//     }
// })

// app.get('/api/role', async (req, res) => {
//     try {
//         const result = await db.promise().query('SELECT id, title, salary, department_id AS role FROM roles')
//         res.json(result[0])
//     } catch (err) {
//         res.status(500).json(err)
//     }
// })

// app.get('/api/employee', async (req, res) => {
//     try {
//         const result = await db.promise().query('SELECT id, first_name, last_name, role_id, manager_id AS employee FROM employees')
//         res.json(result[0])
//     } catch (err) {
//         res.status(500).json(err)
//     }
// })