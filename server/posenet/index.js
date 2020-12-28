const tf = require('@tensorflow/tfjs-node')
const posenet = require('@tensorflow-models/posenet')

const { createCanvas, Image } = require('canvas')
const imageScaleFactor = 0.5
const outputStride = 16
const flipHorizontal = false
var net
;(async () => {
	net = await posenet.load(0.75)
	console.log('loaded')
})()

const tryModel = async (file_path) => {
	// console.log(file_path)
	// net = await posenet.load(0.75)
	try {
		const img = new Image()

		img.src = file_path
		const canvas = createCanvas(img.width, img.height)
		const ctx = canvas.getContext('2d')
		ctx.drawImage(img, 0, 0)
		const input = tf.browser.fromPixels(canvas)
		// net.estimateMultiplePoses()
		const pose = await net.estimateSinglePose(input, imageScaleFactor, flipHorizontal, outputStride)
		console.log(file_path)

		// console.log(pose);
		data = ''
		for (const keypoint of pose.keypoints) {
			data += `${keypoint.part}: (${keypoint.position.x},${keypoint.position.y})\n`
		}
		// console.log(data)
		return data
	} catch (error) {
		console.error(error, file_path)
	}
}
module.exports = tryModel

// tryModel()
