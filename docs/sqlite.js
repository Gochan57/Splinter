/*
 * sqlite.ios.promise.js
 *
 * Created by Andrzej Porebski on 10/29/15.
 * Copyright (c) 2015 Andrzej Porebski.
 *
 * Test App using Promise for react-naive-sqlite-storage
 *
 * This library is available under the terms of the MIT License (2008).
 * See http://opensource.org/licenses/alphabetical for full text.
 */
'use strict';

import React, {Component} from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView
} from 'react-native';

let SQLite = require('react-native-sqlite-storage');
SQLite.DEBUG(true);
SQLite.enablePromise(true);

let database_name = "Test.db";
let database_version = "1.0";
let database_displayname = "SQLite Test Database";
let database_size = 200000;
let db;
let a = 1;
let progress = [];

export default class Splinter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            progress: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => {
                    row1 !== row2;
                },
            })
        }
    }

    componentWillUnmount() {
        this.closeDatabase();
    }

    errorCB(err) {
        console.log("error: ", err);
        progress.push("Error " + (err.message || err));
        this.setState({progress: progress});
    }

    populateDatabase(db) {
        let that = this;
        progress.push("Database integrity check");
        that.setState({progress: progress});
        console.log('db:', db);
        db.executeSql('SELECT 1 FROM Version LIMIT 1').then(() => {
            console.log('SELECT 1 FROM Version LIMIT 1');
            progress.push("Database is ready ... executing query ...");
            that.setState({progress: progress});
            db.transaction(that.queryEmployees).then(() => {
                progress.push("Processing completed");
                that.setState({progress: progress});
            });
        }).catch((error) => {
            console.log("Received error: ", error)
            progress.push("Database not yet ready ... populating data");
            that.setState({progress: progress});
            db.transaction(that.populateDB.bind(that)).then(() => {
                progress.push("Database populated ... executing query ...");
                that.setState({progress: progress});
                db.transaction(that.queryEmployees).then((result) => {
                    console.log("Transaction is now finished");
                    progress.push("Processing completed");
                    that.setState({progress: progress});
                    that.closeDatabase()
                });
            });
        });
    }

    populateDB(tx) {
        let that = this;
        progress.push("Executing DROP stmts");
        this.setState({progress: progress});

        tx.executeSql('DROP TABLE IF EXISTS Employees;');
        tx.executeSql('DROP TABLE IF EXISTS Offices;');
        tx.executeSql('DROP TABLE IF EXISTS Departments;');

        progress.push("Executing CREATE stmts");
        this.setState({progress: progress});

        tx.executeSql('CREATE TABLE IF NOT EXISTS Version( '
            + 'version_id INTEGER PRIMARY KEY NOT NULL); ').catch((error) => {
            that.errorCB(error)
        });

        tx.executeSql('CREATE TABLE IF NOT EXISTS Departments( '
            + 'department_id INTEGER PRIMARY KEY NOT NULL, '
            + 'name VARCHAR(30) ); ').catch((error) => {
            that.errorCB(error)
        });

        tx.executeSql('CREATE TABLE IF NOT EXISTS Offices( '
            + 'office_id INTEGER PRIMARY KEY NOT NULL, '
            + 'name VARCHAR(20), '
            + 'longtitude FLOAT, '
            + 'latitude FLOAT ) ; ').catch((error) => {
            that.errorCB(error)
        });

        tx.executeSql('CREATE TABLE IF NOT EXISTS Employees( '
            + 'employe_id INTEGER PRIMARY KEY NOT NULL, '
            + 'name VARCHAR(55), '
            + 'office INTEGER, '
            + 'department INTEGER, '
            + 'FOREIGN KEY ( office ) REFERENCES Offices ( office_id ) '
            + 'FOREIGN KEY ( department ) REFERENCES Departments ( department_id ));').catch((error) => {
            that.errorCB(error)
        });

        progress.push("Executing INSERT stmts");
        this.setState({progress: progress});


        tx.executeSql('INSERT INTO Departments (name) VALUES ("Client Services");');
        tx.executeSql('INSERT INTO Departments (name) VALUES ("Investor Services");');
        tx.executeSql('INSERT INTO Departments (name) VALUES ("Shipping");');
        tx.executeSql('INSERT INTO Departments (name) VALUES ("Direct Sales");');

        tx.executeSql('INSERT INTO Offices (name, longtitude, latitude) VALUES ("Denver", 59.8,  34.1);');
        tx.executeSql('INSERT INTO Offices (name, longtitude, latitude) VALUES ("Warsaw", 15.7, 54.1);');
        tx.executeSql('INSERT INTO Offices (name, longtitude, latitude) VALUES ("Berlin", 35.3, 12.1);');
        tx.executeSql('INSERT INTO Offices (name, longtitude, latitude) VALUES ("Paris", 10.7, 14.1);');

        tx.executeSql('INSERT INTO Employees (name, office, department) VALUES ("Sylvester Stallone", 2,  4);');
        tx.executeSql('INSERT INTO Employees (name, office, department) VALUES ("Elvis Presley", 2, 4);');
        tx.executeSql('INSERT INTO Employees (name, office, department) VALUES ("Leslie Nelson", 3,  4);');
        tx.executeSql('INSERT INTO Employees (name, office, department) VALUES ("Fidel Castro", 3, 3);');
        tx.executeSql('INSERT INTO Employees (name, office, department) VALUES ("Bill Clinton", 1, 3);');
        tx.executeSql('INSERT INTO Employees (name, office, department) VALUES ("Margaret Thatcher", 1, 3);');
        tx.executeSql('INSERT INTO Employees (name, office, department) VALUES ("Donald Trump", 1, 3);');
        tx.executeSql('INSERT INTO Employees (name, office, department) VALUES ("Dr DRE", 2, 2);');
        tx.executeSql('INSERT INTO Employees (name, office, department) VALUES ("Samantha Fox", 2, 1);');
        console.log("all config SQL done");
    }

    queryEmployees(tx) {
        let that = this;
        console.log("Executing employee query");
        tx.executeSql('SELECT a.name, b.name AS deptName FROM Employees a, Departments b WHERE a.department = b.department_id').then(([tx, results]) => {
            progress.push("Query completed");
            that.setState({progress: progress});
            let len = results.rows.length;
            for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                progress.push(`Empl Name: ${row.name}, Dept Name: ${row.deptName}`);
            }
            that.setState({progress: progress});
        }).catch((error) => {
            console.log(error);
        });
    }

    closeDatabase() {
        let that = this;
        if (db) {
            console.log("Closing database ...");
            progress.push("Closing DB");
            that.setState({progress: progress});
            db.close().then((status) => {
                progress.push("Database CLOSED");
                that.setState({progress: progress});
            }).catch((error) => {
                that.errorCB(error);
            });
        } else {
            progress.push("Database was not OPENED");
            console.log("Hello, Julia");
            that.setState({progress});
        }
    }

    deleteDatabase() {
        let that = this;
        progress = ["Deleting database"];
        that.setState({progress});
        SQLite.deleteDatabase(database_name).then(() => {
            console.log("Database DELETED");
            progress.push("Database DELETED");
            that.setState({progress: progress});
        }).catch((error) => {
            that.errorCB(error);
        });
    }

    loadAndQueryDB = () => {
        let that = this;
        progress.push("Plugin integrity check ...");
        that.setState({progress: progress});
        SQLite.echoTest().then(() => {
            progress.push("Integrity check passed ...");
            that.setState({progress: progress});
            progress.push("Opening database ...");
            that.setState({progress: progress});
            SQLite.openDatabase({name: "myfirst.db"}).then((DB) => {
                db = DB;
                progress.push("Database OPEN");
                that.setState({progress: progress});
                that.populateDatabase(DB);
            }).catch((error) => {
                console.log(error);
            });
        }).catch(error => {
            progress.push("echoTest failed - plugin not functional");
            that.setState({progress: progress});
        });
    }

    runDemo() {
        progress = ["Starting SQLite Demo"];
        this.setState({progress});
        this.loadAndQueryDB();
    }

    renderProgressEntry(entry) {
        return (<View style={listStyles.li}>
            <View>
                <Text style={listStyles.title}>{entry}</Text>
            </View>
        </View>)
    }

    render() {
        let ds = new ListView.DataSource({
            rowHasChanged: (row1, row2) => {
                row1 !== row2;
            }
        });
        return (<View style={styles.mainContainer}>
            <Text>JJJJJJJ</Text>
            <View style={styles.toolbar}>
                <Text style={styles.toolbarButton} onPress={this.runDemo.bind(this)}>
                    Run Demo
                </Text>
                <Text style={styles.toolbarButton} onPress={this.closeDatabase.bind(this)}>
                    Close DB
                </Text>
                <Text style={styles.toolbarButton} onPress={this.deleteDatabase.bind(this)}>
                    Delete DB
                </Text>
            </View>
            <ListView
                dataSource={ds.cloneWithRows(progress)}
                renderRow={this.renderProgressEntry}
                style={listStyles.liContainer}/>
        </View>);
    }
}

let listStyles = StyleSheet.create({
    li: {
        borderBottomColor: '#c8c7cc',
        borderBottomWidth: 0.5,
        paddingTop: 15,
        paddingRight: 15,
        paddingBottom: 15,
    },
    liContainer: {
        backgroundColor: '#fff',
        flex: 1,
        paddingLeft: 15,
    },
    liIndent: {
        flex: 1,
    },
    liText: {
        color: '#333',
        fontSize: 17,
        fontWeight: '400',
        marginBottom: -3.5,
        marginTop: -3.5,
    },
})

let styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    toolbar: {
        backgroundColor: '#51c04d',
        paddingTop: 30,
        paddingBottom: 10,
        flexDirection: 'row'
    },
    toolbarButton: {
        color: 'blue',
        textAlign: 'center',
        flex: 1
    },
    mainContainer: {
        flex: 1
    }
})

AppRegistry.registerComponent('Splinter', () => Splinter)