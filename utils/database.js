const mysql = require("mysql");

const createConnection = () => {
  return mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "root",
    database: "QLKS",
  });
};
module.exports = {
  load: (sql) => {
    return new Promise((resolve, reject) => {
      const connection = createConnection();
      connection.connect();
      connection.query(sql, (error, results, fields) => {
        if (error) reject(error);
        else {
          return resolve(results);
        }
        connection.end();
      });
    });
  },

  add: (tablename, entity) => {
    return new Promise((resolve, reject) => {
      const sql = `insert into ${tablename} set ?`;
      const connection = createConnection();
      connection.connect();
      connection.query(sql, entity, (error, value) => {
        if (error) reject(error);
        else {
          return resolve(value.insertId);
        }
        connection.end();
      });
    });
  },

  update: (tablename, idField, entity) => {
    return new Promise((resolve, reject) => {
      const id = entity[idField];
      delete entity[idField];
      const sql = `update ${tablename} set ? where ${idField} = ?`;
      const connection = createConnection();
      connection.connect();
      connection.query(sql, [entity, id], (error, value) => {
        if (error) reject(error);
        else {
          return resolve(value.changeRows);
        }
        connection.end();
      });
    });
  },

  delete: (tablename, idField, id) => {
    return new Promise((resolve, reject) => {
      const sql = `delete from ${tablename} where ${idField} = ?`;
      const connection = createConnection();
      connection.connect();
      connection.query(sql, id, (error, value) => {
        if (error) reject(error);
        else {
          resolve(value.affectedRows);
        }
        connection.end();
      });
    });
  },
};
