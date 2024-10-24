//Import express
const express=require('express');
let app=express();

//Route
app.get('/',(req,res)=>[
  //  res.status(200).send('<h4>Hello from express</h4>')
    res.status(200).json({message:"hello from server"})

])


app.post('/',(req,res)=>{

})



const port=3000;
app.listen(port,()=>{
    console.log('server is started');
})

