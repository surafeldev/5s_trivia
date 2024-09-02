"use client";
import React, { useState, useEffect } from "react";
import { getQuestions, CategoryResolvable } from "open-trivia-db";
import Reward from "./Reward";

interface Question {
  question: string;
  allAnswers: string[];
  correctAnswer: string;
}

const DAILY_QUESTION_KEY = "daily_question";
const PARTICIPATION_KEY = "participation";

const getCurrentDate = () => {
  const date = new Date();
  return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
};

const Questions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(50);
  const [isTimeout, setIsTimeout] = useState(false);
  const [hasParticipated, setHasParticipated] = useState(false);

  const categories: CategoryResolvable[] = [
    "General Knowledge",
    "Animals",
    "Vehicles",
    "History",
    "Politics",
  ];

  // function to get a random value from an array
  const getRandomValueFromArray = (
    array: (string | number)[]
  ): string | number => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  };

  async function fetchQuestionsWithRetry(
    options: any,
    retries : number ,
    delay: number 
  ) {
    try {
      return await getQuestions(options);
    } catch (error: any) {
      if (retries > 0 && error.status === 429) {
        console.error(`Retrying... attempts left: ${retries}`);
        await new Promise((res) => setTimeout(res, delay));
        return fetchQuestionsWithRetry(options, retries - 1, delay * 2);
      } else {
        throw new Error("Failed to fetch questions after multiple retries.");
      }
    }
  }

  useEffect(() => {
    // Check participation status on component mount
    const participationData = localStorage.getItem(PARTICIPATION_KEY);
    if (participationData) {
      const { date, correct } = JSON.parse(participationData);
      if (date === getCurrentDate() && correct) {
        setHasParticipated(true);
      }
    }
  }, []);

  // In your useEffect:
  useEffect(() => {
    const value = getRandomValueFromArray(categories) as CategoryResolvable;
    const storedDataString = localStorage.getItem(PARTICIPATION_KEY);
    const storedData = storedDataString ? JSON.parse(storedDataString) : null;
    const today = getCurrentDate();

    if (storedData && storedData.date === today && storedData.correct) {
      setHasParticipated(true);
    } else {
      const fetchQuestions = async () => {
        try {
          const result = await fetchQuestionsWithRetry({
            amount: 5,
            category: value,
            difficulty: "easy",
          },5, 1000);
          const formattedQuestions: Question[] = result.map((q: any) => ({
            question: q.value,
            allAnswers: [...q.allAnswers],
            correctAnswer: q.correctAnswer,
          }));

          setQuestions(formattedQuestions);
          localStorage.setItem(DAILY_QUESTION_KEY, JSON.stringify(formattedQuestions));
        } catch (error: any) {
          console.error(error.message);
          alert(
            "Sorry, we're having trouble loading the trivia questions. Please try again later."
          );
        }
      };

      fetchQuestions();
    }
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      setIsTimeout(true);
      setShowResult(true);
    }
  }, [timeLeft, showResult]);

  const handleAnswerClick = (answer: string) => {
    console.log(answer);
    if (
      answer === questions[currentQuestionIndex].correctAnswer.toLowerCase()
    ) {
      setScore(score + 1);
      console.log(score);
      localStorage.setItem(
        PARTICIPATION_KEY,
        JSON.stringify({ date: getCurrentDate(), correct: true })
      );
      setHasParticipated(true);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setTimeLeft(50);
    setIsTimeout(false);
  };

  if (questions.length === 0 && !hasParticipated) {
    return <div className="text-center">Loading...</div>;
  }

  if (hasParticipated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-t from-gray-400 to-gray-200 p-6  shadow-lg">
        <div className="text-center text-white p-4 bg-teal-600 rounded-full shadow-lg mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <div className="text-2xl font-bold text-white mb-2">
          You've already participated today!
        </div>
        <p className="text-lg text-white">
          Come back tomorrow to answer a new Trivia and earn more rewards.
        </p>
        <div className="mt-4">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white text-teal-600 font-semibold rounded-lg shadow-md hover:bg-teal-100 transition duration-300"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }
  

  return (
    <div>
      {!hasParticipated && (
        <main className="flex flex-col justify-center items-center text-black flex-grow p-2">
        {!showResult ? (
          <>
            <div className="text-xl mb-4">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <div className="text-2xl font-semibold mb-6 text-center">
              {questions[currentQuestionIndex].question}
            </div>
            <div className="grid grid-cols-1 gap-4 w-full max-w-md">
              {questions[currentQuestionIndex].allAnswers.map(
                (answer, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerClick(answer.toLowerCase())}
                    className="p-4 bg-white rounded-lg shadow-md hover:bg-teal-100"
                  >
                    {answer}
                  </button>
                )
              )}
            </div>
            <div className="mt-6 text-teal-500 font-semibold">
              Time Left: {timeLeft}s
            </div>
          </>
        ) : (
          <div className="text-center">
            {isTimeout ? (
              <div>
                <div className="flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-12 text-yellow-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 0 0-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634Zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 0 1-.189-.866c0-.298.059-.605.189-.866Zm-4.34 7.964a.75.75 0 0 1-1.061-1.06 5.236 5.236 0 0 1 3.73-1.538 5.236 5.236 0 0 1 3.695 1.538.75.75 0 1 1-1.061 1.06 3.736 3.736 0 0 0-2.639-1.098 3.736 3.736 0 0 0-2.664 1.098Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <div className="text-2xl font-semibold mb-4 text-red-600">
                  Timeout!
                </div>
              </div>
            ) : (
              <div className="text-2xl font-semibold mb-4">Quiz Completed!</div>
            )}
            <div className="text-xl mb-6">
              You got {score} out of {questions.length} correct!
            </div>
            {score === questions.length ? (
              <div>
                <div className="flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-12 text-teal-600"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 0 0-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634Zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 0 1-.189-.866c0-.298.059-.605.189-.866Zm2.023 6.828a.75.75 0 1 0-1.06-1.06 3.75 3.75 0 0 1-5.304 0 .75.75 0 0 0-1.06 1.06 5.25 5.25 0 0 0 7.424 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <div className="text-xl text-teal-600 font-bold">
                  Congratulations! You answered all questions correctly!
                </div>
                <Reward />
              </div>
            ) : (
              <div>
                <div className="text-xl text-red-600 font-bold">
                  {isTimeout ? "You ran out of time!" : "Keep trying!"} You
                  answered {score} correctly.
                </div>
                <button
                  onClick={resetQuiz}
                  className="px-4 py-2 bg-teal-500 text-white rounded mt-4"
                >
                  Play Again
                </button>
              </div>
            )}
          </div>
        )}
      </main>
        
      )}
      
    </div>
  );
};

export default Questions;
