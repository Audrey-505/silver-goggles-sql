INSERT INTO departments (department_name)
VALUES ("Sales"),
       ("Accounting"),
       ("Management");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Rep", 45000, 1),
       ("Accountant", 60000, 2),
       ("Manager", 75000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Dewight", "Schrute", 1, 3),
       ("Kevin", "Melone", 2, 3),
       ("Angela", "Martin", 2, 3);
