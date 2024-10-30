import React, { useState, useEffect } from "react";

const QuestionAnalyzer = ({ transcript, onQuestionDetected }) => {
  const [error, setError] =
    useState(null); /** Error state for question detection */
  const questionWords = ["what", "why", "how", "when", "where"];

useEffect(() => {
  const detectQuestions = () => {
    if (!transcript) {
      setError("No transcript available to analyze.");
      return;
    }
    try {
      const questions = transcript
        .split(".")
        .filter((sentence) =>
          questionWords.some((word) => sentence.toLowerCase().startsWith(word))
        );

      if (questions.length === 0) {
        setError("No questions detected in the transcript.");
      } else {
        setError(null); // Clear any previous errors
        onQuestionDetected(questions);
      }
    } catch (err) {
      console.error("Error detecting questions:", err);
      setError("An error occurred while detecting questions.");
    }
  };

  detectQuestions();
}, [transcript]);

  return <div> {error && <p style={{ color: "red" }}> {error} </p>} </div>;
};

export default QuestionAnalyzer;
