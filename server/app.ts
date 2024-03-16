const express = require("express");
const db = require("./connect");
const elem = require("./collections");
const { ObjectId } = require("mongodb");
const bodyParser = require("body-parser");
const app = express();
const Gpio = require('onoff').Gpio;
const LedKuchnia = new Gpio(17, 'out')
const LedSypialnia = new Gpio(27, 'out')
const LedLazienka = new Gpio(22, 'out')
const Klimatyzacja = new Gpio(12, 'out')
const CzujnikKuchnia = new Gpio(5, 'in', 'both')
const CzujnikSilnik = new Gpio(16, 'in', 'both')
const CzujnikSypialnia= new Gpio(6, 'in', 'both')
const CzujnikLazienka = new Gpio(19, 'in', 'both')
const CzujnikTemperatury = new Gpio(21, 'in', 'both')
const CzujnikZalania = new Gpio(20, 'in', 'both')
const CzujnikDymu = new Gpio(26, 'in', 'both')
const CzujnikRuchu = new Gpio(25, 'in', 'both')
const sensor = require('node-dht-sensor');
const spawn = require("child_process").spawn;
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

 CzujnikSilnik.watch((err, value)=>{
  if (err) { //if an error
    console.error('There was an error', err); //output error message to console
  return;
  }
  
  elem.findOne({ gpio:24 }).then((element) => {
    if (element && element.automation) {
      console.log(element.automation)


        if(value===1){
          console.log("prawo");
    spawn('python',["server/stepperEngine.py", true]);}
  else{
     console.log("lewo");
    spawn('python',["server/stepperEngine.py", false]);}
    } 
  });

});

  CzujnikKuchnia.watch((err, value)=>{
  if (err) { //if an error
    console.error('There was an error', err); //output error message to console
  return;
  }
  
  elem.findOne({ gpio:17 }).then((element) => {
    if (element && element.automation) {
      LedKuchnia.writeSync(value)
      if (value === 1 ) value = true
      else value = false
      elem.updateOne(element,
        { $set: {value:value}})
    } 
  });
});
  

 CzujnikSypialnia.watch((err, value)=>{

  if (err) { //if an error
   console.error('There was an error', err); //output error message to console
 return;
  }
  elem.findOne({ gpio:22 }).then((element) => {
    if (element && element.automation) {
     LedSypialnia.writeSync(value)
      if (value === 1 ) value = true
     else value = false
     elem.updateOne(element,
       { $set: {value:value}})
    } 
  });
});

CzujnikLazienka.watch((err, value)=>{
 
  if (err) { //if an error
    console.error('There was an error', err); //output error message to console
  return;
  }
  elem.findOne({ gpio:27 }).then((element) => {
    if (element && element.automation) {
      LedLazienka.writeSync(value)
       if (value === 1 ) value = true
      else value = false
      elem.updateOne(element,
        { $set: {value:value}})
    } 
  });
});

  
  CzujnikDymu.watch((err, value)=>{
  if (err) { //if an error
    console.error('There was an error', err); //output error message to console
  return;
}
if(value === 1){
  value = "NIE!"}
else{ value = "TAK!"}
elem.updateOne(
        { gpio:26 },
        {$set: {value:value, }})
})

  CzujnikRuchu.watch((err, value)=>{
  if (err) { //if an error
    console.error('There was an error', err); //output error message to console
  return;
}
//console.log("RUCH RUCH UCH" + value);
})

CzujnikZalania.watch((err, value)=>{
  if (err) { //if an error
    console.error('There was an error', err); //output error message to console
  return;
}
if(value === 1){
  value = "NIE"}
else{ value = "TAK!"}
elem.updateOne(
        { gpio:20 },
        {$set: {value:value, }})
})
  
app.get("/api/elements", async (req, res, next) => {
   sensor.read(11, 21, (err, temperature, humidity) => {
    if(!err){
      elem.updateOne(
    { gpio:21, elementType:"Temperatura" },
    {$set: {value:temperature},
    })
    elem.updateOne(
      { gpio:21, elementType:"Wilgotność" },
      {$set: {value:humidity},
      })}
  })
  
  elem.find().toArray().then((elements)=>{
    elements.forEach((element)=>{
      
        if(element.gpio === 17){
        if(element.value === true){
          LedKuchnia.writeSync(1)
        }else LedKuchnia.writeSync(0)
      } else if (element.gpio === 27){
        if(element.value === true){
          LedSypialnia.writeSync(1)
        }else LedSypialnia.writeSync(0)
      } else if (element.gpio === 22){
        if(element.value === true){
          LedLazienka.writeSync(1)
        }else LedLazienka.writeSync(0)
      }else if (element.gpio === 12){
        if(element.value === true){
          Klimatyzacja.writeSync(1)
        }else Klimatyzacja.writeSync(0)
      }
      
    })
    res.status(200).json({
      message: "Posts fetched successfully",
      elem:elements
    })
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
  let previousValue;
  elem.findOne({ _id: ObjectId(req.params.id)}).then((elem)=>{previousValue = elem.value})
    elem.updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: {
            buttonText:req.body.buttonText,
            elementType:req.body.elementType,
            elementPosition:req.body.elementPosition,
            icon:req.body.icon,
            value:req.body.value,
            automation:req.body.automation,
            
          },
        }
        ).then(() => {
          elem.findOne({ _id: ObjectId(req.params.id)}).then((elem)=>{
          if(elem.gpio === 17){
            if(elem.value === true){
              LedKuchnia.writeSync(1)
            }else LedKuchnia.writeSync(0)
          } else if (elem.gpio === 27){
            if(elem.value === true){
              LedSypialnia.writeSync(1)
            }else LedSypialnia.writeSync(0)
          } else if (elem.gpio === 22){
            if(elem.value === true){
              LedLazienka.writeSync(1)
            }else LedLazienka.writeSync(0)
          } else if (elem.gpio === 12){
            if(elem.value === true){
          Klimatyzacja.writeSync(1)
            }else Klimatyzacja.writeSync(0)
          }else if(elem.gpio === 24){
           if(elem.value === true && elem.value !== previousValue){
             spawn('python',["server/stepperEngine.py", true]);
           }else if(elem.value === false && elem.value !== previousValue) {
             spawn('python',["server/stepperEngine.py", false]);
         }}
          })
        
        res.status(200).json();
      });
  });
  
  app.post("/api/elements", (req, res, next) => {
    const elements = [{
        buttonText:"Lampa",
        elementType:"Oswietlenie",
        elementPosition:"Kuchnia",
        icon:"../../assets/Oswietlenie.svg",
        value:false,
        automation:false,
        gpio:17,
        display:true
    },{
        buttonText:"Lampa",
        elementType:"Oswietlenie",
        elementPosition:"Sypialnia",
        icon:"../../assets/Oswietlenie.svg",
        value:false,
        automation:false,
        gpio:27,
        display:true
    },{
        buttonText:"Lampa",
        elementType:"Oswietlenie",
        elementPosition:"Łazienka",
        icon:"../../assets/Oswietlenie.svg",
        value:false,
        automation:false,
        gpio:22,
        display:true
    },{
        buttonText:"Temperatura",
        elementType:"Temperatura",
        elementPosition:"Łazienka",
        icon:"../../assets/Temperatura.svg",
        value:21,
        gpio:21,
        automation:false,
        display:true
    },{
        buttonText:"Wilgotność",
        elementType:"Wilgotność",
        elementPosition:"Łazienka",
        icon:"../../assets/Wilgotnosc.svg",
        value:21,
        gpio:21,
        automation:false,
        display:true
    },{
        buttonText:"Czujnik dymu",
        elementType:"Zadymienie",
        elementPosition:"Kuchnia",
        icon:"../../assets/Czujnik_Dymu.svg",
        value:"Tak",
        gpio:26,
        automation:false,
        display:true
    },{
        buttonText:"Monitoring",
        elementType:"Monitoring",
        elementPosition:"Na zewnątrz",
        icon:"../../assets/Monitoring.svg",
        value:false,
        automation:false,
        display:true
    },{
        buttonText:"Rolety",
        elementType:"Rolety",
        elementPosition:"Kuchnia",
        icon:"../../assets/Rolety.svg",
        value:false,
        gpio:24,
        automation:true,
        display:true
    },{
        buttonText:"Czujnik zalania",
        elementType:"Zalanie",
        elementPosition:"Łazienka",
        icon:"../../assets/Czujnik_Zalania.svg",
        value:"Nie",
        gpio:20,
        automation:false,
        display:true
    },{
        buttonText:"Klimatyzacja",
        elementType:"Klimatyzacja",
        elementPosition:"Salon",
        icon:"../../assets/Czujnik_Zalania.svg",
        value:false,
        gpio:12,
        automation:false,
        display:true
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

