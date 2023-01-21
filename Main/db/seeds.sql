INSERT INTO departments (department_name)
VALUES ("Customer Service"),
       ("Configuration"),
       ("Management");

INSERT INTO roles (title, salary, department_id)
VALUES ("Support Rep", 45000, 1),
       ("Settings Adjuster", 60000, 2),
       ("Manager", 75000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Katy", "Smith", 2, 3),
       ("Sally", "Sue", 3),
       ("Ash", "Ketchum", 1, 3);
