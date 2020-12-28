const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const port = process.env.PORT || 8080

const spawn = require('child_process').spawn

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(require('cors')())

var serveIndex = require('serve-index')

app.use('/cdn', express.static('uploads'), serveIndex('uploads'))
app.get('/', (req, res) => res.send('Ok').status(200))

const server = http.createServer(app)

const io = socketIo(server, {
	cors: true,
})

function save(image, uid, image_name) {
	const fs = require('fs')
	const filename = __dirname + `/uploads/${uid}/${image_name}.jpg`

	if (!fs.existsSync(__dirname + `/uploads/${uid}`)) {
		fs.mkdirSync(__dirname + `/uploads/${uid}`, { recursive: true })
	}
	const base64Data = image.replace(/^data:([A-Za-z-+/]+);base64,/, '')

	fs.writeFileSync(filename, base64Data, { encoding: 'base64' })

	return filename
}

io.on('connection', (socket) => {
	console.log('New client connected:', socket.id)

	socket.on('ImageByClient', async (data) => {
		const username = data['username']
		const filename = save(data['buffer'], username, data['image_name'])

		// const pyprocess = spawn('python3', ['./run.py', filename])

		// pyprocess.stdout.on('data', async (recv) => {
		const data_to_send = await tryModel(`./uploads/${username}/${filename}`)
		io.to(socket.id).emit('ProcessedData', {
			filename: data_to_send,
			uid: data['uid'],
		})
		// })
	})

	socket.on('disconnect', () => {
		console.log('Client disconnected', socket.id)
	})
})

const tryModel = require('./posenet/index')

app.get('/try', async (req, res) => {
	// console.log(tryModel)
	res.send(await tryModel('/home/aniket/Work/m/server/uploads/username/2020-12-28T18:34:17.721Z.jpg'))
})

server.listen(8080, () => {
	console.log(8080)
})
