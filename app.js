
const { spawn } = require('child_process');
const fs=require("fs")

function statistics(command,arguments=[],time=Infinity){

    const timestamp = new Date().toISOString()
    const logFilePath = "/logs" + timestamp + command + ".json";


    const start=new Date()

return new Promise((resolve,reject)=>{
  const process=spawn(command,arguments,{timeout:time})

let data=""
process.stdout.on("data",(chunk)=>{
    data+=chunk.toString()
})

process.on("close",(code)=>{
    const end=new Date()
    const duration=end-start
    let success;
    if(code===0){
         success=true

    }
    else{
        success=false
        console.log("Error message",code)
    }

    const statistics={
        start:start.toString(),
        duration,
        success,
        commandSuccess: success ? {} : undefined,
        error: success ? {} : console.log("Error message")
    }

fs.writeFile(logFilePath,JSON.stringify(statistics,undefined,2),(err)=>{
    if(err){
        reject(err)
    }else{
        resolve(statistics)
    }
})

    })
process.on("error",(error)=>{
    reject(error)
})
})
}

statistics('ls', ['-l'], 5000)
  .then((result) => {
    console.log('Statistics:', result);
  })
  .catch((error) => {
    console.error('Error:', error);
  });