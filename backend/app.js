const express = require('express')
const cors = require('cors')
const { getStorage } = require('firebase-admin/storage');
const PORT = 3001

const app = express()


app.use(cors({
    origin: 'http://localhost:3000',
}))

app.listen(PORT,()=>{
    console.log(`Server starting on port ${PORT}`)
})

const bp = require('body-parser')
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
const firebase = require('firebase-admin')
const serviceAccount = require('./movie.json');
const { firestore } = require('firebase-admin');
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
})
const db = firebase.firestore();

app.get('/', (req, res)=>{
    res.json({
        message: "Hello from back"
    })
})


app.post("/add", (req, res)=>{

    db.collection("movies").add({
        title: req.body.tit,
        img: req.body.img, 
        ganr: req.body.ganr,
        country: req.body.country,
        age: req.body.age,
        slogan: req.body.slogan
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });

    
})

let b = []

const get = async(res)=>{
  try{
    const movies = await firestore.collection('movies')
    const data = await movies.get()
    const moviesArray = []
    if(data.empty){
      res.status(404).send(error.message)
    }
    else{
      data.forEact(doc=>{
        moviesArray.push(doc.data())
      })
    }
    res.send(moviesArray)
  }
  catch(error){
    res.status(400).send(error.message)
  }
}
let c = []
app.get('/get', (req, res)=>{
  const moviesArray = []
  db.collection("movies").get().then(querySnapshot => {
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        //console.log(doc.id, " => ", doc.data());
        moviesArray.push(doc.data())
    });
  res.send({message:moviesArray})
})

//   console.log(...c)
//   res.send({message:c})




})

app.get('/del', (req, res)=>{
  const moviesArray = []
  db.collection("movies").get().then(querySnapshot => {
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        //console.log(doc.id, " => ", doc.data());
        moviesArray.push(doc.data())
    });
  res.send({message:moviesArray})
})
})

app.post('/del', (req, res)=>{
  db.collection("movies").where("title", "==", req.body.tit)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            const id = doc.id;
            db.collection("movies").doc(id).delete().then(() => {
              console.log("Document successfully deleted!");
          }).catch((error) => {
              console.error("Error removing document: ", error);
          });
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });

})