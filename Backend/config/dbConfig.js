module.exports={
    
    DB:'supplies',
    USER:'root',
    PASSWORD:'Capsunica2003',
    host:'mysql',
    dialect:'mysql',
    define:{
        timestamps:false,
    },
    pool:{
        max:5,
        min:0,
        acquire:30000,
        idle:10000
    }
}