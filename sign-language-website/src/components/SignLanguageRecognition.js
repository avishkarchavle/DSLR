import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

const SignLanguageRecognition = () => {
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [videoInput, setVideoInput] = useState(null);
    const [prediction, setPrediction] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);

    const videoRef = useRef(null);
    const speechSynthesisRef = useRef(window.speechSynthesis);

    const handleVideoChange = (event) => {
        const file = event.target.files[0];
        setVideoInput(file);
    };
const handleWebcamInput = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(error => console.error('Error playing video:', error));
        }

        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = handleDataAvailable;
        setMediaRecorder(recorder);

        setVideoInput(stream);
        setIsRecording(true);
    } catch (error) {
        console.error('Error accessing webcam:', error.name, error.message);
    }
};


    const handleStopWebcam = () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            setMediaRecorder(null);
            setVideoInput(null);
            setIsRecording(false);
        }
    };

    const handleDataAvailable = (event) => {
        if (event.data.size > 0) {
            const videoBlob = new Blob([event.data], { type: 'video/webm' });
            setVideoInput(videoBlob);
        }
    };

    const handleUrlInputChange = (event) => {
        setUrlInput(event.target.value);
    };

    const handlePredict = async () => {
        try {
            let videoFrame;
            if (urlInput.trim() !== '') {
                videoFrame = urlInput;
            } else if (typeof videoInput === 'string') {
                videoFrame = videoInput;
            } else {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = 640;
                canvas.height = 480;

                if (typeof videoInput === 'object') {
                    const videoBlob = await fetch(URL.createObjectURL(videoInput)).then((res) => res.blob());
                    videoFrame = URL.createObjectURL(videoBlob);
                } else {
                    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                    videoFrame = canvas.toDataURL('image/jpeg');
                }
            }

            const response = await axios.post('http://localhost:5000/predict', { videoFrame });
            setPrediction(response.data.prediction);
            speakText(response.data.prediction);
        } catch (error) {
            console.error('Error predicting:', error);
        }
    };

    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesisRef.current.speak(utterance);
    };

    useEffect(() => {
        return () => {
            if (isSpeaking) {
                speechSynthesisRef.current.cancel();
            }
        };
    }, [isSpeaking]);

    return (
        <div className="container mt-5">
            <h2 className="display-4 mb-4">Sign Language Recognition</h2>
            <div className="mb-3">
                <label>Upload Video:</label>
                <input type="file" accept="video/*" onChange={handleVideoChange} />
            </div>
            {isRecording ? (
                <div className="mb-3">
                    <button className="btn btn-danger" onClick={handleStopWebcam}>
                        Stop Webcam
                    </button>
                </div>
            ) : (
                <div className="mb-3">
                    <button className="btn btn-primary" onClick={handleWebcamInput}>
                        Start Webcam
                    </button>
                </div>
            )}
            <div className="mb-3">
                <label>Video URL:</label>
                <input type="text" className="form-control" value={urlInput} onChange={handleUrlInputChange} />
            </div>
            <div className="mb-3">
                <button className="btn btn-success" onClick={handlePredict}>
                    Predict
                </button>
            </div>
            {prediction && (
                <div className="mt-3">
                    <p>Prediction: {prediction}</p>
                    <button
                        className={`btn ${isSpeaking ? 'btn-danger' : 'btn-success'}`}
                        onClick={() => setIsSpeaking(!isSpeaking)}
                    >
                        {isSpeaking ? 'Stop Speaking' : 'Speak'}
                    </button>
                </div>
            )}
            {isRecording && (
                <div className="mt-3">
                    <video
                        ref={videoRef}
                        width="640"
                        height="480"
                        autoPlay
                        playsInline
                        muted={true}
                    />
                </div>
            )}
        </div>
    );
};

export default SignLanguageRecognition;
