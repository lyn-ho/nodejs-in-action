const fs = require('fs')
const path = require('path')

const args = process.argv.splice(2)
const command = args.shift()
const taskDescription = args.join(' ')
const file = path.join(process.cwd(), '/.tasks')

switch (command) {
  case 'list':
    listTasks(file)
    break
  case 'add':
    addTask(file, taskDescription)
    break
  default:
    console.log(`Usage: ${process.argv[0]} list|add [taskDescription]`)
}

function listTasks(file) {
  loadOrInitializeTaskArray(file, function (tasks) {
    for (let task of tasks) {
      console.log(task)
    }
  })
}

function addTask(file, description) {
  loadOrInitializeTaskArray(file, function (tasks) {
    tasks.push(description)
    storeTasks(file, tasks)
  })
}

function loadOrInitializeTaskArray(file, cb) {
  fs.exists(file, function (exists) {
    let tasks = []

    if (exists) {
      fs.readFile(file, 'utf8', function (err, data) {
        if (err) throw err
        data = data.toString()
        tasks = JSON.parse(data || '[]')
        cb(tasks)
      })
    } else {
      cb([])
    }
  })
}

function storeTasks(file, tasks) {
  fs.writeFile(file, JSON.stringify(tasks), 'utf8', function (err) {
    if (err) throw err
    console.log('Saved.')
  })
}
