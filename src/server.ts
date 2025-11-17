import knex from "knex"
import { app } from "./app.js"

// app.get('/hello', async () => {
//     const test = knex('slqlite_schema').select('*')

//     return test
// })

app.listen({
    port: 3333
}).then(() => {
    console.log("HTTP server running")
})