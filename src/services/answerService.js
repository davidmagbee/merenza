import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebaseConfig';
import axios from 'axios';

export const getSuggestedAnswer = async (question) => {
  if (!question) {
    console.warn('No question provided to getSuggestedAnswer');
    return "No question provided";
  }

  try {
    // Verify storage is initialized
    if (!storage || !storage.app) {
      throw new Error('Storage not properly initialized');
    }

    const docRef = ref(storage, 'medical_Q_and_A.txt');
    console.log('Attempting to access:', docRef.fullPath);

    const url = await getDownloadURL(docRef);
    const response = await axios.get(url);
    const documentText = response.data;

    if (!documentText) {
      console.warn('Empty document received');
      return "No answer found - empty document";
    }

    const lines = documentText.split('\n');
    console.log(`Processing ${lines.length} lines for question: ${question}`);

    const cleanedQuestion = question.toLowerCase().trim();

    // Try to find a question line that includes a close match to the question
    const relevantLineIndex = lines.findIndex(line => 
      line.toLowerCase().includes(cleanedQuestion)
    );

    // If we find a relevant line, return the corresponding answer
    if (relevantLineIndex !== -1) {
      const potentialAnswerLine = lines[relevantLineIndex + 1]; // Answer should be on the next line
      if (potentialAnswerLine && potentialAnswerLine.toLowerCase().includes("answer:")) {
        const answer = potentialAnswerLine.split(':')[1].trim();
        return answer || "No matching answer found";
      }
    }

    return "No matching answer found";
  } catch (error) {
    console.error('Error in getSuggestedAnswer:', error);
    
    // More specific error messages based on error type
    if (error.code === 'storage/object-not-found') {
      return "Answer document not found in storage";
    }
    if (error.code === 'storage/unauthorized') {
      return "Unable to access answer document - unauthorized";
    }
    
    throw new Error(`Failed to process answer: ${error.message}`);
  }
};
