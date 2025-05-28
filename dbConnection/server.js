const express = require('express');
const cors = require('cors');
var sql = require("mssql/msnodesqlv8");

const app = express();
const PORT = 5000; 
app.use(cors());
app.use(express.json()); 


const dbConfig = {
    driver: "msnodesqlv8",
    connectionString: "DSN=impulse;Trusted_Connection=Yes;",
};

sql.connect(dbConfig)
    .then(() => console.log('✅ Подключено к MS SQL'))
    .catch(err => console.error('❌ Ошибка подключения:', err));

app.get('/', (req, res) => {
    res.send('Сервер работает! 🚀');
});
// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
