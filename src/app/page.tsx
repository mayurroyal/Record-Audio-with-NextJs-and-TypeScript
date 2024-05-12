"use client";

import useAudioRecorder from "@/hooks/useAudioRecorder";
import { Box, Button, Grid, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

export default function Home() {
	const { startRecording, stopRecording, resetRecording, audioBlobs, mimeType, mediaRecorderState, dataLogsAR } = useAudioRecorder();
	const [audioData, setAudioData] = useState()
	const [audioType, setAudioType] = useState<string>()

	const audioRef: any = useRef(null)

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
			<Grid container>
				<Grid sm={6} item>
					<Typography sx={{ px: 1, py: 3 }}>Current State : {mediaRecorderState}</Typography>

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
				</Grid>
				<Grid sm={6} item>
					<List>
						{dataLogsAR.map((dl, index) => (
							<ListItem key={index}>
								<ListItemText
									primary={<Box sx={{ textTransform: 'capitalize' }}>{dl.data.replaceAll('"', '')}</Box>}
									secondary={new Date(Number(dl.timestamp)).toString()}
								/>
							</ListItem>
						))}
					</List>
				</Grid>
			</Grid >
		</Box>
	);
}
