import { useState } from "react";

export type LoggerDataType = {
	data: string,
	type?: 'ERROR' | 'LOG' | 'INFO' | 'TABLE',
	specificType?: string,
	timestamp?: number,
}

const useLogger = () => {
	const [dataLogs, setDataLogs] = useState<LoggerDataType[]>([]);

	function handleLogger(args: any[], type: "ERROR" | "LOG" | "INFO" | "TABLE") {
		const _log = {} as LoggerDataType

		args = args.map((a => JSON.stringify(a)))

		_log.data = `${args.join(' ')}`

		_log.timestamp = new Date().getTime()

		_log.type = type;

		(dataLogs || []).push(_log)

		setDataLogs([...dataLogs])
	}

	const UILogger = Object.freeze({
		log: function (...args: any) {
			handleLogger(args, "LOG")
		},
		info: function (...args: any) {
			handleLogger(args, "INFO")
		},
		error: function (...args: any) {
			handleLogger(args, "ERROR")
		},
		table: function (...args: any) {
			handleLogger(args, "TABLE")
		},
		dataLogs
	});

	return UILogger;
};

export default useLogger;
