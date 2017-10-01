const DB_NAME = 'splinter.db'
let db

/**
 * Добавляет путешествие в бд.
 * @param name Название.
 * @param people Массив имен.
 * @returns Обещание.
 */
export async function createTrip (name, people) {
    // TODO return {
    //     [id]: {
    //         name: 'name',
    //         people: {
    //             [id1]: {name: 'name1'},
    //             [id2]: {name: 'name2'},
    //             [id3]: {name: 'name3'},
    //         }
    //     }
    // }
}

export function initDB(SQLite) {
    SQLite.DEBUG(true)
    SQLite.enablePromise(true)

    console.log('Open database...')
    SQLite.openDatabase({name: DB_NAME}).then((DB) => {
        db = DB
        populateDatabase(db);
    }).catch((error) => {
        throw new Error(error);
    });

}

function populateDatabase(db) {
    console.log('Populating db...')
    db.executeSql('SELECT 1 FROM PARAMS').then(() => {
        console.log('Db is already inited')
    }).catch((error) => {
        db.transaction(populateDB);
    })
}

function populateDB(tx) {
    console.log('Drop tables...')
    tx.executeSql('DROP TABLE IF EXISTS Params;')
    tx.executeSql('DROP TABLE IF EXISTS Trip;')
    tx.executeSql('DROP TABLE IF EXISTS Person;')
    tx.executeSql('DROP TABLE IF EXISTS Payment;')
    tx.executeSql('DROP TABLE IF EXISTS PersonPay;')
    tx.executeSql('DROP TABLE IF EXISTS Transfer;')
    tx.executeSql('DROP TABLE IF EXISTS Trade;')

    console.log('Create tables...')
    tx.executeSql('CREATE TABLE IF NOT EXISTS Params(' +
        'key VARCHAR(50) NOT NULL, ' +
        'value VARCHAR(50) NOT NULL); ').catch((error) => {
        throw new Error(error)
    })

    tx.executeSql('CREATE TABLE IF NOT EXISTS Trip(' +
        'id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT, ' +
        'name VARCHAR(50), ' +
        'date DATE);').catch((error) => {
        throw new Error(error)
    })

    tx.executeSql('CREATE TABLE IF NOT EXISTS Person(' +
        'id INTEGER PRIMARY KEY NOT NULL, ' +
        'name VARCHAR(50), ' +
        'tripId INTEGER NOT NULL); ').catch((error) => {
        throw new Error(error)
    })

    tx.executeSql('CREATE TABLE IF NOT EXISTS Payment(' +
        'id INTEGER PRIMARY KEY NOT NULL, ' +
        'name VARCHAR(50), ' +
        'tripId INTEGER NOT NULL, ' +
        'date DATE, ' +
        'spentEqually BOOLEAN, ' +
        'paidOne BOOLEAN, ' +
        'sum DOUBLE);').catch((error) => {
        throw new Error(error)
    })

    tx.executeSql('CREATE TABLE IF NOT EXISTS PaymentPay(' +
        'paymentId INTEGER NOT NULL, ' +
        'personId INTEGER NOT NULL, ' +
        'spent DOUBLE, ' +
        'paid DOUBLE, ' +
        'paidForAll BOOLEAN);').catch((error) => {
        throw new Error(error)
    })

    tx.executeSql('CREATE TABLE IF NOT EXISTS Transfer(' +
        'id INTEGER PRIMARY KEY NOT NULL, ' +
        'tripId INTEGER NOT NULL, ' +
        'date DATE); ').catch((error) => {
        throw new Error(error)
    })

    tx.executeSql('CREATE TABLE IF NOT EXISTS Trade(' +
        'id INTEGER PRIMARY KEY NOT NULL, ' +
        'transferId INTEGER NOT NULL, ' +
        'fromPerson INTEGER, ' +
        'toPerson INTEGER, ' +
        'count DOUBLE); ').catch((error) => {
        throw new Error(error)
    })
}