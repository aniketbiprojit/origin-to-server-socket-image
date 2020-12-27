import React, { Fragment } from 'react'
import Webcam from 'react-webcam'
import '../styles/App.scss'

import socketIOClient from 'socket.io-client'

export const url = 'http://localhost:8080/'

type webcam_type = {
	updatedScreenshot: (imgSrc: string) => void
}

const WebCamComponent = (props: webcam_type) => {
	// useCallback(() => {}, [])
	const webcamRef: React.RefObject<Webcam> = React.useRef(null)
	const capture = React.useCallback(() => {
		if (webcamRef) {
			const imageSrc = webcamRef.current?.getScreenshot()
			const interval = setInterval(() => {
				// eslint-disable-next-line
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
	}
> {
	private socket: SocketIOClient.Socket | undefined
	state = {
		ids: {},
		latest_image: '',
	}

	componentDidMount() {
		this.socket = socketIOClient(url)

		this.socket.on('processed_data', (data: any) => {
			console.log(data)
		})
	}

	updatedScreenshot(data: string) {
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
					<pre>{JSON.stringify(this.state, undefined, 4)}</pre>
				</div>
			</div>
		)
	}
}

export default App
