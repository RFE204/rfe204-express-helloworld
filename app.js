const express = require('express')
const fs = require('fs')

//  create 
const PORT = process.env.PORT || 3000
const app = express()


// middleewares
app.use(
    express.json()
)

const DB_PATH = './db.json'
const db = require(DB_PATH)

// routes
app.get('/users', function (req, res) {
    console.log("req", req)
    res.json(db.users)
})
app.post('/users', function (req, res) {
    const new_user = req.body
    db.users.push(new_user)
    fs.writeFileSync(DB_PATH, JSON.stringify(db))
    res.status(201).json(new_user)
})
app.get('/users/:userID', function (req, res) {

    const {userID} = req.params
    const user = db.users.find(u => `${u.id}` === userID)
    res.json(user)
})
app.put('/users/:userID', function (req, res) {

    const {userID} = req.params
    const user = db.users.find(u => `${u.id}` === userID)
    res.json(user)
})
app.patch('/users/:userID', function (req, res) {

    const {userID} = req.params
    const user = db.users.find(u => `${u.id}` === userID)
    res.json(user)
})
app.delete('/users/:userID', function (req, res) {

    const {userID} = req.params
    const user = db.users.find(u => `${u.id}` === userID)
    res.json(user)
})



// run server
app.listen(PORT, () => {
    console.log(`express runs at port ${PORT}`)
})