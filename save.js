var firebase = require('firebase');
var serviceAccount = require('./serviceAccountKey.json');
var admin = require('firebase-admin');
var db;

// var config = {
//     apiKey: "AIzaSyBAJ8cwSPm-Gkq9f3hi3wDTP_6hjFSM5TQ",
//     authDomain: "scrapesama.firebaseapp.com",
//     databaseURL: "https://scrapesama.firebaseio.com",
//     storageBucket: "",
//   };
// firebase.initializeApp(config);

function init() {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://scrapesama.firebaseio.com"
    });
}

async function save(data) {
    db = admin.database();
    const ref = db.ref('/');
    const dataPoint = ref.child('/laptops');
    dataPoint.push().set(data);
    console.log('Saved');
}

async function saveToFireStore(data) {
    // db = admin.firestore();
    // db.collection('users').add({
    //       alanisawesome: {
    //         date_of_birth: 'June 23, 1912',
    //         full_name: 'Alan Turing',
    //       },
    //       gracehop: {
    //         date_of_birth: 'December 9, 1906',
    //         full_name: 'Grace Hopper',
    //       },
    //     });  
    data.forEach((entry) => {
        db = admin.firestore();
        const id = db.collection('laptops').add(entry)
        .then((ref) => ref.id);
        console.log('Saved', id);
    });
}

async function getData(collection) {
    db.collection(collection).get()
    .then((data) => {
        console.log(data);
    })
    .catch((e) => {
        console.log('no data found', e);
    })
}




// usersRef.set({
//   alanisawesome: {
//     date_of_birth: 'June 23, 1912',
//     full_name: 'Alan Turing',
//   },
//   gracehop: {
//     date_of_birth: 'December 9, 1906',
//     full_name: 'Grace Hopper',
//   },
// });

module.exports = {
    init,
    save,
    saveToFireStore,
    getData
}