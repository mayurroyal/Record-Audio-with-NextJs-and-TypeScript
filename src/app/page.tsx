"use client";

import useAudioRecorder from "@/hooks/useAudioRecorder";
import { Box, Button, Card, Grid, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

export default function Home() {
	const { startRecording, stopRecording, resetRecording, audioBlobs, mimeType, mediaRecorderState, dataLogsAR } = useAudioRecorder();
	const [audioData, setAudioData] = useState()
	const [audioType, setAudioType] = useState<string>()

	const audioRef: any = useRef(null)

	/*
		TODO: 
			1. diable immediate multiple click on Start / Stop button 
			2. show errors
			3. upload recorded files in chunks 
	*/

	useEffect(() => {
		if (audioBlobs.length === 0) return

		const recorderAudioAsBlob = new Blob(audioBlobs, { type: mimeType })

		console.log("recoding length", recorderAudioAsBlob.size)

		let reader = new FileReader();

		reader.onload = async (e: any) => {
			let base64URL = e.target.result;

			setAudioData(base64URL);

			let blobType = recorderAudioAsBlob.type.includes(";") ?
				recorderAudioAsBlob.type.substr(0, recorderAudioAsBlob.type.indexOf(';')) : recorderAudioAsBlob.type;

			setAudioType(blobType)

			setTimeout(async () => {
				console.log("start playing for recording length", audioBlobs.length)

				await audioRef.current.load();

				await audioRef.current.play()
			}, 100);
		};

		reader.readAsDataURL(recorderAudioAsBlob);

		return () => {
			resetRecording()
		}

	}, [audioBlobs.length])


	async function stopRecodingAndPlay() {
		await stopRecording();

		await audioRef.current.pause()

		audioRef.current.currentTime = 0
	}

	return (
		<Box sx={{ p: 5 }}>
			<Grid container spacing={2}>
				<Grid sm={6} item>
					<Card sx={{ p: 2, border: '1px solid #ddd' }}>
						<Box sx={{ px: 1, py: 3, display: 'flex' }}>
							<Box>Current State :</Box>
							<Box sx={{ textTransform: 'capitalize', pl: 1, fontWeight: 500 }} >{mediaRecorderState}</Box>
						</Box>

						<Box sx={{ py: 3 }}>
							<audio ref={audioRef} controls>
								<source src={audioData} type={audioType} />
							</audio>
						</Box>

						<Box sx={{ py: 3 }}>
							<Button
								onClick={() => {
									startRecording();
								}}
							>
								Start Recording
							</Button>
							<Button
								onClick={() => {
									stopRecodingAndPlay()
								}}
							>
								Stop Recording
							</Button>

						</Box>
					</Card>
				</Grid>
				<Grid sm={6} item>
					<Card sx={{ p: 2, border: '1px solid #ddd' }}>
						<Box sx={{ px: 1, py: 3, display: 'flex' }}>
							<Box>Logs :</Box>
						</Box>
						<List>
							{dataLogsAR.map((dl, index) => (
								<ListItem sx={{ pt: 0 }} key={index}>
									<ListItemText
										sx={{ my: 0 }}
										primary={<Box sx={{ textTransform: 'capitalize' }}>{dl.data.replaceAll('"', '')}</Box>}
										secondary={new Date(Number(dl.timestamp)).toString().split("GMT")[0]}
									/>
								</ListItem>
							))}
						</List>
					</Card>
				</Grid>
			</Grid>
		</Box>
	);
}
