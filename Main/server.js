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
                choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role', 'delete an employee', 'delete a department', 'quit']
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
                case "delete an employee":
                    deleteEmployee()
                    break;
                case "delete a department":
                    deleteDepartment()
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
    //const sql = 'SELECT id, first_name, last_name, role_id, manager_id AS employee FROM employees'
    const sql = 'SELECT employees.id, employees.first_name, employees.last_name, employees.manager_id, roles.title, roles.salary FROM employees LEFT JOIN roles on employees.role_id = roles.id'
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
            if(data.manager_id === ''){
                data.manager_id = null
            }
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

const updateEmployeeRole = () => {
    let employeeID = ''
    let roleID = ''

    const sql = 'SELECT id, first_name, last_name, role_id, manager_id AS employee FROM employees'
    db.query(sql, (err, row) => {
        if (err) {
            console.log(err)
        } else {
            let employeeInfo = row
            const employeeChoices = employeeInfo.map(({ id, first_name, last_name }) => (({
                name: first_name,
                value: id
            })))
            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'employee',
                        message: 'select employee to update role',
                        choices: employeeChoices
                    },
                ]).then((data) => {
                    employeeID = data.employee
                    const sql = 'SELECT id, title FROM roles'
                    db.query(sql, (err, row) => {
                        if (err) {
                            console.log(err)
                        } else {
                            var roleInfo = row
                            const roleChoices = roleInfo.map(({ id, title }) => (({
                                name: title,
                                value: id
                            })))
                            inquirer
                                .prompt([
                                    {
                                        type: 'list',
                                        name: 'roles',
                                        message: 'select the employees new role',
                                        choices: roleChoices
                                    },
                                ]).then((data) => {
                                    roleID = data.roles
                                    const sql = 'UPDATE employees SET role_id = ? WHERE id = ?'
                                    db.query(sql, [employeeID, roleID], (err, result) => {
                                        if (err) {
                                            console.log(err)
                                        } else {
                                            console.table(result)
                                            start()
                                        }
                                    })
                                })
                        }
                    })
                })
        }
    })
}

const deleteEmployee = () => {
    let employeeId = ''
    //const sql = 'DELETE FROM employees WHERE id = ?'
    const sql = 'SELECT id, first_name FROM employees'
    db.query(sql, (err, results) => {
        if(err){
            console.log(err)
        } else {
            let employeeInfo = results
            const employeeChoices = employeeInfo.map(({id, first_name}) => (({
                name: first_name,
                value: id
            })))
            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'employee',
                        message: 'select employee to delete',
                        choices: employeeChoices
                    },
                ]).then((data) => {
                    employeeId = data.employee
                    const sql = 'DELETE FROM employees WHERE id = ?'
                    db.query(sql, [employeeId], (err, results) => {
                        if(err){
                            console.log(err)
                        } else {
                            console.table(results)
                            start()
                        }
                    })
            })
        }
    })
}

const deleteDepartment = () => {
    let departmentId = ''
    //const sql = 'DELETE FROM employees WHERE id = ?'
    const sql = 'SELECT id, department_name FROM departments'
    db.query(sql, (err, results) => {
        if(err){
            console.log(err)
        } else {
            let departmentInfo = results
            const departmentChoices = departmentInfo.map(({id, department_name}) => (({
                name: department_name,
                value: id
            })))
            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'department',
                        message: 'select department to delete',
                        choices: departmentChoices
                    },
                ]).then((data) => {
                    departmentId = data.department
                    const sql = 'DELETE FROM departments WHERE id = ?'
                    db.query(sql, [departmentId], (err, results) => {
                        if(err){
                            console.log(err)
                        } else {
                            console.table(results)
                            start()
                        }
                    })
            })
        }
    })
}


// const employeeChoices = () => {
//    const sql = 'SELECT id, first_name, last_name AS employee FROM employees';
// //    db.query =(sql, (err, row) => {
// //     if(err) {
// //         console.log(err)
// //     } else {
// //         return row
// //     }
// //    })
//    const employeeOptions = db.query(sql)
//    console.log(employeeChoices[0])
//    return employeeOptions[0]

// }

start()

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})

