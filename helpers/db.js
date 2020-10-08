/* import { SQLite } from 'expo-sqlite';

const db = SQLite.openDatabase('places.db');

export const init = () => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, imageUri TEXT NOT NULL, address TEXT NOT NULL, lat REAL NOT NULL, lng REAL NOT NULL);', 
            [],
            () => {
                resolve();
            },
            (_, err) => {
                reject(err);
            });
        });
    });
    return promise;
}

export const insertImage = (title, imageUri, address, lat, lng) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO images (title, imageUri, address, lat, lng) VALUES ();', 
                [],
                () => {
                    resolve();
                },
                (_, err) => {
                    reject(err);
            });
        });
    });
    return promise;
} */