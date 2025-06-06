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

// Обработка ссылок на картинки из Яндекс Диска
async function processYandexLinks(item, fields) {
  const result = { ...item };

  for (const field of fields) {
    if (!item[field]) continue;

    try {
      const publicKey = encodeURIComponent(item[field]);
      const directUrl = `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${publicKey}`;
      const response = await fetch(directUrl);

      if (response.ok) {
        const data = await response.json();
        result[field] = data.href || item[field];
      }
    } catch (error) {
      console.error(`Ошибка при обработке ${field} для ${item}:`, error);
    }
  }

  return result;
}
//Получение жанров для главной страницы
app.get("/api/genres", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query("SELECT * FROM Genres");
    if (result.recordset.length === 0) {
      return res.status(401).json({ error: "Жанры не найдены" });
    }
    const genresWithDirectLinks = await Promise.all(
      result.recordset.map((item) => processYandexLinks(item, ["PhotoCover"]))
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

    const result = await pool
      .request()
      .input("login", sql.VarChar, login)
      .query("SELECT * FROM Users WHERE Login = @login");

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: "Пользователь не найден" });
    }

    const user = result.recordset[0];

    const hashCheck = await bcrypt.compare(password, user.Password);
    if (!hashCheck) {
      return res.status(401).json({ error: "Неправильный логин или пароль" });
    }

    const updatedUser = await processYandexLinks(user, [
      "PhotoProfile",
      "PhotoBackground",
    ]);

    delete updatedUser.Password;
    res.json(updatedUser);
  } catch (err) {
    console.error("Ошибка при входе:", err);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});
//Проверка пользователя в системе по логину
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
// Загрузка файла на Яндекс Диска
async function uploadToYandexDisk(
  file,
  folderPath = "impulse/Image/UserPhoto"
) {
  try {
    const filePath = file.path;
    const fileName = file.originalname;
    const yandexPath = `${folderPath}/${fileName}`;

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

    fs.unlink(filePath, (err) => {
      if (err) console.error("Ошибка при удалении файла ", err);
    });

    return publicUrlResponse.data.public_url;
  } catch (error) {
    console.error("Ошибка при загрузке на Яндекс Диск", error);
    throw error;
  }
}
//Регистрация нового пользователя
app.post(
  "/api/registration/user",
  upload.single("filedata"),
  async function (req, res) {
    const { email, login, password, nickname, dateOfBirth } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const publicUrl = req.file
        ? await uploadToYandexDisk(req.file)
        : "https://disk.yandex.ru/i/yu55Hf_0PHlMeA";

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
//Получение песен для страницы жанра
app.get("/api/genres/songs/:GenreID", async (req, res) => {
  try {
    const { GenreID } = req.params;
    const pool = await sql.connect(dbConfig);

    const result = await pool.request().input("GenreID", sql.Int, GenreID)
      .query(`
        SELECT 
          Songs.SongID, Songs.Title, Songs.Duration, Songs.AudioFile, 
          Albums.PhotoCover, Artists.Nickname 
        FROM Songs 
        INNER JOIN SongGenres ON Songs.SongID = SongGenres.SongID 
        INNER JOIN Albums ON Songs.AlbumID = Albums.AlbumID 
        INNER JOIN AlbumArtists ON Albums.AlbumID = AlbumArtists.AlbumID 
        INNER JOIN Artists ON AlbumArtists.ArtistID = Artists.ArtistID 
        WHERE SongGenres.GenreID = @GenreID
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Песни не найдены" });
    }

    const songsWithDirectLinks = await Promise.all(
      result.recordset.map((item) =>
        processYandexLinks(item, ["PhotoCover", "AudioFile"])
      )
    );

    res.json(songsWithDirectLinks);
  } catch (err) {
    console.error("Ошибка при выполнении запроса", err);
    res.status(500).json({ error: "Ошибка" });
  }
});
//Получение альбомов для главной страницы
app.get("/api/albums", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query("SELECT * FROM Albums");
    if (result.recordset.length === 0) {
      return res.status(401).json({ error: "Альбомы не найдены" });
    }
    const albumsWithDirectLinks = await Promise.all(
      result.recordset.map((item) => processYandexLinks(item, ["PhotoCover"]))
    );

    res.json(albumsWithDirectLinks);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
//Получение песен для страницы альбома
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
      result.recordset.map((item) =>
        processYandexLinks(item, ["PhotoCover", "AudioFile"])
      )
    );

    res.json(songsWithDirectLinks);
  } catch (err) {
    console.log("Ошибка ", err);
    return res.status(500).json({ error: err.message });
  }
});
//Получение плейлистов для главной страницы
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
      result.recordset.map((item) =>
        processYandexLinks(item, ["PhotoCover", "AudioFile"])
      )
    );
    res.json(playlistsWithDirectLinks);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
//Получение песен для страницы плейлиста
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
      result.recordset.map((item) =>
        processYandexLinks(item, ["PhotoCover", "AudioFile"])
      )
    );
    res.json(songsWithDirectLinks);
  } catch (err) {
    console.log("Ошибка ", err);
    return res.status(500).json({ error: err.message });
  }
});
//Получение артистов для главной страницы
app.get("/api/artists", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(`SELECT * FROM Artists`);
    if (result.recordset.length === 0) {
      return res.status(401).json({ error: "Артисты не найдены" });
    }
    const artistsWithDirectLinks = await Promise.all(
      result.recordset.map((item) =>
        processYandexLinks(item, [
          "PhotoProfile",
          "PhotoBackground",
          "BiographyPhoto",
        ])
      )
    );
    res.json(artistsWithDirectLinks);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
//Получение пользователем понравившихся артистов
app.get("/api/favouriteArtists/:UserID", async (req, res) => {
  try {
    const { UserID } = req.params;
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().input("UserId", sql.Int, UserID)
      .query(`SELECT * FROM Artists
INNER JOIN FavoriteArtists ON Artists.ArtistID = FavoriteArtists.ArtistID
WHERE FavoriteArtists.UserID=@UserID`);
    if (result.recordset.length === 0) {
      return res.status(401).json({ error: "Артисты не найдены" });
    }
    const artistsWithDirectLinks = await Promise.all(
      result.recordset.map((item) =>
        processYandexLinks(item, [
          "PhotoProfile",
          "PhotoBackground",
          "BiographyPhoto",
        ])
      )
    );
    res.json(artistsWithDirectLinks);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
//Получение песен для страницы артиста
app.get("/api/artists/songs/:ArtistID", async (req, res) => {
  try {
    const { ArtistID } = req.params;
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("ArtistID", sql.Int, ArtistID)
      .query(
        `SELECT Songs.SongID, Songs.Title, Songs.Duration, Songs.AudioFile, Albums.PhotoCover, Artists.Nickname FROM Songs
         INNER JOIN Albums ON Songs.AlbumID = Albums.AlbumID
         INNER JOIN AlbumArtists ON Albums.AlbumID = AlbumArtists.AlbumID
         INNER JOIN Artists ON AlbumArtists.ArtistID = Artists.ArtistID
         WHERE Artists.ArtistID = @ArtistID`
      );

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Песни не найдены" });
    }

    const artistsWithDirectLinks = await Promise.all(
      result.recordset.map((item) =>
        processYandexLinks(item, ["PhotoCover", "AudioFile"])
      )
    );

    res.json(artistsWithDirectLinks);
  } catch (err) {
    console.log("Ошибка ", err);
    return res.status(500).json({ error: err.message });
  }
});
//Получение альбомов для страницы артиста
app.get("/api/artists/albums/:ArtistID", async (req, res) => {
  try {
    const { ArtistID } = req.params;
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("ArtistID", sql.Int, ArtistID)
      .query(
        `SELECT Albums.PhotoCover, Albums.Title, Albums.AlbumID 
         FROM Albums 
         INNER JOIN AlbumArtists ON Albums.AlbumID = AlbumArtists.AlbumID 
         INNER JOIN Artists ON AlbumArtists.ArtistID = Artists.ArtistID 
         WHERE Artists.ArtistID = @ArtistID`
      );

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Альбомы не найдены" });
    }

    const albumsWithDirectLinks = await Promise.all(
      result.recordset.map((item) => processYandexLinks(item, ["PhotoCover"]))
    );

    res.json(albumsWithDirectLinks);
  } catch (err) {
    console.log("Ошибка ", err);
    return res.status(500).json({ error: err.message });
  }
});
// Получение пользователем понравившихся песен
app.get("/api/favouriteSongs/:UserID", async (req, res) => {
  try {
    const { UserID } = req.params;
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("UserID", sql.Int, UserID)
      .query(
        `SELECT Songs.SongID, Songs.Title, Songs.Duration, Songs.AudioFile, Albums.PhotoCover, Artists.Nickname FROM Songs
         INNER JOIN Albums ON Songs.AlbumID = Albums.AlbumID
         INNER JOIN AlbumArtists ON Albums.AlbumID = AlbumArtists.AlbumID
         INNER JOIN Artists ON AlbumArtists.ArtistID = Artists.ArtistID
		 INNER JOIN FavoriteSongs ON FavoriteSongs.SongID = Songs.SongID
         INNER JOIN Users ON FavoriteSongs.UserID = Users.UserID
         WHERE Users.UserID = @UserID`
      );

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Песни не найдены" });
    }

    const songsWithDirectLinks = await Promise.all(
      result.recordset.map((item) =>
        processYandexLinks(item, ["PhotoCover", "AudioFile"])
      )
    );

    res.json(songsWithDirectLinks);
  } catch (err) {
    console.log("Ошибка ", err);
    return res.status(500).json({ error: err.message });
  }
});
//Получение пользователем понравившихся альбомов
app.get("/api/favouriteAlbums/:UserID", async (req, res) => {
  try {
    const { UserID } = req.params;
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("UserID", sql.Int, UserID)
      .query(
        `SELECT Albums.PhotoCover, Albums.Title, Albums.AlbumID 
         FROM Albums 
         INNER JOIN AlbumArtists ON Albums.AlbumID = AlbumArtists.AlbumID 
         INNER JOIN FavoriteAlbums ON AlbumArtists.AlbumID = FavoriteAlbums.AlbumID 
		 INNER JOIN Users ON FavoriteAlbums.UserID = Users.UserID 
         WHERE Users.UserID = @UserID`
      );

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Альбомы не найдены" });
    }

    const albumsWithDirectLinks = await Promise.all(
      result.recordset.map((item) => processYandexLinks(item, ["PhotoCover"]))
    );

    res.json(albumsWithDirectLinks);
  } catch (err) {
    console.log("Ошибка ", err);
    return res.status(500).json({ error: err.message });
  }
});
//Получение пользователем понравившихся плейлистов
app.get("/api/favouritePlaylists/:UserID", async (req, res) => {
  try {
    const { UserID } = req.params;
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().input("UserID", sql.Int, UserID)
      .query(`SELECT Playlists.Title,Playlists.PlaylistID, 
Playlists.PhotoCover, Playlists.Duration, 
Playlists.FavoriteCounter, Users.Nickname FROM Playlists 
INNER JOIN Users ON Playlists.UserID = Users.UserID 
INNER JOIN FavoritePlaylists ON Playlists.PlaylistID= FavoritePlaylists.PlaylistID WHERE FavoritePlaylists.UserID = @UserID`);
    if (result.recordset.length === 0) {
      return res.status(401).json({ error: "Плейлисты не найдены" });
    }
    const playlistsWithDirectLinks = await Promise.all(
      result.recordset.map((item) =>
        processYandexLinks(item, ["PhotoCover", "AudioFile"])
      )
    );
    res.json(playlistsWithDirectLinks);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
//Получение пользователем созданных плейлистов
app.get("/api/makePlaylists/:UserID", async (req, res) => {
  try {
    const { UserID } = req.params;
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().input("UserID", sql.Int, UserID)
      .query(`SELECT Playlists.Title,Playlists.PlaylistID, Playlists.PhotoCover, Playlists.Duration, Playlists.FavoriteCounter, Users.Nickname FROM Playlists 
INNER JOIN Users ON Playlists.UserID = Users.UserID 
WHERE Playlists.UserID = @UserID`);
    if (result.recordset.length === 0) {
      return res.status(401).json({ error: "Плейлисты не найдены" });
    }
    const playlistsWithDirectLinks = await Promise.all(
      result.recordset.map((item) =>
        processYandexLinks(item, ["PhotoCover", "AudioFile"])
      )
    );
    res.json(playlistsWithDirectLinks);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
//
app.delete("/api/user/settings/:UserID", async (req, res) => {
  try {
    const { UserID } = req.params;
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().input("UserID", sql.Int, UserID)
      .query(`DELETE FROM FavoriteArtists WHERE UserID = @UserID;
DELETE FROM FavoriteAlbums WHERE UserID = @UserID;
DELETE FROM FavoriteSongs WHERE UserID = @UserID;
DELETE FROM FavoritePlaylists WHERE UserID = @UserID;
DELETE FROM FavoritePlaylists WHERE PlaylistID IN (SELECT PlaylistID FROM Playlists WHERE UserID = @UserID);
DELETE FROM PlaylistSongs WHERE PlaylistID IN (SELECT PlaylistID FROM Playlists WHERE UserID = @UserID);
DELETE FROM Playlists WHERE UserID = @UserID;
DELETE FROM Users WHERE UserID = @UserID;`);
    if (result.rowsAffected[0] === 0) {
      return res.status(401).json({ error: "Пользователь не найден" });
    }
    res.status(200).json({ message: "Пользователь успешно удален" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
