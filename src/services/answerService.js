import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebaseConfig';
import axios from 'axios';

// Function to get suggested answer from Firebase
export const getSuggestedAnswer = async (question) => {
  try {
    const docRef = ref(storage, 'gs://audio-medical-asst.appspot.com/medical_questions_and_answers.txt');
    const url = await getDownloadURL(docRef);

    try {
      // Fetch the file content from Firebase
      const response = await axios.get(url);
      const documentText = response.data;

      // Split the text into lines
      const lines = documentText.split('\n');

      // Find an answer in the document that contains the question
      const answer = lines.find(line => line.toLowerCase().includes(question.toLowerCase())) || "No answer found.";

      return answer;
    } catch (error) {
      console.error("Error reading document:", error);
      return "Error reading the medical document.";
    }
  } catch (firebaseError) {
    console.error("Error fetching document from Firebase:", firebaseError);
    return "Failed to fetch the medical document.";
  }
};