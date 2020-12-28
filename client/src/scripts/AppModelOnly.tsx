import React, { Fragment } from 'react'
import Webcam from 'react-webcam'
import '../styles/App.scss'

// import socketIOClient from 'socket.io-clien/t'

// import { browser } from '@tensorflow/tfjs'
import * as posenet from '@tensorflow-models/posenet'
export const url = 'http://localhost:8080/'

type webcam_type = {
	updatedScreenshot: (imgSrc: string) => void
}

const WebCamComponent = (props: webcam_type) => {
	const webcamRef: React.RefObject<Webcam> = React.useRef(null)

	const capture = React.useCallback(() => {
		if (webcamRef) {
			const interval = setInterval(() => {
				//
				let imageSrc = webcamRef.current?.getScreenshot()

				props.updatedScreenshot(imageSrc as string)
			}, 500)
			setTimeout(() => {
				clearTimeout(interval)
			}, 60000)
		}
		// eslint-disable-next-line
	}, [webcamRef])

	const videoConstraints = {
		facingMode: 'user',
	}

	return (
		<Fragment>
			<Webcam audio={false} height={720} ref={webcamRef} screenshotFormat='image/jpeg' width={1280} videoConstraints={videoConstraints} />
			<button onClick={capture}>Capture photo</button>
		</Fragment>
	)
}

interface IIds {
	[key: string]: string
}

class AppModelOnly extends React.Component<
	{},
	{
		ids: IIds
		latest_image: string
		loaded_model: boolean
	}
> {
	private socket: SocketIOClient.Socket | undefined
	state = {
		ids: {},
		latest_image: '',
		loaded_model: false,
	}

	private res_net: posenet.PoseNet | undefined
	private moible_net: posenet.PoseNet | undefined

	async load_model() {
		console.time('resnet loaded')

		this.res_net = await posenet.load({
			architecture: 'ResNet50',
			outputStride: 16,
			inputResolution: { width: 640, height: 480 },
			multiplier: 1,
		})

		// console.log('loaded res net', this.res_net)

		this.setState({ loaded_model: true })
		console.timeEnd('resnet loaded')
	}

	async componentDidMount() {
		console.log('mounted')
		console.time('mobilenet loaded')
		for (let index = 0; index < 10; index++) {
			// posenet.load({
			// 	architecture: 'MobileNetV1',
			// 	outputStride: 8,
			// 	inputResolution: { width: 640, height: 480 },
			// 	multiplier: 0.75,
			// })
		}
		this.moible_net = await posenet.load({
			architecture: 'MobileNetV1',
			outputStride: 16,
			inputResolution: { width: 640, height: 480 },
			multiplier: 0.75,
		})
		console.log('dafafd')
		console.timeEnd('mobilenet loaded')
		this.load_model()
		// this.socket = socketIOClient(url)

		// this.socket.on('processed_data', (data: any) => {
		// 	console.log(data)
		// })
	}

	async updatedScreenshot(data: string) {
		let net
		if (this.state.loaded_model === false) {
			net = this.moible_net
		} else {
			net = this.res_net
		}
		const img = new Image()

		img.src = data
		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
		ctx.drawImage(img, 0, 0)
		// const input = browser.fromPixels(canvas)
		console.log(net)
		// console.log(await net?.estimateSinglePose(input))
	}

	render() {
		return (
			<div className='App'>
				<WebCamComponent
					updatedScreenshot={(data: string) => {
						this.updatedScreenshot(data)
					}}
				/>
				<br />
				<div className='' style={{ width: '500px' }}>
					{this.state.loaded_model === false ? <div className=''>Loading Model</div> : <div className=''>Model Loaded</div>}
					<pre>{JSON.stringify(this.state, undefined, 8)}</pre>
				</div>
			</div>
		)
	}
}

export default AppModelOnly
