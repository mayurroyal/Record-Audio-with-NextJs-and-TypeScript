import { useEffect, useState } from "react";
import useLogger, { LoggerDataType } from "./useLogger";

const useAudioRecorder = () => {
	const { log, dataLogs } = useLogger()

	const [audioBlobs, setAudioBlobs] = useState<BlobPart[]>([]);
	const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>();
	const [mediaRecorderState, setMediaRecorderState] = useState<string>("NotStarted");
	const [mimeType, setMimeType] = useState<string>();
	const [streamBeingCaptured, setStreamBeingCaptured] = useState<MediaStream | null>();
	const [dataLogsAR, setDataLogsAR] = useState<LoggerDataType[]>([]);

	useEffect(() => {
		setDataLogsAR(dataLogs)
	}, [dataLogs])


	function stopStream() {
		if (streamBeingCaptured) {
			streamBeingCaptured.getTracks().forEach((track) => track.stop());
		}

		if (mediaRecorder) {
			mediaRecorder.stop();
		}
	};

	function attachHandlers(mediaRecorder: MediaRecorder) {
		mediaRecorder.addEventListener("dataavailable", (event) => {
			log(`${event.data.size} byte recoded`);
			audioBlobs.push(event.data);
			setAudioBlobs(audioBlobs);
		});

		["error", "resume", "start", "stop"].forEach((eventName: string) => {
			mediaRecorder.addEventListener(eventName, (event: Event) => {
				log(`${eventName} event came`);
				setMediaRecorderState(event.type);
			});
		})
	}

	function clearHandlers() {
		if (!mediaRecorder) return

		mediaRecorder.removeEventListener("dataavailable", () => { });

		["error", "resume", "start", "stop"].forEach((eventName: string) => {
			mediaRecorder.addEventListener(eventName, () => { });
		})
	};

	function resetRecording() {
		clearHandlers()
		setMediaRecorder(null);
		setStreamBeingCaptured(null);
		setMediaRecorderState("NotStarted");
		setAudioBlobs([])
		setMimeType(undefined)
	};

	const startRecording = async () => {

		let stream = null;

		log(`Start Recording event came`)

		try {
			stream = await navigator.mediaDevices.getUserMedia({ audio: true });

			setStreamBeingCaptured(stream);

			const mr = new MediaRecorder(stream);

			setMediaRecorder(mr);

			attachHandlers(mr);

			mr.start();
		} catch (err: any) {
			log(`Error in getting user media`, err.name);
		}
	};

	const stopRecording = async (): Promise<any> => {
		log(`Stop recording event came`)

		if (mediaRecorder) {
			setMimeType(mediaRecorder.mimeType);
		}

		stopStream();
	};

	const pauseRecording = async (): Promise<any> => {
		log(`Pause recording event came`)

		if (mediaRecorder) {
			mediaRecorder.pause();
		}
	};


	const AudioRecorderService = Object.freeze({
		startRecording,
		stopRecording,
		pauseRecording,
		resetRecording,
		mediaRecorderState,
		streamBeingCaptured,
		audioBlobs,
		mimeType,
		dataLogsAR
	});

	return AudioRecorderService;
};

export default useAudioRecorder;
