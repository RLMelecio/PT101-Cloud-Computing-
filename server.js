var express = require('express');
var app = express();
var fs = require('fs');
app.use(express.json());

app.get('/getInfo', function(req, res){
    fs.readFile(__dirname + "/" + "company.json", 'utf8', function(err, data){
        console.log(data);
        res.end(data);
    });
})

app.post('/addCompany', function(req, res){
  fs.readFile(__dirname + "/" + "company.json", 'utf8', function(err, data){
      if (err) {
          console.error(err);
          res.sendStatus(500); 
          return;
      }
      try {
          const companyData = JSON.parse(data);
          const newCompany = req.body;
          const newCompanyid = "company" + newCompany.id;
          companyData[newCompanyid] = newCompany;
          const newCompanydata = JSON.stringify(companyData);
          console.log(companyData);
          fs.writeFile(__dirname + "/" + "company.json", newCompanydata, function(err){
              if (err) {
                  console.error(err);
                  res.sendStatus(500);
              } else {
                  console.log("Company added successfully!");
                  console.log("Response:");
                  console.log(companyData);
                  res.send(companyData);
              }
          });
      } catch (error) {
          console.error(error);
          res.sendStatus(500); 
      }
  });
});

app.get('/:name', function (req, res) {
    fs.readFile( __dirname + "/" + "company.json", 'utf8', function (err, data) {
      if(err){
        console.log(err);
        res.status(500).send("Error retrieving info!");
      }else{
        var companyData = JSON.parse(data);
        var companyKey = Object.keys(companyData);
        var companies = [];
        companyKey.forEach(key => {
         if (companyData[key].employeenames.includes(req.params.name)) {
             companies.push(companyData[key].compname);
         }
        });
        console.log(companies);
        res.end( JSON.stringify(companies));
      }
    });
 })

 app.delete('/deleteCompany/:id', function (req, res) {
    fs.readFile( __dirname + "/" + "company.json", 'utf8', function (err, data) {
      if(err){
        console.log(err);
        return res.status(500).send("Error reading company.json");
      }else{
        data = JSON.parse(data);
        deleteData = "company" + req.params.id;
        if(data.hasOwnProperty(deleteData)){
          deleteCompany = data[deleteData];
          delete data[deleteData];
          console.log("Company successfully deleted");
          console.log("Deleted Company: ", deleteCompany);

          fs.writeFile(__dirname + "/" + "company.json", JSON.stringify(data), function(err){
            if(err){
              console.log(err);
              res.status(500).send("Error writing to company.json");
            }else{
              res.end(JSON.stringify(data));
            }
          });
        }else{
          console.log("Company ID not found!");
          res.status(404).send("Company ID not found!");
        }
      }
    });
 })


app.put('/updateCompany/:id', function(req, res){
  fs.readFile(__dirname + "/" + "company.json", 'utf8', function(err, data){
    if(err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    data = JSON.parse(data);
    var id = "company" + req.params.id;
    if(data[id]){
      data[id].id = req.body.id;
      data[id].compname = req.body.compname;
      data[id].employeenames = req.body.employeenames;
      data[id].positions = req.body.positions;
      data[id].location = req.body.location;
      var newdata = JSON.stringify(data);
      console.log(data);

      fs.writeFile(__dirname + "/" + "company.json", newdata, function(err){
        if(err){
          console.log(err);
          res.sendStatus(500); 
        } else {
          console.log("Company info successfully updated!");
          res.send(data[id]); 
        }
      });
    } else {
      res.sendStatus(404);
    }
  });
});

var server = app.listen(8080, '127.0.0.1', function(){
    var host = server.address().address
    var port = server.address().port
    console.log("REST API demo app listening at http://%s:%s", host, port)
})