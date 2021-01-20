const fs=require('fs');
const crypto=require('crypto');

module.exports=class Repo{
//////
	constructor(filename){
		if(!filename){
			throw new Error('requer file name');
		}
		this.filename=filename;
		try{
			fs.accessSync(filename)
		}catch{
			fs.writeFileSync(filename,'[]');
		}
	}
//////
	async getAll(){
		return  JSON.parse(await fs.promises.readFile(this.filename,{encoding:'utf8'}));
	}
//////
	async write(file){
		await fs.promises.writeFile(this.filename,JSON.stringify(file,null,3));
	}
//////
	randomId(){
		return crypto.randomBytes(4).toString('hex');
	}
//////
	async get(id){
		const stats=await this.getAll();
		return await stats.find(stat=>stat.id===id);
	} 
//////
	async deleteStat(id){
		const stats=await this.getAll();
		const filtered=stats.filter(stat=>stat.id!==id);
		this.write(filtered);
	}
//////
	async update(id,object){
		const stats=await this.getAll();
		const target =stats.find(stat=>stat.id===id);
		if(!target){
			throw new Error(`Given Id ${id} not found`);
		}
		Object.assign(target,object);
		this.write(stats);
	}
//////
	async getBy(object){
		const stats= await this.getAll();
		for(let stat of stats){
			let found=true;
			for(let key in object){
				if(stat[key]!==object[key]){
					found=false;
				}
			}
			if(found){
			return stat;	
			}

		}
	}
///////
	async createStat(object){
		const stats=await this.getAll();
		object.id=this.randomId();
		stats.push(object);
		this.write(stats);
		return object;
	}
//////
}
