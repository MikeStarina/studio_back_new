import * as fs from "fs";
import path from "path";

const clearImage = () => {
  const time = 24 - new Date().getHours();
  // Таймер до 2 ночи
  const timeStartInterval = (time + 2) * 3600 * 1000;
  // Интервал 24 часа
  const timeIntervalClear = 86400000;

  // Запускаем таймер отчет до 2 ночи
  const timer = setTimeout(() => {
    clearTimer();
  }, timeStartInterval);

  const interval = () => {
    // При запуска ф-ции проверяем дату, чистим файлы при совпадении
    if (new Date().getDate().toString() === "28") {
      getFilesAndDelete();
    }
    // Запуск интервала
    setInterval(async () => {
      const date = new Date().getMinutes();
      if (new Date().getDate().toString() === "28") {
        getFilesAndDelete();
      }
    }, timeIntervalClear);
  };

  // Удаление файлов
  function getFilesAndDelete() {
    fs.readdirSync("src/public/uploads/").forEach((file) => {
      console.log(file);
      fs.rm(`./src/public/uploads/${file}`, { recursive: true }, (err) => {
        if (err) {
          throw new Error("Error: File did not delete ");
        }
      });
    });
  }

  // Запуск Интервала и размонтировываем таймер
  function clearTimer() {
    interval();
    clearTimeout(timer);
  }
};

export default clearImage;
