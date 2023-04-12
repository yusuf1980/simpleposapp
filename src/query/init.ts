import {ref} from 'vue';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import "@capacitor-community/sqlite";

const database = ref<any>(null)
export const dbs = ref<any>(null)

export const getDB = async () => {
  await database.value?.open()
  console.log({database})
  return database;
} 

export const initDb = async () => {
    try {
        const sqlite = new SQLiteConnection(CapacitorSQLite);
        const db = await sqlite.createConnection(
          "ionic-vue-db", 
          false, 
          "no-encryption", 
          1);
        await db?.open();
        //  alert('database is open!');
        database.value = db;
        dbs.value = db;
        // await dropTable();
        await initDbTable();
        // await addInvoiceSell();
        return db   
      }
      catch(e) {
        alert('error initialiazing '+e)
        console.log("Error Initializing the Database");
        return false
      }
}

const dropTable = async () => {
    try {
          const DROP_TABLE = 
          "DROP TABLE InvoiceSell;"
          await database.value?.run(DROP_TABLE)
          alert('drop table invocesell')
          return true
        }
        catch(e) {
          alert('error drop table')
        }
}

const initDbTable = async () => {
    try {
      const CREATE_TABLE = 
      "CREATE TABLE IF NOT EXISTS InvoiceSell (  invoiceNo INT PRIMARY KEY, [buildingNo] [decimal](28, 0) NOT NULL, aName varchar(250), userNumber varchar(20) NULL, dateG date NOT NULL, [amountPayed] [decimal](18, 6) NULL);"
      await database.value?.run(CREATE_TABLE)
      const CREATE_TABLE_UNIT = 
      "CREATE TABLE IF NOT EXISTS InvoiceSellUnit (  orderNo INT PRIMARY KEY, invoiceNo INT NOT NULL, [aName] [nvarchar](250) NOT NULL, [quantity] [decimal](18, 6) NOT NULL, [price] [decimal](18, 6) NOT NULL, [total] [decimal](18, 6) NULL);"
      await database.value?.run(CREATE_TABLE_UNIT)
      // alert('create invoice sell table')
      return true
    }
    catch(e) {
      alert('error create table '+  e)
      console.log("Error Initializing the Database Table")
    }
}

const addInvoiceSell = async () => {
    try {
      await database.value?.run( 
        'INSERT INTO InvoiceSell (invoiceNo, buildingNo, aName, userNumber, dateG, amountPayed) VALUES (?, ?, ?, ?, ?, ?);', [1, 6, 'Achmad', '6282255291566', '2023-04-07', 300]
        // 'INSERT INTO InvoiceSell (invoiceNo, buildingNo, aName, userNumber, dateG) VALUES (?, ?, ?, ?, ?);', [1, 6, 'Achmad', '6282255291566', '2023-04-07']
      );
      await database.value?.run( 
        'INSERT INTO InvoiceSellUnit (orderNo, invoiceNo, aName, quantity, price, total) VALUES (?, ?, ?, ?, ?, ?);', [1, 1, 'Item 1', 2, 100, 200]
      );
      await database.value?.run( 
        'INSERT INTO InvoiceSellUnit (orderNo, invoiceNo, aName, quantity, price, total) VALUES (?, ?, ?, ?, ?, ?);', [2, 1, 'Item 2', 1, 100, 100]
      );
    //   alert("table insert invoice")
      return true
    }
    catch(e) {
      alert('error' + e);
      console.log("Error add invoice Table")
    }
  }