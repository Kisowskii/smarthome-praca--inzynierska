const express = require("express");
const db = require("./connect");
const elem = require("./collections");
const { ObjectId } = require("mongodb");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});
  
  app.get("/api/elements", async (req, res, next) => {
    elem.find().toArray((err, result) => {
      if (err) {
        throw new Error("No file");
        console.log("error");
      }
      res.status(200).json({
        message: "Posts fetched successfully",
  
        elem: result,
      });
    });
  });

  app.get("/api/elements/elementsType/:type", async (req, res, next) => {
    elem.find({ elementType:req.params.type}).toArray((err, result) => {
      if (err) {
        throw new Error("No file");
        console.log("error");
      }
      res.status(200).json({
        message: "Elements get succesfully",
        elem: result,
      });
    });
  });

  app.get("/api/elements/elementsPosition/:position", async (req, res, next) => {
    elem.find({ elementPosition:req.params.position}).toArray((err, result) => {
      if (err) {
        throw new Error("No file");
        console.log("error");
      }
      res.status(200).json({
        message: "Elements get succesfully",
        elem: result,
      });
    });
  });

  app.put("/api/elements/:id", (req, res, next) => {
  
    elem.updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: {
            buttonText:req.body.buttonText,
            elementType:req.body.elementType,
            elementPosition:req.body.elementPosition,
            icon:req.body.icon,
            value:req.body.value,
            automation:req.body.automation
          },
        }
      )
      .then((result) => {
        console.log(result);
        res.status(200).json({ message: "Element update Successfull" });
      });
  });

app.post("/api/elements", (req, res, next) => {
    const elements = [{
        buttonText:"Lampa",
        elementType:"Oswietlenie",
        elementPosition:"Salon",
        icon:"../../assets/Oswietlenie.svg",
        value:true,
        automation:true
    },{
        buttonText:"Lampa",
        elementType:"Oswietlenie",
        elementPosition:"Kuchnia",
        icon:"../../assets/Oswietlenie.svg",
        value:true,
        automation:true
    },{
        buttonText:"Lampa",
        elementType:"Oswietlenie",
        elementPosition:"Sypialnia",
        icon:"../../assets/Oswietlenie.svg",
        value:true,
        automation:true
    },{
        buttonText:"Lampa",
        elementType:"Oswietlenie",
        elementPosition:"Łazienka",
        icon:"../../assets/Oswietlenie.svg",
        value:true,
        automation:true
    },{
        buttonText:"Lampa",
        elementType:"Oswietlenie",
        elementPosition:"Na zewnątrz",
        icon:"../../assets/Oswietlenie.svg",
        value:true,
        automation:true
    },{
        buttonText:"Temperatura",
        elementType:"Temperatura",
        elementPosition:"Kuchnia",
        icon:"../../assets/Temperatura.svg",
        value:21,
        automation:false
    },{
        buttonText:"Temperatura",
        elementType:"Temperatura",
        elementPosition:"Na zewnątrz",
        icon:"../../assets/Temperatura.svg",
        value:21,
        automation:false
    },{
        buttonText:"Wilgotność",
        elementType:"Wilgotność",
        elementPosition:"Kuchnia",
        icon:"../../assets/Wilgotnosc.svg",
        value:21,
        automation:false
    },{
        buttonText:"Wilgotność",
        elementType:"Wilgotność",
        elementPosition:"Na zewnątrz",
        icon:"../../assets/Wilgotnosc.svg",
        value:21,
        automation:false
    },{
        buttonText:"Czujnik dymu",
        elementType:"Zadymienie",
        elementPosition:"Kuchnia",
        icon:"../../assets/Czujnik_Dymu.svg",
        value:"Tak",
        automation:false
    },{
        buttonText:"Monitoring",
        elementType:"Monitoring",
        elementPosition:"Na zewnątrz",
        icon:"../../assets/Monitoring.svg",
        value:true,
        automation:true
    },{
        buttonText:"Rolety",
        elementType:"Rolety",
        elementPosition:"Kuchnia",
        icon:"../../assets/Rolety.svg",
        value:true,
        automation:true
    },{
        buttonText:"Czujnik zalania",
        elementType:"Zalanie",
        elementPosition:"Łazienka",
        icon:"../../assets/Czujnik_Zalania.svg",
        value:"Nie",
        automation:false
    },{
        buttonText:"Klimatyzacja",
        elementType:"Klimatyzacja",
        elementPosition:"Salon",
        icon:"../../assets/Czujnik_Zalania.svg",
        value:true,
        automation:true
    },{
        buttonText:req.body.buttonText,
        elementType:req.body.elementType,
        elementPosition:req.body.elementPosition,
        icon:req.body.icon,
        value:req.body.value,
        automation:req.body.automation
    },];
    elem.insertMany(elements, (err, docs) => {
      if (err) {
        throw new Error("No file");
        console.log("error");
      }
  
      res.status(201).json({
        message: "Elements added successfully",
      });
    });
  });

  app.get('/', (req, res) => {
    res.send({hello: 'world'});
});
  
    module.exports = app;