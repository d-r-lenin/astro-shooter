const express=require('express');

const file=require('../modules/memCard');

const app=express();

const score='5e2d08a3';
const hiScore='bfa28c99';

app.get('/',(req,res)=>{
	res.sendFile('./public/index.html');
})

app.get('/get/score',async(req,res)=>{
	try{
		const data=await file.get(score);
		console.log(data);
		res.send(data);
	}catch(err){
		console.log("error while geting value from file\n"+err);
	}
})

app.get('/get/high-score',async(req,res)=>{
	try{
		const {highScore}=await file.get(hiScore);
		console.log(highScore);
		res.send({highScore});
	}catch(err){
		console.log("error while geting value from file(high score)\n"+err);
	}

	
})

app.post('/count/score',async(req,res)=>{	
	try{
		let {count}=await file.get(score);
		count+=req.body.count;
		req.body.count=count;
		await file.update(score,req.body);
		res.sendStatus(200);
	}catch(err){
		console.log("error while updating counted value \n"+err);
	}
	
})

app.post('/count/high-score',async(req,res)=>{
	try{
		console.log(req.body)
		await file.update(hiScore,req.body);
		res.sendStatus(200);
	}catch(err){
		console.log("error while updating High Score value \n"+err);
	}
	
})

module.exports=app;