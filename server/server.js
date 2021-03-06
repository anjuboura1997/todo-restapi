 const  express =require('express')
 const body_parser = require('body-parser')
 var {mongoose} =require('./db/mongoose')
 var {todo} =require('./model/todo')
var {user}=require('./model/user')
var {user}=require('./model/user')
var {ObjectID} = require('mongodb')
const _=require('lodash')



const app = express()
app.use(body_parser.json())
const port = process.env.PORT || 4040




app.post('/todos', (req,res)=>{
   // console.log(req.body)
   var newtodo =new todo({
       text : req.body.text,
       completed :req.body.completed,
       completedat :req.body.completedat
   });
   newtodo.save().then((result)=>{
      res.send(result)
   },(e) =>{
     res.status(400).send(e);
   }
   )

});

app.get('/todos',(req,res) =>{
    todo.find().then( (result) =>{
        if(!result){
            return res.status(400).send('there is not any result')
        }
    res.send(result)
    },(error) =>{
        res.status(400).send((error))
    })
})
app.get('/todos/:id',(req,res) =>{
    var id = req.params.id
    if(!ObjectID.isValid(id)){
        return res.status(400).send('id is invalid')
    }
    
    console.log(id)
    todo.findById(id).then((docs) =>{
        if(!docs){
          return   res.status(400).send('oops !!!! not any document found with this id')
        }
        console.log(docs.text)

       res.send({docs})
    },(error) =>{
        res.status(400).send(error);
        
    })
});

app.delete('/todos/:id',(req,res) =>{
    var id=req.params.id
    if(!ObjectID.isValid(id)){
        return res.status(400).send('not a valid id')
    }
       todo.findByIdAndRemove(id).then((docs)=>{
           if(!docs){
               return res.status(400).send('not any records by that id')
           }
           res.send(docs)
        },(errror)=>{
            res.status(200).send(error)
        })
    });
 //to update
    app.patch('/todos/:id',(req,res) =>{
        var id=req.params.id
        var body=_.pick(req.body,['text','completed'])
        if(!ObjectID.isValid(id)){
            return res.status(400).send('not a valid id')
        }

        if(_.isBoolean(body.completed) && body.completed){
            body.completedat= new Date().getTime()
        }
        else{
            body.completed =false
            body.completedat=null
        }
        todo.findByIdAndUpdate(id, {$set :body},{new :true}).then((docs)=>{
            res.status(200).send(docs)
        },(error) =>{
            res.status(400).send(error)
        })

        }
    
    )

    



app.listen(port,() =>{
console.log(`this app is running on port ${port}`)
});
