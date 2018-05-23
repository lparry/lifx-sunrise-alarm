// Create a LifxLan object
const Lifx  = require('node-lifx-lan');

const fs = require('fs')

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec))
 

async function turnOn({ k, b, t }) {
  const tmsec = t * 1000
    await Lifx.turnOnFilter({
    filters: [{ label: 'Bedside lamp' }],
    color: {
      hue: 1,
      saturation: 1,
      brightness: b,
      kelvin: k,
    },
    duration: tmsec 
  });

  return await sleep(tmsec+100)
}

async function setColor({ k, b, t }) {
  const tmsec = t * 1000
    await Lifx.setColorFilter({
    filters: [{ label: 'Bedside lamp' }],
    color: {
      hue: 1,
      saturation: 1,
      brightness: b,
      kelvin: k,
    },
    duration: tmsec 
  });

  return await sleep(tmsec+100)
}


async function turnOff() {
  return await Lifx.turnOffFilter({
    filters: [{ label: 'Bedside lamp' }],
    duration: 0,
  });
}

async function sunrise({duration}) {
  const t = duration / 4
  await turnOn({k: 1500, b: 0.25, t})
  await setColor({k: 2500, b: 0.5, t })
  // await setColor({k: 5000, b: 0.75, t })
  await setColor({k: 9000, b: 1,  t: t*2 })
}

let retries = 0

function go(duration) {
  Lifx.discover().then(async () => {
    await turnOff()
    await sleep(2000)
    await sunrise({ duration })
  }).then(() => {
    console.log('Done!');
    Lifx.destroy()
  }).catch((error) => {
    console.error(error);
    if (retries < 5) {
      retries = retries + 1
      go(duration)
    }
  });
}


const config = fs.readFileSync("config.json", "utf8")

const durationSecs = config.durationMins * 60

console.log(config)

//go(60)
