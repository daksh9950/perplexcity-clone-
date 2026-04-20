import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GOOGLE_API_KEY
});

export async function testAi(req,res){
    model.invoke("Why do parrots talk?")
     .then((response)=>{
        console.log(response.text)
     })
}

const response = await model.invoke("Why do parrots talk?");