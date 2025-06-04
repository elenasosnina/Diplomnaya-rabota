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
    const genresWithDirectLinks = await Promise.all(
      result.recordset.map(async (genre) => {
        if (!genre.PhotoCover) return genre;

        try {
          const publicKey = genre.PhotoCover;
          const directUrl = `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${publicKey}`;

          const response = await fetch(directUrl);
          const data = await response.json();
          return {
            ...genre,
            PhotoCover: data.href || genre.PhotoCover,
          };
        } catch (error) {
          console.error(
            `Ошибка при обработке обложки для жанра ${genre.GenreID}:`,
            error
          );
          return genre;
        }
      })
    );
    res.json(genresWithDirectLinks);
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

//Проверка пользователя в системе
app.post("/api/user/registration/login", async (req, res) => {
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
    res.json({ message: "Пользователь не найден" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});
//Регистрация нового пользователя
app.post(
  "/api/registration/user",
  upload.single("filedata"),
  async function (req, res) {
    const { email, login, password, nickname, dateOfBirth } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      let publicUrl = null;

      if (req.file) {
        const filePath = req.file.path;
        const fileName = req.file.originalname;
        const yandexPath = `impulse/Image/UserPhoto/${fileName}`;

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
            console.error("Ошибка при удалении файла:", err);
          }
        });
      } else {
        publicUrl = "https://disk.yandex.ru/i/yu55Hf_0PHlMeA";
      }

      const pool = await sql.connect(dbConfig);
      await pool
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
      console.error(error);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  }
);
//Вывод песен для жанра
app.get("/api/genres/songs/:GenreID", async (req, res) => {
  try {
    const { GenreID } = req.params;
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("GenreID", sql.Int, GenreID)
      .query(
        `SELECT Songs.SongID, Songs.Title, Songs.Duration, Songs.AudioFile, Albums.PhotoCover, Artists.Nickname FROM Songs
         INNER JOIN SongGenres ON Songs.SongID = SongGenres.SongID
         INNER JOIN Albums ON Songs.AlbumID = Albums.AlbumID
         INNER JOIN AlbumArtists ON Albums.AlbumID = AlbumArtists.AlbumID
         INNER JOIN Artists ON AlbumArtists.ArtistID = Artists.ArtistID
         WHERE SongGenres.GenreID = @GenreID`
      );

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Песни не найдены" });
    }

    const songsWithDirectLinks = await Promise.all(
      result.recordset.map(async (song) => {
        if (!song.PhotoCover) return song;

        try {
          const publicKey = song.PhotoCover;
          const audiopublicKey = song.AudioFile;
          const directUrl = `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${publicKey}`;
          const directUrlaudio = `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${audiopublicKey}`;

          const response = await fetch(directUrl);
          const data = await response.json();
          const response2 = await fetch(directUrlaudio);
          const data2 = await response2.json();
          return {
            ...song,
            PhotoCover: data.href || song.PhotoCover,
            AudioFile: data2.href || songAudioFile,
          };
        } catch (error) {
          console.error(
            `Ошибка при обработке обложки для песни ${song.SongID}:`,
            error
          );
          return song;
        }
      })
    );

    res.json(songsWithDirectLinks);
  } catch (err) {
    console.log("Ошибка при выполнении запроса:", err);
    return res.status(500).json({ error: err.message });
  }
});
//Список альбомов на главной странице
app.get("/api/albums", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query("SELECT * FROM Albums");
    if (result.recordset.length === 0) {
      return res.status(401).json({ error: "Альбомы не найдены" });
    }
    const albumsWithDirectLinks = await Promise.all(
      result.recordset.map(async (album) => {
        if (!album.PhotoCover) return album;

        try {
          const publicKey = album.PhotoCover;
          const directUrl = `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${publicKey}`;

          const response = await fetch(directUrl);
          const data = await response.json();
          return {
            ...album,
            PhotoCover: data.href || album.PhotoCover,
          };
        } catch (error) {
          console.error(
            `Ошибка при обработке обложки для альбома ${album.AlbumID}:`,
            error
          );
          return album;
        }
      })
    );
    res.json(albumsWithDirectLinks);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
//Вывод песен для альбома
app.get("/api/albums/songs/:AlbumID", async (req, res) => {
  try {
    const { AlbumID } = req.params;
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("AlbumID", sql.Int, AlbumID)
      .query(
        `SELECT Songs.SongID, Songs.Title, Songs.Duration, Songs.AudioFile, Albums.PhotoCover, Artists.Nickname FROM Songs
         INNER JOIN Albums ON Songs.AlbumID = Albums.AlbumID
         INNER JOIN AlbumArtists ON Albums.AlbumID = AlbumArtists.AlbumID
         INNER JOIN Artists ON AlbumArtists.ArtistID = Artists.ArtistID
         WHERE Songs.AlbumID = @AlbumID`
      );

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Песни не найдены" });
    }

    const songsWithDirectLinks = await Promise.all(
      result.recordset.map(async (song) => {
        if (!song.PhotoCover) return song;

        try {
          const publicKey = song.PhotoCover;
          const audiopublicKey = song.AudioFile;
          const directUrl = `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${publicKey}`;
          const directUrlaudio = `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${audiopublicKey}`;

          const response = await fetch(directUrl);
          const data = await response.json();
          const response2 = await fetch(directUrlaudio);
          const data2 = await response2.json();
          return {
            ...song,
            PhotoCover: data.href || song.PhotoCover,
            AudioFile: data2.href || songAudioFile,
          };
        } catch (error) {
          console.error(
            `Ошибка при обработке обложки для песни ${song.SongID}:`,
            error
          );
          return song;
        }
      })
    );

    res.json(songsWithDirectLinks);
  } catch (err) {
    console.log("Ошибка при выполнении запроса:", err);
    return res.status(500).json({ error: err.message });
  }
});
//Список плейлистов на главной странице
app.get("/api/playlists", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .query(`SELECT Playlists.Title,Playlists.PlaylistID, Playlists.PhotoCover, Playlists.Duration, Playlists.FavoriteCounter, Users.Nickname FROM Playlists
INNER JOIN Users ON Playlists.UserID = Users.UserID`);
    if (result.recordset.length === 0) {
      return res.status(401).json({ error: "Плейлисты не найдены" });
    }
    const playlistsWithDirectLinks = await Promise.all(
      result.recordset.map(async (playlist) => {
        if (!playlist.PhotoCover) return playlist;

        try {
          const publicKey = playlist.PhotoCover;
          const directUrl = `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${publicKey}`;

          const response = await fetch(directUrl);
          const data = await response.json();
          return {
            ...playlist,
            PhotoCover: data.href || playlist.PhotoCover,
          };
        } catch (error) {
          console.error(
            `Ошибка при обработке обложки для плейлиста ${playlist.PlaylistID}:`,
            error
          );
          return playlist;
        }
      })
    );
    res.json(playlistsWithDirectLinks);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
//Вывод песен для альбома
app.get("/api/playlists/songs/:PlaylistID", async (req, res) => {
  try {
    const { PlaylistID } = req.params;
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("PlaylistID", sql.Int, PlaylistID)
      .query(
        `SELECT Songs.SongID, Songs.Title, Songs.Duration, Songs.AudioFile, Albums.PhotoCover, Artists.Nickname FROM Songs
         INNER JOIN Albums ON Songs.AlbumID = Albums.AlbumID
         INNER JOIN AlbumArtists ON Albums.AlbumID = AlbumArtists.AlbumID
         INNER JOIN Artists ON AlbumArtists.ArtistID = Artists.ArtistID
		     INNER JOIN PlaylistSongs ON Songs.SongID = PlaylistSongs.SongID
         INNER JOIN Playlists ON PlaylistSongs.PlaylistID = Playlists.PlaylistID
         WHERE Playlists.PlaylistID = @PlaylistID`
      );

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Песни не найдены" });
    }

    const songsWithDirectLinks = await Promise.all(
      result.recordset.map(async (song) => {
        if (!song.PhotoCover) return song;

        try {
          const publicKey = song.PhotoCover;
          const audiopublicKey = song.AudioFile;
          const directUrl = `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${publicKey}`;
          const directUrlaudio = `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${audiopublicKey}`;

          const response = await fetch(directUrl);
          const data = await response.json();
          const response2 = await fetch(directUrlaudio);
          const data2 = await response2.json();
          return {
            ...song,
            PhotoCover: data.href || song.PhotoCover,
            AudioFile: data2.href || songAudioFile,
          };
        } catch (error) {
          console.error(
            `Ошибка при обработке обложки для песни ${song.SongID}:`,
            error
          );
          return song;
        }
      })
    );

    res.json(songsWithDirectLinks);
  } catch (err) {
    console.log("Ошибка при выполнении запроса:", err);
    return res.status(500).json({ error: err.message });
  }
});
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
