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
                choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role', 'quit']
            }
        ]).then((data) => {
            //switch statement for each option / 
            switch (data.options) {
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
                case "quit":
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
            console.table(row)
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
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'department_name',
                message: 'what is the new department name?'
            }
        ]).then((data) => {
            const sql = 'INSERT INTO departments (department_name) VALUES (?)';
            const params = [data.department_name]
            db.query(sql, params, (err, row) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log("\n")
                    console.table(row)
                    start()
                }
            })
        })
}

const addARole = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'title',
                message: 'what is the title of the new role?'
            },
            {
                type: 'input',
                name: 'salary',
                message: `what is the new role's salary?`
            },
            {
                type: 'input',
                name: 'department_id',
                message: `what is the role's department id?`
            }
        ]).then((data) => {
            console.log(data)
            //const params = [data.title, data.salary, data.department_id]
            const sql = 'INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)';
            const params = [data.title, data.salary, data.department_id]
            db.query(sql, params, (err, row) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log("\n")
                    console.table(row)
                    start()
                }
            })
            //console.log(test)
        })

}

const addAnEmployee = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'first_name',
                message: `what is the new employee's first name?`
            },
            {
                type: 'input',
                name: 'last_name',
                message: `what is the new employee's last name?`
            },
            {
                type: 'input',
                name: 'role_id',
                message: `what is the new employee's role id?`
            },
            {
                type: 'input',
                name: 'manager_id',
                message: `what is the new employee's manager id?`
            }
        ]).then((data) => {
            const sql = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)';
            const params = [data.first_name, data.last_name, data.role_id, data.manager_id]
            db.query(sql, params, (err, row) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log("\n")
                    console.table(row)
                    start()
                }
            })
        })
}

// const updateEmployeeRole = () => {
//     inquirer
//         .prompt([
//             {
//                 type: 'input',
//                 name: 'employee',
//                 message: `select the employee to update their role`
//             },
//             {
//                 type: 'input',
//                 name: 'role',
//                 message: `select the role to assign the employee`
//             },
//             {
//                 type: 'input',
//                 name: 'role_id',
//                 message: `what is the new employee's role id?`
//             },
//             {
//                 type: 'input',
//                 name: 'manager_id',
//                 message: `what is the new employee's manager id?`
//             }
//         ]).then((data) => {
//             const sql = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?)';
//             const params = [data.first_name, data.last_name, data.role_id, data.manager_id]
//             db.query(sql, params, (err, row) => {
//                 if (err) {
//                     console.log(err)
//                 } else {
//                     console.log("\n")
//                     console.table(row)
//                     start()
//                 }
//             })
//         })
// }

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