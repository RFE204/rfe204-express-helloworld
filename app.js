const express = require('express')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');

//  create 
const PORT = process.env.PORT || 3000
const app = express()


// middleewares
app.use(
    express.json()
)

// routes
app.get('/users', function (req, res) {
    console.log("req", req)
    res.json(db.users)
})
// app.post('/users', function (req, res) {
//     const new_user = req.body
//     new_user.id = uuidv4(); // generate a new id
//     db.users.push(new_user)
//     fs.writeFileSync(DB_PATH, JSON.stringify(db))
//     res.status(201).json(new_user)
// })
// app.get('/users/:userID', function (req, res) {

//     const { userID } = req.params
//     const user = db.users.find(u => `${u.id}` === userID)
//     res.json(user)
// })


// app.put('/users/:userID', updateUser);
// app.patch('/users/:userID', updateUser);
// function updateUser(req, res) {
//     const { userID } = req.params;
//     const userIndex = db.users.findIndex(u => `${u.id}` === userID);
//     if (userIndex !== -1) {
//         // update user except id
//         db.users[userIndex] = {
//             ...db.users[userIndex],
//             ...req.body,
//             id: db.users[userIndex].id
//         };
//         fs.writeFileSync(DB_PATH, JSON.stringify(db));
//         res.json(db.users[userIndex]);
//     } else {
//         res.status(404).json({ error: 'User not found' });
//     }
// }
// app.delete('/users/:userID', function (req, res) {
//     const { userID } = req.params;
//     const userIndex = db.users.findIndex(u => `${u.id}` === userID);

//     if (userIndex !== -1) {
//         const deletedUser = db.users.splice(userIndex, 1);
//         fs.writeFileSync(DB_PATH, JSON.stringify(db));
//         res.json({ message: 'User deleted successfully', user: deletedUser });
//     } else {
//         res.status(404).json({ message: 'User not found' });
//     }
// });



// run server
app.listen(PORT, () => {
    console.log(`express runs at port ${PORT}`)
})