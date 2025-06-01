const express = require("express");
const cors = require("cors");
const sql = require("mssql/msnodesqlv8");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
const dbConfig = {
  server: "SElena",
  database: "impulse",
  driver: "msnodesqlv8",
  options: {
    trustedConnection: true,
  },
};

sql
  .connect(dbConfig)
  .then(() => console.log("✅ Подключено к MS SQL"))
  .catch((err) => console.error("❌ Ошибка подключения:", err));

const upload = multer({ dest: "uploads" });
app.use(express.static(__dirname));
//Список жанров на главной странице
app.get("/api/genres", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query("SELECT * FROM Genres");
    if (result.recordset.length === 0) {
      return res.status(401).json({ error: "Жанры не найдены" });
    }
    res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//Авторизация пользователя
app.post("/api/user/login", async (req, res) => {
  try {
    const { login, password } = req.body;
    const pool = await sql.connect(dbConfig);
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool
      .request()
      .input("login", sql.VarChar, login)
      .input("password", sql.VarChar, hashedPassword)
      .query("SELECT * FROM Users WHERE Login = @login");
    if (result.recordset.length === 0) {
      return res.status(401).json({ error: "Пользователь не найден" });
    }
    const user = result.recordset[0];
    const hashCheck = await bcrypt.compare(password, user.Password);

    if (!hashCheck) {
      return res.status(401).json({ error: "Неправильный логин или пароль" });
    }
    delete user.Password;
    res.json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//Проверка почты в БД
app.post("/api/user/registration/email", async function (req, res) {
  try {
    const { email } = req.body;
    const pool = await sql.connect(dbConfig);
    const verification = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM Users WHERE Email = @email ");
    if (verification.recordset.length !== 0) {
      return res
        .status(409)
        .json({ error: "Пользователь с введенной почтой уже есть в системе" });
    }
  } catch (error) {
    res.status(500).send(`Ошибка ${error} `);
  }
});
//Проверка пользователя в системе
app.post("/api/user/registration/login", async function (req, res) {
  try {
    const { login } = req.body;
    const pool = await sql.connect(dbConfig);
    const verificationLogin = await pool
      .request()
      .input("login", sql.VarChar, login)
      .query("SELECT * FROM Users WHERE Login = @login ");
    if (verificationLogin.recordset.length !== 0) {
      return res
        .status(409)
        .json({ error: "Пользователь уже зарегистрирован в системе" });
    }
  } catch (error) {
    res.status(500).send(`Ошибка ${error} `);
  }
});
//Регистрация нового пользователя
app.post(
  "/api/user/registration/user",
  upload.single("filedata"),
  async function (req, res) {
    const { email, login, password, nickname, dateOfBirth } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    let filedata = req.file;
    const filePath = filedata.path;
    const fileName = filedata.originalname;
    const yandexPath = `impulse/Image/UserPhoto/${fileName}`;
    try {
      const uploadUrlResponse = await axios.get(
        "https://cloud-api.yandex.net/v1/disk/resources/upload",
        {
          params: { path: yandexPath, overwrite: true },
          headers: {
            Authorization: `OAuth ${process.env.YANDEX_DISK_TOKEN}`,
            Accept: "application/json",
          },
        }
      );

      const uploadUrl = uploadUrlResponse.data.href;
      const fileStream = fs.createReadStream(filePath);
      await axios.put(uploadUrl, fileStream, {
        headers: { "Content-Type": "application/octet-stream" },
      });
      await axios.put(
        "https://cloud-api.yandex.net/v1/disk/resources/publish",
        null,
        {
          params: { path: yandexPath },
          headers: {
            Authorization: `OAuth ${process.env.YANDEX_DISK_TOKEN}`,
            Accept: "application/json",
          },
        }
      );
      const publicUrlResponse = await axios.get(
        "https://cloud-api.yandex.net/v1/disk/resources",
        {
          params: {
            path: yandexPath,
            fields: "public_url",
          },
          headers: {
            Authorization: `OAuth ${process.env.YANDEX_DISK_TOKEN}`,
            Accept: "application/json",
          },
        }
      );
      publicUrl = publicUrlResponse.data.public_url;
      fs.unlink(filePath, (err) => {
        if (err) {
          return res.status(500).send("Ошибка при удалении файла");
        }
      });

      const result = await pool
        .request()
        .input("email", sql.VarChar, email)
        .input("login", sql.VarChar, login)
        .input("password", sql.VarChar, hashedPassword)
        .input("photoProfile", sql.NVarChar, publicUrl)
        .input("nickname", sql.VarChar, nickname)
        .input("dateOfBirth", sql.Date, new Date(dateOfBirth))
        .query(
          "INSERT INTO Users (Login, Password, Email, PhotoProfile, DateOfBirth, Nickname) VALUES (@login, @password, @email, @photoProfile, @dateOfBirth, @nickname)"
        );
      return res
        .status(201)
        .json({ message: "Пользователь успешно зарегистрирован" });
    } catch (error) {
      res.status(500).send("Ошибка");
    }
  }
);
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
