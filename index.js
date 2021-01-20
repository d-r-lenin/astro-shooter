const express=require('express');


const mainRouter=require('./Handlers/mainRouter');

const app=express();


app.use(express.static('public'));
app.use(express.json());
app.use(mainRouter);


app.listen(process.env.PORT||3000,()=>{
	console.log("Server Is Running...");
})
