const isUserMediaSupported = async (): Promise<any> => {
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
        return Promise.resolve(false);
    }

    return Promise.resolve(true);
}