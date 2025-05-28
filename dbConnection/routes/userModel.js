const sql = require('mssql');
const dbConfig = require('../dbConfig');

async function getAll() {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query('SELECT * FROM Students');
    return result.recordset;
}

async function create(studentData) {
    const pool = await sql.connect(dbConfig);
    const { name, age, subject, grade } = studentData;
    await pool.request()
        .input('name', sql.NVarChar, name)
        .input('age', sql.Int, age)
        .input('subject', sql.NVarChar, subject)
        .input('grade', sql.NVarChar, grade)
        .query('INSERT INTO Students (Name, Age, Subject, Grade) VALUES (@name, @age, @subject, @grade)');
    return studentData; // Можно дополнительно получить id и вернуть полностью объект
}

module.exports = {
    getAll,
    create,
    // другие методы: getById, update, delete
};
