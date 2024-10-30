import React, { useState, useEffect } from "react";
import AudioCapture from "./components/AudioCapture";
import QuestionAnalyzer from "./components/QuestionAnalyzer";
import { getSuggestedAnswer } from "./services/answerService";

const App = () => {
  const [transcript, setTranscript] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState(null); /** Error state for overall app */
  const [ws, setWs] = useState(null); // WebSocket state

  // Create and manage the WebSocket connection
  useEffect(() => {
    const url = "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01";
    const newWs = new WebSocket(url, [], {
      headers: {
        'Authorization': `OPENAI_API_KEY`
      }
    });

    newWs.onopen = () => {
      console.log("Connected to OpenAI WebSocket.");
    };

    newWs.onmessage = (message) => {
      const data = JSON.parse(message.data);
      console.log("Received message:", data);

      if (data.type === "response.create") {
        setAnswers((prevAnswers) => [...prevAnswers, data.response.text]);
      }
    };

    newWs.onerror = (error) => {
      console.error("WebSocket error:", error);
      setError("WebSocket connection failed.");
    };

    newWs.onclose = (event) => {
      console.error("WebSocket closed unexpectedly:", event);
      setError("WebSocket connection closed unexpectedly.");
    };

    setWs(newWs);

    // Clean up WebSocket connection when the component unmounts
    return () => {
      newWs.close();
    };
  }, []);

  // Handle transcription from AudioCapture
  const handleTranscription = (text) => {
    setTranscript(text);

    // Send the transcript over WebSocket if connected
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: "transcription.create",
        transcription: text,
      }));
    }
  };

  // Handle questions detected
  const handleQuestionDetected = async (detectedQuestions) => {
    if (detectedQuestions.length === 0) {
      setError("No valid questions detected.");
      return;
    }

    try {
      setQuestions(detectedQuestions);
      const suggestedAnswers = await Promise.all(
        detectedQuestions.map(getSuggestedAnswer)
      );
      setAnswers(suggestedAnswers);
      setError(null); /** Clear any previous errors */
    } catch (error) {
      console.error("Error suggesting answers:", error);
      setError("Failed to suggest answers.");
    }
  };

  return (
    <div>
      <h1> Audio Medical Assistant </h1>{" "}
      <AudioCapture onTranscribe={handleTranscription} />{" "}
      <QuestionAnalyzer
        transcript={transcript}
        onQuestionDetected={handleQuestionDetected}
      />
      <div>
        <h3> Detected Questions </h3>{" "}
        {questions.map((question, index) => (
          <p key={index}>
            {" "}
            <strong> Question: </strong> {question}
          </p>
        ))}
        <h3> Suggested Answers </h3>{" "}
        {answers.map((answer, index) => (
          <p key={index}>
            {" "}
            <strong> Answer: </strong> {answer}
          </p>
        ))}{" "}
        {error && <p style={{ color: "red" }}> {error} </p>}{" "}
      </div>{" "}
    </div>
  );
};

export default App;
