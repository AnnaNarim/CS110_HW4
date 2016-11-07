'use strict';
 const http= require('http');
 const url= require('url');
 const fs= require('fs');
 const querystring= require('querystring');
 
 	
 let todos = [
 {
	 id : Math.random()+'',
	 message : 'Save money',
	 completed: false
 },
 {
	 id : Math.random()+'',
	 message : 'Buy Porsche Panamera',
	 completed: false
 }
 ];
	
 
 const httpserver= http.createServer(function (req,res){
	 
 const parsedUrl = url.parse(req.url);
 const parsedQuery = querystring.parse(parsedUrl.query);
 const method = req.method;
	 
	 fs.readFile('./public'+req.url, function(err,data){
		if(err){res.statusCode = 404;
		res.end("Something is Wrong")
		}  
		res.statusCode = 200;
		res.end(data);
	 });
	 

///////////////////////////////////////////	  search todo
  if(method === 'GET') {
        if(req.url.indexOf('/todos') === 0) {
            res.setHeader('Content-Type', 'application/json');
            let localTodos = todos;
//console.log(parsedQuery);
            if(parsedQuery.searchtext) {
                localTodos = localTodos.filter(function(obj) {
                    return obj.message.indexOf(parsedQuery.searchtext) >= 0;
                });
            }
			
            return res.end(JSON.stringify(localTodos));
			
			
        }
    
  }
  
   if(method === 'POST') {
        if(req.url.indexOf('/todos') === 0) {
            let body = '';
            req.on('data', function (chunk) {
                body += chunk;
            });
			
            req.on('end', function () {
                let jsonObj = JSON.parse(body);  
                jsonObj.id = Math.random() + '';
                jsonObj.completed = false;   
				console.log(jsonObj);
				todos.push(jsonObj);
				
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify(jsonObj));
            });
            return;
        }
    }
	
	if(method === 'PUT') {
        if(req.url.indexOf('/todos') === 0) {

            
            let body = '';
            req.on('data', function (chunk) {
                body += chunk;
            });
            req.on('end', function () {
                let jsonObj = JSON.parse(body); 
                
                for(let i = 0; i < todos.length; i++) {
                    if(todos[i].id === jsonObj.id) { 
                        todos[i] = jsonObj; 
                        res.setHeader('Content-Type', 'application/json');
                        return res.end(JSON.stringify(jsonObj));
                    }
                }

                res.statusCode = 404;
                return res.end('Data was not found and can therefore not be updated');
            });
            return;
        }
    }
	 if(method === 'DELETE') {
        if(req.url.indexOf('/todos/') === 0) {
			//console.log(id);
            let id =  req.url.substr(7);
            for(let i = 0; i < todos.length; i++) {
                if(id === todos[i].id) {
                    todos.splice(i, 1);
                    res.statusCode = 200;
                    return res.end('Successfully removed');
                }
            }
            res.statusCode = 404;
            return res.end('Data was not found');
        }
    }
	 }); 
	 httpserver.listen(501);