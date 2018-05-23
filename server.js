const express = require('express')
const fs = require('fs')

const app = express()

const page = fs.readFileSync("index.html", "utf8")

const renderPage = (req, res) => {
  const config = JSON.parse(fs.readFileSync("config.json", "utf8"))
  res.set('Content-Type', 'text/html');
  res.send(
    page.replace(/;timeValue;/g, config.alarmTime)
    .replace(/;durationValue;/g, config.durationMins)
  )
}
app.use(express.urlencoded()); // to support URL-encoded bodies

app.get('/', renderPage)

app.post('/update', (req, res) => {
  const {alarmTime, durationMins} = req.body
  const payload = {
    alarmTime: alarmTime ? alarmTime : "07:30",
    durationMins: durationMins ? durationMins : 15,
  }
  fs.writeFileSync("config.json", JSON.stringify(payload))
  res.redirect("/")
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
