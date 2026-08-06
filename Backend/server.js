require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")

const port = Number(process.env.PORT) || 3000

async function startServer() {
    try {
        await connectToDB()

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
    } catch (error) {
        console.error("Failed to start server:", error)
        process.exit(1)
    }
}

startServer()
