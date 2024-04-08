import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';

const TextToSpeech = () => {
    const [inputText, setInputText] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);

    const springProps = useSpring({
        opacity: isSpeaking ? 1 : 0,
        transform: `scale(${isSpeaking ? 1 : 0.8})`,
    });

    const convertToSpeech = () => {
        if ('speechSynthesis' in window) {
            const synthesis = window.speechSynthesis;
            const utterance = new SpeechSynthesisUtterance(inputText);

            synthesis.speak(utterance);
            setIsSpeaking(true);

            // Reset animation state after speech is complete
            utterance.onend = () => setIsSpeaking(false);
        } else {
            alert('Text-to-speech is not supported in your browser.');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="display-4 mb-4">Text to Speech</h2>
            <div className="form-group">
                <textarea
                    id="inputText"
                    className="form-control"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter text"
                />
            </div>
            <animated.div
                className="mt-3"
                style={{
                    opacity: springProps.opacity,
                    transform: springProps.transform,
                    color: '#007bff',
                    fontSize: '20px',
                    fontWeight: 'bold',
                }}
            >
                Speaking...
            </animated.div>
            <div className="mt-3">
                <button className="btn btn-primary" onClick={convertToSpeech}>
                    Convert to Speech
                </button>
            </div>

        </div>
    );
};

export default TextToSpeech;
