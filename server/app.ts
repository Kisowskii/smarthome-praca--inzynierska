const express = require('express');
const db = require('./connect.ts');
const { elements: elem, users: user, logs: activityLogs, settings: setting } = require('./collections.ts');
const { ObjectId } = require('mongodb');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const { version, Chip, Line } = require('node-libgpiod');
const Gpio = require('onoff').Gpio;
const LedKuchnia = new Gpio(588, 'out');
const LedSypialnia = new Gpio(598, 'out');
const LedLazienka = new Gpio(593, 'out');
const Klimatyzacja = new Gpio(583, 'out');
const Zamek = new Gpio(403, 'out');
const CzujnikKuchnia = new Gpio(576, 'in', 'both');
const CzujnikSilnik = new Gpio(587, 'in', 'both');
const CzujnikSypialnia = new Gpio(577, 'in', 'both');
const CzujnikLazienka = new Gpio(590, 'in', 'both');
const CzujnikTemperatury = new Gpio(592, 'in', 'both');
const CzujnikZalania = new Gpio(591, 'in', 'both');
const CzujnikDymu = new Gpio(597, 'in', 'both');
const CzujnikRuchu = new Gpio(596, 'in', 'both');
const sensor = require('node-dht-sensor');
const spawn = require('child_process').spawn;
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// Reszta Twojego kodu serwera

app.use(cors());

// Nast�pnie parsowanie cia�a ��dania
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});
let cameraProcess = null;
app.post('/api/users/add', (req, res, next) => {
  const doc = {
    login: req.body.login,
    password: req.body.password,
    role: req.body.role,
  };

  user
    .findOne({ login: doc.login })
    .then((existingUser) => {
      if (existingUser) {
        // U�ytkownik o takim loginie ju� istnieje, zwr�� b��d i zako�cz funkcj�
        return res.status(409).json({ message: 'User with this login already exists' });
      }
      // U�ytkownik nie istnieje, kontynuuj dodawanie nowego
      return user.insertOne(doc);
    })
    .then((result) => {
      // Sprawd�, czy result nie jest undefined, co mo�e oznacza�, �e operacja dodawania nie zosta�a wykonana
      if (result && result.insertedId) {
        res.status(201).json({
          message: 'User added successfully',
          userId: result.insertedId,
        });
      }
    })
    .catch((err) => {
      console.error('Error adding user:', err);
      // Sprawd�, czy nie wys�ano ju� odpowiedzi
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error adding user' });
      }
    });
});

app.post('/api/login', (req, res) => {
  let fetchedUser;
  user
    .findOne({ login: req.body.login })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: 'Auth failed',
        });
      }
      fetchedUser = user;
    })
    .then(() => {
      if (fetchedUser.password !== req.body.password) {
        return res.status(401).json({
          message: 'Auth failed',
        });
      }
      return fetchedUser.password;
    })
    .then((result) => {
      if (!result) {
        return res.status(403).json({
          message: 'Auth failed',
        });
      }

      const token = jwt.sign({ login: fetchedUser, userId: fetchedUser._id }, 'adminsPaswword', { expiresIn: '1h' });
      res.status(200).json({
        token: token,
        id: fetchedUser._id,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: 'Auth failed',
      });
    });
});

app.post('/api/settings', async (req, res) => {
  const { name, enabled, userId } = req.body;
  try {
    const result = await setting.updateOne({ name, userId }, { $set: { enabled } }, { upsert: true });
    res.status(200).json({ message: 'Setting updated successfully', name, enabled });
  } catch (error) {
    res.status(500).json({ message: 'Error updating setting', error });
  }
});

app.get('/api/settings/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const settings = await setting.find({ userId }).toArray();
    if (!settings.length) {
      // Sprawd� czy tablica nie jest pusta
      return res.status(404).json({ message: 'Settings not found' });
    }
    res.status(200).json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Error fetching settings', error });
  }
});

CzujnikSilnik.watch((err, value) => {
  if (err) {
    //if an error
    console.error('There was an error', err); //output error message to console
    return;
  }

  elem.findOne({ gpio: 24 }).then((element) => {
    if (element && element.automation) {
      console.log(element.automation);

      if (value === 1) {
        spawn('python', ['server/stepperEngine.py', true]);
      } else {
        spawn('python', ['server/stepperEngine.py', false]);
      }
    }
  });
});

CzujnikKuchnia.watch((err, value) => {
  if (err) {
    //if an error
    console.error('There was an error', err); //output error message to console
    return;
  }

  elem.findOne({ gpio: 588 }).then((element) => {
    if (element && element.automation) {
      LedKuchnia.writeSync(value);
      if (value === 1) value = true;
      else value = false;
      elem.updateOne(element, { $set: { value: value } });
    }
  });
});

CzujnikSypialnia.watch((err, value) => {
  if (err) {
    //if an error
    console.error('There was an error', err); //output error message to console
    return;
  }
  elem.findOne({ gpio: 598 }).then((element) => {
    if (element && element.automation) {
      LedSypialnia.writeSync(value);
      if (value === 1) value = true;
      else value = false;
      elem.updateOne(element, { $set: { value: value } });
    }
  });
});

CzujnikLazienka.watch((err, value) => {
  if (err) {
    //if an error
    console.error('There was an error', err); //output error message to console
    return;
  }
  elem.findOne({ gpio: 593 }).then((element) => {
    if (element && element.automation) {
      LedLazienka.writeSync(value);
      if (value === 1) value = true;
      else value = false;
      elem.updateOne(element, { $set: { value: value } });
    }
  });
});

CzujnikDymu.watch((err, value) => {
  if (err) {
    //if an error
    console.error('There was an error', err); //output error message to console
    return;
  }
  if (value === 1) {
    value = 'NIE!';
  } else {
    value = 'TAK!';
  }
  elem.updateOne({ gpio: 26 }, { $set: { value: value } });
});

CzujnikRuchu.watch((err, value) => {
  if (err) {
    //if an error
    console.error('There was an error', err); //output error message to console
    return;
  }
  console.log('RUCH RUCH UCH' + value);
  if (cameraProcess === null) {
    cameraProcess = spawn('./server/.venv/bin/python3', ['server/camera_stream.py']);

    cameraProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    cameraProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    cameraProcess.on('close', (code) => {
      console.log(`Python process exited with code ${code}`);
      cameraProcess = null;
    });
  }
});

CzujnikZalania.watch((err, value) => {
  if (err) {
    //if an error
    console.error('There was an error', err); //output error message to console
    return;
  }
  if (value === 1) {
    value = 'NIE';
  } else {
    value = 'TAK!';
  }
  elem.updateOne({ gpio: 20 }, { $set: { value: value } });
});

app.get('/api/elements', async (req, res, next) => {
  sensor.read(11, 592, (err, temperature, humidity) => {
    if (!err) {
      elem.updateOne({ gpio: 21, elementType: 'Temperatura' }, { $set: { value: temperature } });
      elem.updateOne({ gpio: 21, elementType: 'Wilgotność' }, { $set: { value: humidity } });
    }
  });

  elem
    .find()
    .toArray()
    .then((elements) => {
      elements.forEach((element) => {
        if (element.gpio === 588) {
          if (element.value === true) {
            LedKuchnia.writeSync(1);
          } else LedKuchnia.writeSync(0);
        } else if (element.gpio === 598) {
          if (element.value === true) {
            LedSypialnia.writeSync(1);
          } else LedSypialnia.writeSync(0);
        } else if (element.gpio === 593) {
          if (element.value === true) {
            LedLazienka.writeSync(1);
          } else LedLazienka.writeSync(0);
        } else if (element.gpio === 583) {
          if (element.value === true) {
            Klimatyzacja.writeSync(1);
          } else Klimatyzacja.writeSync(0);
        } else if (element.gpio === 403) {
          if (element.value === true) {
            Zamek.writeSync(1);
          } else Zamek.writeSync(0);
        } else if (element.elementType === 'Monitoring' && cameraProcess === null) {
          if (element.value === true) {
            cameraProcess = spawn('./server/.venv/bin/python3', ['server/camera_stream.py']);

            cameraProcess.stdout.on('data', (data) => {
              console.log(`stdout: ${data}`);
            });

            cameraProcess.stderr.on('data', (data) => {
              console.error(`stderr: ${data}`);
            });

            cameraProcess.on('close', (code) => {
              console.log(`Python process exited with code ${code}`);
              cameraProcess = null;
            });
          }
        }
      });
      res.status(200).json({
        message: 'Posts fetched successfully',
        elem: elements,
      });
    });
});

app.get('/api/elements/elementsType/:type', async (req, res, next) => {
  elem
    .find({ elementType: req.params.type })
    .toArray()
    .then((elements) => {
      res.status(200).json({
        message: 'Elements get succesfully',
        elem: elements,
      });
    });
});

app.get('/api/elements/elementsPosition/:position', async (req, res, next) => {
  elem
    .find({ elementPosition: req.params.position })
    .toArray()
    .then((elements) => {
      res.status(200).json({
        message: 'Elements get succesfully',
        elem: elements,
      });
    });
});

app.put('/api/elements/:id', (req, res, next) => {
  let previousValue;
  const { value, userId } = req.body; // Nowy stan urz�dzenia
  const deviceId = req.params.id; // ID urz�dzenia
  elem.findOne({ _id: new ObjectId(req.params.id) }).then((elem) => (previousValue = elem.value));
  elem
    .updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          buttonText: req.body.buttonText,
          elementType: req.body.elementType,
          elementPosition: req.body.elementPosition,
          icon: req.body.icon,
          value: req.body.value,
          automation: req.body.automation,
        },
      }
    )
    .then(() => {
      elem.findOne({ _id: new ObjectId(req.params.id) }).then((elem) => {
        if (elem.gpio === 588) {
          if (elem.value === true) {
            LedKuchnia.writeSync(1);
          } else LedKuchnia.writeSync(0);
        } else if (elem.gpio === 598) {
          if (elem.value === true) {
            LedSypialnia.writeSync(1);
          } else LedSypialnia.writeSync(0);
        } else if (elem.gpio === 593) {
          if (elem.value === true) {
            LedLazienka.writeSync(1);
          } else LedLazienka.writeSync(0);
        } else if (elem.gpio === 583) {
          if (elem.value === true) {
            Klimatyzacja.writeSync(1);
          } else Klimatyzacja.writeSync(0);
        } else if (elem.gpio === 403) {
          if (elem.value === true) {
            Zamek.writeSync(1);
          } else Zamek.writeSync(0);
        } else if (elem.gpio === 24) {
          if (elem.value === true && elem.value !== previousValue) {
            spawn('python', ['server/stepperEngine.py', true]);
          } else if (elem.value === false && elem.value !== previousValue) {
            spawn('python', ['server/stepperEngine.py', false]);
          }
        } else if (elem.elementType === 'Monitoring') {
          if (elem.value === true && elem.value !== previousValue && cameraProcess === null) {
            cameraProcess = spawn('./server/.venv/bin/python3', ['server/camera_stream.py']);

            cameraProcess.stdout.on('data', (data) => {
              console.log(`stdout: ${data}`);
            });

            cameraProcess.stderr.on('data', (data) => {
              console.error(`stderr: ${data}`);
            });

            cameraProcess.on('close', (code) => {
              console.log(`Python process exited with code ${code}`);
              cameraProcess = null;
            });
          } else if (cameraProcess !== null) {
            cameraProcess.kill();
            cameraProcess = null;
          }
        }
        logUserActivity(userId, deviceId, value);
      });
      res.status(200).json();
    });
});

app.get('/api/ml/update', (req, res) => {
  const csvCreateProcess = spawn('./server/.venv/bin/python3', ['server/csvCreate.py']);

  csvCreateProcess.stdout.on('data', (data) => {
    console.log(`stdout from csvCreate.py: ${data}`);
  });

  csvCreateProcess.stderr.on('data', (data) => {
    console.error(`stderr from csvCreate.py: ${data}`);
  });

  csvCreateProcess.on('close', (code) => {
    console.log(`csvCreate.py exited with code ${code}`);

    if (code === 0) {
      const jsonForDiagram = spawn('./server/.venv/bin/python3', ['server/jsonForDiagram.py']);

      jsonForDiagram.stdout.on('data', (data) => {
        console.log(`stdout from jsonForDiagram.py: ${data}`);
      });

      jsonForDiagram.stderr.on('data', (data) => {
        console.error(`stderr from jsonForDiagram.py: ${data}`);
      });

      jsonForDiagram.on('close', (codeJson) => {
        console.log(`jsonForDiagram.py exited with code ${codeJson}`);
        // Odes�anie odpowiedzi do klienta w formacie JSON
        if (codeJson === 0) {
          generateAiModels();
          res.json({
            message: 'Skrypty Pythona zako�czone pomy�lnie.',
            csvCreateCode: code,
            jsonForDiagramCode: codeJson,
          });
        } else {
          res.status(500).json({
            error: `Blad podczas wykonania jsonForDiagram.py z kodem ${codeJson}`,
          });
        }
      });
    } else {
      res.status(500).json({ error: `Blad podczas wykonania csvCreate.py z kodem ${code}` });
    }
  });
});

app.get('/api/chart-data', (req, res) => {
  fs.readFile('./server/chart_data.json', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Nie udalo sie wczytac danych wykresu.');
    }
    res.json(JSON.parse(data));
  });
});

app.post('/api/elements', (req, res, next) => {
  const elements = [
    {
      buttonText: 'Lampa',
      elementType: 'Oswietlenie',
      elementPosition: 'Kuchnia',
      icon: '../../assets/Oswietlenie.svg',
      value: false,
      automation: false,
      gpio: 588,
      display: true,
    },
    {
      buttonText: 'Lampa',
      elementType: 'Oswietlenie',
      elementPosition: 'Sypialnia',
      icon: '../../assets/Oswietlenie.svg',
      value: false,
      automation: false,
      gpio: 598,
      display: true,
    },
    {
      buttonText: 'Lampa',
      elementType: 'Oswietlenie',
      elementPosition: 'Lazienka',
      icon: '../../assets/Oswietlenie.svg',
      value: false,
      automation: false,
      gpio: 593,
      display: true,
    },
    {
      buttonText: 'Temperatura',
      elementType: 'Temperatura',
      elementPosition: 'Lazienka',
      icon: '../../assets/Temperatura.svg',
      value: 21,
      gpio: 21,
      automation: false,
      display: true,
    },
    {
      buttonText: 'Wilgotność',
      elementType: 'Wilgotność',
      elementPosition: 'Lazienka',
      icon: '../../assets/Wilgotnosc.svg',
      value: 21,
      gpio: 21,
      automation: false,
      display: true,
    },
    {
      buttonText: 'Czujnik dymu',
      elementType: 'Zadymienie',
      elementPosition: 'Kuchnia',
      icon: '../../assets/Czujnik_Dymu.svg',
      value: 'Tak',
      gpio: 26,
      automation: false,
      display: true,
    },
    {
      buttonText: 'Monitoring',
      elementType: 'Monitoring',
      elementPosition: 'Na zewnatrz',
      icon: '../../assets/Monitoring.svg',
      value: false,
      automation: false,
      display: true,
    },
    {
      buttonText: 'Rolety',
      elementType: 'Rolety',
      elementPosition: 'Kuchnia',
      icon: '../../assets/Rolety.svg',
      value: false,
      gpio: 24,
      automation: true,
      display: true,
    },
    {
      buttonText: 'Czujnik zalania',
      elementType: 'Zalanie',
      elementPosition: 'Lazienka',
      icon: '../../assets/Czujnik_Zalania.svg',
      value: 'Nie',
      gpio: 20,
      automation: false,
      display: true,
    },
    {
      buttonText: 'Klimatyzacja',
      elementType: 'Klimatyzacja',
      elementPosition: 'Salon',
      icon: '../../assets/Klimatyzacja.svg',
      value: false,
      gpio: 583,
      automation: false,
      display: true,
    },
    {
      buttonText: 'Zamek',
      elementType: 'Zamek',
      elementPosition: 'Na zewnatrz',
      icon: '../../assets/Zamki.svg',
      value: false,
      gpio: 583,
      automation: false,
      display: true,
    },
    {
      buttonText: req.body.buttonText,
      elementType: req.body.elementType,
      elementPosition: req.body.elementPosition,
      icon: req.body.icon,
      value: req.body.value,
      automation: req.body.automation,
    },
  ];
  elem.count().then((el) => {
    if (el === 0) {
      elem.insertMany(elements, (err, docs) => {
        if (err) {
          throw new Error('No file');
        }

        res.status(201).json({
          message: 'Elements added successfully',
        });
      });
    }
  });
  if (user.findOne({ login: 'admin', password: 'admin', role: 'admin' })) {
    user.insertOne({ login: 'admin', password: 'admin', role: 'admin' }, (err, docs) => {
      if (err) {
        throw new Error('No file');
      }
      res.status(201).json({
        message: 'User added successfully',
      });
    });
  }
});

async function logUserActivity(userId, deviceId, state) {
  const activityLog = {
    userId,
    deviceId,
    state, // true or false, or any specific value
    timestamp: new Date(), // Current date and time
  };
  const count = await activityLogs.countDocuments();
  if (count === 0) {
    try {
      const adminUser = await user.findOne({ login: 'admin' });
      if (!adminUser) {
        return console.error('Admin user not found.');
      }

      const interactableElements = await elem.find({ gpio: { $in: [588, 598, 593, 24, 583] } }).toArray();

      const activityLogsData = [];
      for (let i = 0; i < 5000; i++) {
        interactableElements.forEach((element) => {
          const randomDate = new Date();
          randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));
          randomDate.setHours(Math.floor(Math.random() * 24));
          randomDate.setMinutes(Math.floor(Math.random() * 60));
          randomDate.setSeconds(Math.floor(Math.random() * 60));
          randomDate.setMilliseconds(0);

          const dayOfWeek = randomDate.getDay(); // Dzie� tygodnia jako liczba (0-6)
          const randomHour = randomDate.getHours();
          let simulatedState = false;

          // Specjalne zachowania zale�ne od typu urz�dzenia i lokalizacjisss
          switch (element.elementType) {
            case 'Rolety':
              if (element.elementPosition === 'Kuchnia') {
                simulatedState = randomHour > 7 ? true : randomHour < 20 ? false : simulatedState;
              }
              break;
            case 'Klimatyzacja':
              if (element.elementPosition === 'Salon') {
                simulatedState = dayOfWeek >= 1 && dayOfWeek <= 5 && randomHour >= 15 && randomHour <= 18;
              }
              break;
            case 'Oswietlenie':
              if (element.elementPosition === 'Kuchnia' && randomHour >= 18 && randomHour <= 20) simulatedState = true;
              else if (element.elementPosition === 'Lazienka' && ((randomHour >= 6 && randomHour <= 8) || (randomHour >= 19 && randomHour <= 22))) simulatedState = true;
              else if (element.elementPosition === 'Sypialnia' && randomHour >= 17 && randomHour <= 21) simulatedState = true;
              else if (element.elementPosition === 'Salon' && dayOfWeek >= 1 && dayOfWeek <= 5 && (randomHour === 19 || randomHour === 23)) simulatedState = randomHour === 19;
              break;
          }

          // Dodanie losowo�ci do symulacji niespodziewanych zachowa�
          if (Math.random() < 0.1) {
            // 5% szans na niespodziewane zachowanie
            simulatedState = !simulatedState;
          }

          // Weekendowe zwyczaje - brak aktywno�ci do 12:00
          if ((dayOfWeek === 0 || dayOfWeek === 6) && randomHour < 8) simulatedState = true;

          const logEntry = {
            userId: adminUser._id,
            deviceId: element._id,
            state: simulatedState,
            timestamp: randomDate.toISOString(),
          };
          activityLogsData.push(logEntry);
        });
      }
      await activityLogs.insertMany(activityLogsData);
      console.error('Activity logs generated successfully.');
    } catch (err) {
      console.error(err);
      console.error('Error generating activity logs.');
    }
  }

  activityLogs.insertOne(activityLog, (err, result) => {
    if (err) {
      console.error('Error logging user activity:', err);
      return;
    }
    console.log('User activity logged successfully');
  });
}

// Funkcja do aktualizacji stan�w urz�dze�
const generateAiModels = async () => {
  const pythonProcess = spawn('./server/.venv/bin/python3', ['server/generate-model.py']);
  pythonProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  pythonProcess.stderr.on('data', (data) => console.error(`stderr: ${data}`));
  pythonProcess.on('close', (code) => console.log(`Proces Pythona zako�czony z kodem ${code}`));
};

const updateDeviceStatesForUsersWithAIEnabled = async () => {
  // Znajd� u�ytkownik�w z w��czon� sztuczn� inteligencj�
  const userSetting = await setting.findOne({
    name: 'aiEnabled',
    enabled: true,
  });
  const userId = userSetting.userId;
  // Dla ka�dego u�ytkownika znajd� urz�dzenia, kt�re mog� by� sterowane
  const devices = await elem.find({ gpio: { $in: [588, 598, 593, 24, 583] } }).toArray();

  // Dla ka�dego urz�dzenia wykonaj predykcj� i zaktualizuj stan
  for (const device of devices) {
    await updateDeviceState(userId, device._id.toString());
  }
};

const updateDeviceState = async (userId, deviceId) => {
  const current_hour = new Date().getHours();
  const current_day_of_week = new Date().getDay();
  const is_weekend = [5, 6].includes(current_day_of_week) ? 1 : 0;
  // Uruchom skrypt Pythona do predykcji stanu urz�dzenia
  // const pythonProcess = spawn('./server/.venv/bin/python', ['server/predictState.py', userId, deviceId, current_hour, current_day_of_week, is_weekend], { stdio: [null, { highWaterMark: 1024 * 1024 }, { highWaterMark: 1024 * 1024 }] });
  const pythonProcess = await spawn('./server/.venv/bin/python3', ['server/predictState.py', userId, deviceId, current_hour, current_day_of_week, is_weekend], {
    stdio: ['pipe', 'pipe', 'pipe'], // Domy�lnie dla stdio jest 'pipe', co oznacza, �e Node.js b�dzie buforowa� dane wej�ciowe/wyj�ciowe. Ustawienie na 'inherit' u�ywa strumieni rodzica.
  });
  if (!pythonProcess) {
    console.error('Nie uda�o si� utworzy� procesu Pythona');
    return;
  }
  pythonProcess.stdout.on('data', async (data) => {
    const prediction = +data.toString().trim(); // Oczekiwana predykcja to '0' (wy��czony) lub '1' (w��czony)
    const boolPrediction = prediction === 1 ? true : false;
    // Aktualizacja stanu urz�dzenia w bazie danych
    const element = await elem.findOne({ _id: new ObjectId(deviceId) });
    if (element.gpio === LedKuchnia._gpio) {
      LedKuchnia.writeSync(prediction);
    } else if (element.gpio === LedLazienka._gpio) {
      LedLazienka.writeSync(prediction);
    } else if (element.gpio === LedSypialnia._gpio) {
      LedSypialnia.writeSync(prediction);
    } else if (element.gpio === Klimatyzacja._gpio) {
      Klimatyzacja.writeSync(prediction);
    } else if (element.gpio === 24 && element.value !== boolPrediction) {
      if (prediction === 1) spawn('python', ['server/stepperEngine.py', true]);
      else if (prediction === 0) spawn('python', ['server/stepperEngine.py', false]);
    }

    await elem.updateOne({ _id: new ObjectId(deviceId) }, { $set: { value: prediction === 1 } });

    console.log(`Updated device ${deviceId} to ${prediction === 1 ? 'ON' : 'OFF'}`);
  });
  pythonProcess.on('error', (error) => {
    console.error(`Wyst�pi� b��d: ${error.message}`);
  });
  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
};
// Cykliczne sprawdzanie i aktualizacja stan�w urz�dze� co 2 minuty
// setInterval(updateDeviceStatesForUsersWithAIEnabled, 600000);

app.get('/', (req, res) => {
  res.send({ hello: 'world' });
});
module.exports = app;
