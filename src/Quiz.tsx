// Quiz.tsx
import React, { useState } from 'react';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

const Quiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      text: 'What is the main purpose of liability insurance?',
      options: [
        'To protect against property damage',
        'To cover medical expenses',
        'To protect against claims from others',
        'To replace lost income'
      ],
      correctAnswer: 2
    },
    {
      id: 2,
      text: 'Which factor typically does NOT affect your insurance premium?',
      options: [
        'Your age',
        'Your favorite color',
        'Your location',
        'Your claims history'
      ],
      correctAnswer: 1
    }
  ];

  const handleAnswerClick = (selectedAnswer: number) => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Insurance Knowledge Quiz</h1>
      </div>
      <div>
        {showScore ? (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">
              You scored {score} out of {questions.length}!
            </h2>
            <button
              onClick={() => {
                setCurrentQuestion(0);
                setScore(0);
                setShowScore(false);
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Retry Quiz
            </button>
          </div>
        ) : (
          <div>
            <p className="text-lg mb-6">{questions[currentQuestion].text}</p>
            <div className="space-y-4">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  className="w-full text-left p-4 border rounded-lg hover:bg-gray-50"
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="mt-4 text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;