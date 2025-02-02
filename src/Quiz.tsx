import React, { useState } from 'react';
import { isMobile } from 'react-device-detect';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface AnswerState {
  selectedAnswer: number | null;
  isCorrect: boolean | null;
}

const Quiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [answerState, setAnswerState] = useState<AnswerState>({
    selectedAnswer: null,
    isCorrect: null,
  });

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
    },
    {
      id: 3,
      text: 'What is a deductible in insurance?',
      options: [
        'A monthly payment to maintain coverage',
        'The amount you pay before insurance coverage begins',
        'A discount for safe driving',
        'The maximum amount insurance will pay'
      ],
      correctAnswer: 1
    }
  ];

  const handleAnswerClick = (selectedAnswer: number) => {
    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    
    setAnswerState({
      selectedAnswer,
      isCorrect,
    });

    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        setAnswerState({ selectedAnswer: null, isCorrect: null });
      } else {
        setShowScore(true);
      }
    }, 2000);
  };

  const getButtonStyles = (index: number) => {
    const baseStyles = "w-full text-left p-4 rounded-lg transition-colors duration-200 text-black";
    
    if (answerState.selectedAnswer === null) {
      return `${baseStyles} bg-[#ffcb05] hover:bg-[#ffd739]`;
    }
    
    // If this is the selected answer
    if (answerState.selectedAnswer === index) {
      return `${baseStyles} ${answerState.isCorrect ? 'bg-[#22c55e] text-white' : 'bg-[#ef4444] text-white'}`;
    }
    
    // Show correct answer in green if wrong answer was selected
    if (index === questions[currentQuestion].correctAnswer && !answerState.isCorrect && answerState.selectedAnswer !== null) {
      return `${baseStyles} bg-[#22c55e] text-white`;
    }
    
    // Keep other buttons gold but disabled
    return `${baseStyles} bg-[#ffcb05] opacity-50`;
  };

  if(isMobile){
    return(
      <div className="min-h-screen w-full flex justify-center p-4">
      <div className="">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-black">Insurance Knowledge Quiz</h1>
        </div>
        <div>
          {showScore ? (
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4 text-black">
                You scored {score} out of {questions.length}!
              </h2>
              <button
                onClick={() => {
                  setCurrentQuestion(0);
                  setScore(0);
                  setShowScore(false);
                  setAnswerState({ selectedAnswer: null, isCorrect: null });
                }}
                className="bg-[#144953] text-white px-6 py-2 rounded-lg hover:bg-[#1a5d69]"
              >
                Retry Quiz
              </button>
            </div>
          ) : (
            <div>
              <p className="text-lg mb-6 text-black">{questions[currentQuestion].text}</p>
              <div className="space-y-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerClick(index)}
                    disabled={answerState.selectedAnswer !== null}
                    className={getButtonStyles(index)}
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
    </div>
</div>
    );
  }

  return (
    <div className="min-h-screen w-full flex justify-center p-4">
      <div className="mt-20">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-black">Insurance Knowledge Quiz</h1>
        </div>
        <div>
          {showScore ? (
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4 text-black">
                You scored {score} out of {questions.length}!
              </h2>
              <button
                onClick={() => {
                  setCurrentQuestion(0);
                  setScore(0);
                  setShowScore(false);
                  setAnswerState({ selectedAnswer: null, isCorrect: null });
                }}
                className="bg-[#144953] text-white px-6 py-2 rounded-lg hover:bg-[#1a5d69]"
              >
                Retry Quiz
              </button>
            </div>
          ) : (
            <div>
              <p className="text-lg mb-6 text-black">{questions[currentQuestion].text}</p>
              <div className="space-y-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerClick(index)}
                    disabled={answerState.selectedAnswer !== null}
                    className={getButtonStyles(index)}
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
    </div>
</div>
  );
};

export default Quiz;