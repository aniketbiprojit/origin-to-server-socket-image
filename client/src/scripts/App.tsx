import React, { Fragment } from 'react'
import Webcam from 'react-webcam'
import '../styles/App.scss'

import socketIOClient from 'socket.io-client'

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

class App extends React.Component<
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

	private net: posenet.PoseNet | undefined
	async load_model() {
		console.time('in')
		// const net = await posenet.load({
		// 	architecture: 'MobileNetV1',
		// 	outputStride: 16,
		// 	inputResolution: { width: 640, height: 480 },
		// 	multiplier: 0.75,
		// })

		this.net = await posenet.load({
			architecture: 'ResNet50',
			outputStride: 16,
			inputResolution: { width: 640, height: 480 },
			multiplier: 1,
		})

		// console.log('loaded', this.net)
		this.setState({ loaded_model: true })
		console.timeEnd('in')
		// net.estimateSinglePose()
	}

	componentDidMount() {
		this.load_model()
		this.socket = socketIOClient(url)

		this.socket.on('processed_data', (data: any) => {
			console.log(data)
		})
	}

	updatedScreenshot(data: string) {
		// console.log(data, 'data')
		if (this.state.loaded_model === false) {
			// this.setState({ loaded_model: true })
			const date_id = new Date()
			const uid = require('uuid').v4()
			const ids: IIds = this.state.ids

			ids[uid as string] = ''

			this.setState({ ids })

			this.socket?.emit('ImageByClient', {
				buffer: data,
				username: 'username',
				image_name: date_id,
				uid: uid,
			})

			this.socket?.on('ProcessedData', (data: any) => {
				const ids: IIds = this.state.ids
				ids[data['uid']] = data['filename']
				const latest_image = data['filename']
				this.setState({ ids, latest_image }, () => {
					// console.log('file:///this.state.latest_image')
					this.forceUpdate()
				})
			})
		} else {
			// const date_id = new Date()
			const net = this.net

			const uid = require('uuid').v4()
			const ids: IIds = this.state.ids

			ids[uid as string] = ''

			this.setState({ ids })
			console.log(net)
		}
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

export default App
