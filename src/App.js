import React, { useState, useEffect } from "react";
import AudioCapture from "./components/AudioCapture";
import QuestionAnalyzer from "./components/QuestionAnalyzer";
import { getSuggestedAnswer } from "./services/answerService";

const App = () => {
  const [transcript, setTranscript] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState(null);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const url = "wss://api.openai.com/v1/realtime?model=whipser-1";
    
    const newWs = new WebSocket(url);

    newWs.onopen = () => {
      console.log("Connected to OpenAI WebSocket");
      newWs.send(JSON.stringify({
        type: "authorization",
        authorization: OPENAI_API_KEY
      }));
    };

    newWs.onmessage = async (message) => {
      const data = JSON.parse(message.data);
      if (data.type === "transcription.complete") {
        handleQuestionDetected([data.text]);
      }
    };

    newWs.onerror = (error) => {
      console.error("WebSocket error:", error);
      setError("WebSocket connection failed");
    };

    setWs(newWs);

    return () => {
      if (newWs) newWs.close();
    };
  }, []);

  const handleTranscription = (text) => {
    setTranscript(text);
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: "transcription",
        text: text
      }));
    }
  };

  const handleQuestionDetected = async (detectedQuestions) => {
    if (!detectedQuestions?.length) return;

    try {
      setQuestions(detectedQuestions);
      const answers = await Promise.all(
        detectedQuestions.map(async (question) => {
          const firebaseAnswer = await getSuggestedAnswer(question);
          
          if (firebaseAnswer === "No answer found." && ws?.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: "question",
              text: question
            }));
            return new Promise((resolve) => {
              ws.onmessage = (message) => {
                const data = JSON.parse(message.data);
                if (data.type === "answer") {
                  resolve(data.text);
                }
              };
            });
          }
          return firebaseAnswer;
        })
      );
      
      setAnswers(answers);
      setError(null);
    } catch (err) {
      console.error("Error processing questions:", err);
      setError("Failed to process questions");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Audio Medical Assistant</h1>
      <AudioCapture onTranscribe={handleTranscription} />
      <QuestionAnalyzer
        transcript={transcript}
        onQuestionDetected={handleQuestionDetected}
      />
      <div className="mt-4">
        <h3 className="text-xl font-semibold">Detected Questions</h3>
        {questions.map((question, index) => (
          <div key={`q-${index}`} className="my-2">
            <strong>Q:</strong> {question}
            <div className="ml-4">
              <strong>A:</strong> {answers[index] || 'Processing...'}
            </div>
          </div>
        ))}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default App;