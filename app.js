const express = require("express");
const  mysql = require('mysql');
const cors = require('cors');

const db =mysql.createConnection({
    host:"localhost",
    user :"root",
    password:"",
    database:"hari"
})

db.connect((err)=>{
    if(err){
        throw err;
    }
    console.log('mySql connected....');
})

const app = express();
app.use(cors('*'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());


/* app.get('/students',(req, res) =>{
    var text = 'hello world';
    let sql="select * from persons";
    db.query(sql, async (err, result)=>{        
        if(err) throw err;
        for(i=0;i<=5;i++)
            text+=i;    
         hello(req, res, text);
    })
})

function hello(req,res,text){      
    console.log(text);
    res.send(text);
} */


app.get('/login',(req, res) =>{
    let sql= `SELECT * FROM login WHERE userName = 'Hari' AND passWord = '12345'`;   
    db.query(sql, (err, persons)=>{  
        if(err) throw err;   
        else if(persons.length == 0){
            res.send("Login Unsuccess")
        }else{
            console.log(persons)                                 
            res.send("Login Success");  
        }
    })
})

app.get('/students',(req, res) =>{
    let sql= `SELECT s.*, CONCAT('[', GROUP_CONCAT(JSON_OBJECT('ReceiptId', d.id, 'PaidOn', d.PaidOn, 'Amount', d.Amount)), ']') AS History FROM persons s LEFT JOIN fee d ON s.Id = d.PersonId GROUP BY s.Id, s.Name`;
   // let sql="select Name,date_format(DateOfBirth, '%m/%d/%Y') as DateOfBirth,date_format(DateOfJoin, '%m/%d/%Y') as DateOfJoin, Phone, Email, Address, date_format(EndDate, '%m/%d/%Y') as EndDate from persons";
   //let sql= `SELECT s.Name,date_format(s.DateOfBirth, '%m/%d/%Y') as DateOfBirth,date_format(s.DateOfJoin, '%m/%d/%Y') as DateOfJoin, s.Phone, s.Email, s.Address, date_format(s.EndDate, '%m/%d/%Y') as EndDate, CONCAT('[', GROUP_CONCAT(JSON_OBJECT('ReceiptId', d.id, 'PaidOn', d.PaidOn, 'Amount', d.Amount)), ']') AS History FROM persons s LEFT JOIN fee d ON s.Id = d.PersonId GROUP BY s.Id, s.Name`;
    db.query(sql, (err, persons)=>{  
        if(err) throw err;   
        console.log(persons)                                 
        res.send(persons);  
    })
})

app.post('/add',(req,res) => {
    /* const name = req.body.name;
    const salary = req.body.salary;
    const design = req.body.design; */
    const params = req.body
    db.query('INSERT INTO persons SET ?',params, (err, result) =>{
        if(err) throw err;
        console.log(result);
        res.send('post 1 added...');
    })
})

app.post('/addfee',(req,res) => {
    const params = req.body
    db.query('INSERT INTO fee SET ?',params, (err, result) =>{
        if(err) throw err;
        console.log(result);
        res.send('post 1 added...');
    })
})

app.get('/students/:id',(req,res) => {
    let sql = `SELECT * FROM persons where id = ${req.params.id}`;
    let query = db.query(sql,(err,result) =>{
        if(err) throw err,
        console.log(result);
        res.send(result);
    })
})

app.put('/update/:id',(req,res)=>{
    const {Name,DateOfBirth,DateOfJoin,Phone,Email,Address,EndDate}=req.body
    db.query(`UPDATE persons SET Name = ?, DateOfBirth = ?, DateOfJoin = ?, Phone = ?, Email = ?, Address = ?, EndDate = ? WHERE id = ${req.params.id}`,[Name,DateOfBirth,DateOfJoin,Phone,Email,Address,EndDate],(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send('record updated');
    })
})

app.delete('/delete/:id',(req,res)=>{
    let sql=`DELETE FROM persons WHERE id = ${req.params.id}`;
    db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send("record deleted");
    })
})

app.listen('5000',()=>{
    console.log('Server started on port 5000');
});

