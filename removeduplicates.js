const fs = require("fs");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const inputFile = "master.csv";
const outputFile = "master_deduplicated.csv";

let eanMap = new Map(); // ean -> { row, hasLetter }
let headers = [];

// Функция для проверки наличия буквы в строке
function containsLetter(str) {
  if (!str || str.trim() === "") return false;
  return /[a-zA-Zа-яА-Я]/.test(str);
}

async function deduplicateCSV() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(inputFile)
      .pipe(csv({ separator: "," }))
      .on("headers", (headerList) => {
        headers = headerList;
      })
      .on("data", (row) => {
        const ean = row["ean"];
        const idOffer = row["id_offer"];
        
        // Если ean пустой - пропускаем строку
        if (!ean || ean.trim() === "") {
          return;
        }
        
        const hasLetter = containsLetter(idOffer);
        
        // Если EAN ещё не встречался
        if (!eanMap.has(ean)) {
          // Сохраняем первую встреченную запись
          eanMap.set(ean, { row, hasLetter });
          console.log(`Добавлен EAN: ${ean} (id_offer: ${idOffer}) - ${hasLetter ? 'с буквами' : 'только цифры'}`);
        } else {
          // EAN уже есть, проверяем нужно ли заменить
          const existing = eanMap.get(ean);
          
          // Если текущая запись не имеет букв, а существующая имеет буквы - заменяем
          if (!hasLetter && existing.hasLetter) {
            eanMap.set(ean, { row, hasLetter });
            console.log(`ЗАМЕНА для EAN ${ean}: старая запись с буквами (${existing.row["id_offer"]}) заменена на новую без букв (${idOffer})`);
          } 
          // Если текущая без букв и существующая тоже без букв - оставляем первую
          // Если текущая с буквами - игнорируем в любом случае
          else if (hasLetter && !existing.hasLetter) {
            console.log(`Дубликат EAN ${ean} с буквами (${idOffer}) пропущен, уже есть запись без букв (${existing.row["id_offer"]})`);
          } else if (!hasLetter && !existing.hasLetter) {
            console.log(`Дубликат EAN ${ean} без букв (${idOffer}) пропущен, уже есть запись без букв (${existing.row["id_offer"]})`);
          } else if (hasLetter && existing.hasLetter) {
            console.log(`Дубликат EAN ${ean} с буквами (${idOffer}) пропущен, уже есть другая запись с буквами (${existing.row["id_offer"]})`);
          }
        }
      })
      .on("end", async () => {
        if (eanMap.size === 0) {
          console.log("Нет данных для сохранения");
          reject("Нет данных");
          return;
        }
        
        // Преобразуем Map в массив строк
        const results = Array.from(eanMap.values()).map(item => item.row);
        
        // Подсчитываем статистику
        const withLetters = Array.from(eanMap.values()).filter(item => item.hasLetter).length;
        const withoutLetters = eanMap.size - withLetters;
        
        // Записываем CSV
        const csvWriter = createCsvWriter({
          path: outputFile,
          header: headers.map((h) => ({ id: h, title: h })),
          delimiter: ",",
          alwaysQuote: true,
        });
        
        await csvWriter.writeRecords(results);
        
        console.log(`\n=== РЕЗУЛЬТАТ ===`);
        console.log(`Всего уникальных EAN: ${eanMap.size}`);
        console.log(`Из них с буквами в id_offer: ${withLetters}`);
        console.log(`Из них без букв в id_offer: ${withoutLetters}`);
        console.log(`CSV сохранён в ${outputFile}`);
        resolve();
      })
      .on("error", reject);
  });
}

// Запуск
deduplicateCSV().catch(console.error);