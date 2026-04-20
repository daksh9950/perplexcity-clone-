import "dotenv/config"
import app from "./src/app.js"
import connectToDb from "./src/config/database.js"
import { testAi } from "./src/servics/ai.servics.js"

connectToDb()
testAi()
app.listen(3000,(req,res)=>{
    console.log('server running on 3000 sucessfully')

})

