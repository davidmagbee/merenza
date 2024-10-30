import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebaseConfig';
import axios from 'axios';

export const getSuggestedAnswer = async (question) => {
  try {
    const docRef = ref(storage, 'complete_medical_questions_and_answers.txt');
    const url = await getDownloadURL(docRef);

    const response = await axios.get(url);
    const documentText = response.data;
    const lines = documentText.split('\n');

    // Improved answer matching logic
    const relevantLines = lines.filter(line => {
      const questionWords = question.toLowerCase().split(' ');
      return questionWords.every(word => 
        line.toLowerCase().includes(word) && line.includes(':')
      );
    });

    if (relevantLines.length > 0) {
      // Extract answer part (after colon)
      const answer = relevantLines[0].split(':')[1].trim();
      return answer;
    }

    return "No answer found.";
  } catch (error) {
    console.error("Error in getSuggestedAnswer:", error);
    throw new Error("Failed to fetch or process the answer");
  }
};