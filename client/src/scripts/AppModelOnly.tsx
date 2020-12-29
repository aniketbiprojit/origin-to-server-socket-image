import React, { Fragment } from 'react'
import Webcam from 'react-webcam'
import '../styles/App.scss'

// import socketIOClient from 'socket.io-clien/t'

// import { browser } from '@tensorflow/tfjs'
import * as posenet from '@tensorflow-models/posenet'
export const url = 'http://localhost:8080/'

type webcam_type = {
	// updatedScreenshot?: (imgSrc: string) => void
	// fromMediaStream: (stream: MediaStream) => void
}

const WebCamComponent = (props: webcam_type) => {
	const webcamRef: React.RefObject<Webcam> = React.useRef(null)

	const capture = React.useCallback(() => {
		if (webcamRef) {
			const interval = setInterval(() => {
				//
				// let imageSrc = webcamRef.current?.getScreenshot()
				// props.updatedScreenshot(imageSrc as string)
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
			<Webcam
				audio={false}
				// onUserMedia={(data) => props.fromMediaStream(data)}
				height={720}
				ref={webcamRef}
				id='video_main_id'
				screenshotFormat='image/jpeg'
				width={1280}
				videoConstraints={videoConstraints}
			/>
			<button onClick={capture}>Capture photo</button>
		</Fragment>
	)
}

interface IIds {
	[key: string]: string
}

type loading_types = 'loading' | 'mobile_net' | 'res_net'

class AppModelOnly extends React.Component<
	{},
	{
		ids: IIds
		latest_image: string
		loaded_model: loading_types
		posenet_data: Object
	}
> {
	private socket: SocketIOClient.Socket | undefined
	state = {
		ids: {},
		latest_image: '',
		loaded_model: 'loading' as loading_types,
		posenet_data: {},
	}

	private res_net: posenet.PoseNet | undefined
	private mobile_net: posenet.PoseNet | undefined

	async load_model() {
		console.time('resnet loaded')

		this.res_net = await posenet.load({
			architecture: 'ResNet50',
			outputStride: 16,
			inputResolution: { width: 640, height: 480 },
			multiplier: 1,
		})

		// console.log('loaded res net', this.res_net)

		this.setState({ loaded_model: 'res_net' })
		console.timeEnd('resnet loaded')
	}

	async componentDidMount() {
		console.log('mounted')
		console.time('mobilenet loaded')

		this.mobile_net = await posenet.load({
			architecture: 'MobileNetV1',
			outputStride: 16,
			inputResolution: { width: 640, height: 480 },
			multiplier: 0.75,
		})
		this.setState({ loaded_model: 'mobile_net' })

		this.fromMediaStream()

		console.log('dafafd')
		console.timeEnd('mobilenet loaded')
		this.load_model()
	}

	// async updatedScreenshot(data: string) {
	// 	let net
	// 	if (this.state.loaded_model === false) {
	// 		net = this.moible_net as any
	// 	} else {
	// 		net = this.res_net as any
	// 	}
	// 	const img = new Image()

	// 	img.src = data
	// 	const canvas = document.createElement('canvas')
	// 	const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
	// 	ctx.drawImage(img, 0, 0)

	// 	/** PoseNet logic. */
	// 	console.log(net)
	// 	// net?.estimateSinglePose()
	// }

	getNet() {
		let net: posenet.PoseNet
		if (this.state.loaded_model !== 'res_net') {
			net = this.mobile_net as posenet.PoseNet
		} else {
			net = this.res_net as posenet.PoseNet
		}
		return net
	}

	async fromMediaStream() {
		const video = document.getElementById('video_main_id')
		// console.log(video)
		video?.addEventListener('loadeddata', async () => {
			try {
				const net = this.getNet()
				setInterval(async () => {
					this.setState({ posenet_data: await net.estimateSinglePose(video as any) })
					// console.log()
				}, 500)
			} catch (error) {
				console.log(error)
			}
		})
	}

	render() {
		return (
			<div className='App'>
				<WebCamComponent
				// updatedScreenshot={(data: string) => {
				// 	this.updatedScreenshot(data)
				// }}
				// fromMediaStream={(data: MediaStream) => {
				// 	this.fromMediaStream()
				// }}
				/>
				<br />
				<div className='' style={{ width: '500px' }}>
					{this.state.loaded_model === 'loading' ? (
						<div className=''>Loading Model</div>
					) : (
						<div className=''>Loaded {this.state.loaded_model}</div>
					)}
					<pre>{JSON.stringify(this.state, undefined, 8)}</pre>
				</div>
			</div>
		)
	}
}

export default AppModelOnly
