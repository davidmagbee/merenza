import React, { useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const AudioCapture = ({ onTranscribe }) => {
  const [error, setError] =
    useState(null); /**Error state to handle transcription errors */
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  /** Start listening to audio */
  const startListening = () => {
    if (!browserSupportsSpeechRecognition) {
      setError("Your browser does not support speech recognition.");
      return;
    }

    SpeechRecognition.startListening({ continuous: true }).catch((err) => {
      console.error("Error starting speech recognition:", err);
      setError("Failed to start speech recognition. Please try again.");
    });
  };

  /** Stop listening to audio */
  const stopListening = () => {
    SpeechRecognition.stopListening().catch((err) => {
      console.error("Error stopping speech recognition:", err);
      setError("Failed to stop speech recognition. Please try again.");
    });
    onTranscribe(transcript); /**Pass transcript to parent component */
    resetTranscript();
  };

  return (
    <div>
      <button onClick={startListening} disabled={listening}>
        {" "}
        Start{" "}
      </button>{" "}
      <button onClick={stopListening} disabled={!listening}>
        {" "}
        Stop{" "}
      </button>{" "}
      <p> Transcript: {transcript} </p>{" "}
      {error && <p style={{ color: "red" }}> {error} </p>}{" "}
    </div>
  );
};

export default AudioCapture;
