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
    // Запуск интервала
    setInterval(async () => {
      getFilesAndDelete();
    }, timeIntervalClear);
  };

  // Удаление файлов
  function getFilesAndDelete() {
    const date = new Date().getDate();
    const month = new Date().getMonth() === 0 ? 12 : new Date().getMonth();
    const day = `${month}${date}`;

    fs.readdirSync("src/public/uploads/").forEach((file) => {
      if (file.includes(`-${day}`)) {
        fs.rm(`./src/public/uploads/${file}`, { recursive: true }, (err) => {
          if (err) {
            throw new Error("Error: File did not delete ");
          }
        });
      }
    });
  }

  // Запуск Интервала и размонтировываем таймер
  function clearTimer() {
    interval();
    clearTimeout(timer);
  }
};

export default clearImage;
