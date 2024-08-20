const app = require('./app');

const PORT = process.env.PORT || 3000;


// run server
app.listen(PORT, () => {
    console.log(`express runs at port ${PORT}`)
})