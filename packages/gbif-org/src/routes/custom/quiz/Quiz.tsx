import { useState } from 'react';
import { quizData, QuizLevel, QuizCategory, QuizQuestion } from './quizData';

export function Quiz() {
  const [selectedLevel, setSelectedLevel] = useState<QuizLevel | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizComplete, setQuizComplete] = useState(false);

  const resetQuiz = () => {
    setSelectedLevel(null);
    setSelectedCategory(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowExplanation(false);
    setSelectedAnswer(null);
    setQuizComplete(false);
  };

  const selectLevel = (level: QuizLevel) => {
    setSelectedLevel(level);
  };

  const selectCategory = (category: QuizCategory) => {
    setSelectedCategory(category);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowExplanation(false);
    setSelectedAnswer(null);
    setQuizComplete(false);
  };

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null || !selectedCategory) return; // Already answered or no category

    const currentQuestion = selectedCategory.questions[currentQuestionIndex];
    setSelectedAnswer(answerIndex);
    
    if (answerIndex === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
    
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (!selectedCategory) return;
    
    if (currentQuestionIndex < selectedCategory.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  const backToCategories = () => {
    setSelectedCategory(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowExplanation(false);
    setSelectedAnswer(null);
    setQuizComplete(false);
  };

  // Level Selection Screen
  if (!selectedLevel) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4 text-green-800">
            🌏 Asian Wildlife Quiz Adventure! 🦁
          </h1>
          <p className="text-center text-lg mb-8 text-gray-700">
            Learn about amazing animals, plants, and nature in Asia!
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {quizData.map((level) => (
              <div
                key={level.id}
                onClick={() => selectLevel(level)}
                className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                <div className="text-center">
                  <div className="text-3xl mb-3">
                    {level.difficulty === 'easy' && '🌱'}
                    {level.difficulty === 'medium' && '🌳'}
                    {level.difficulty === 'hard' && '🌟'}
                  </div>
                  <h2 className="text-2xl font-bold mb-2 text-gray-800">
                    {level.name}
                  </h2>
                  <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-3">
                    {level.difficulty.toUpperCase()}
                  </div>
                  <p className="text-gray-600">
                    {level.description}
                  </p>
                  <div className="mt-4 text-sm text-gray-500">
                    8 categories • 5 questions each
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Category Selection Screen
  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-8">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={resetQuiz}
            className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            ← Back to Levels
          </button>
          
          <h1 className="text-3xl font-bold text-center mb-3 text-green-800">
            {selectedLevel.name} Level
          </h1>
          <p className="text-center text-lg mb-8 text-gray-700">
            Choose a category to start learning!
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {selectedLevel.categories.map((category) => (
              <div
                key={category.id}
                onClick={() => selectCategory(category)}
                className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">
                    {category.id === 'animals' && '🐘'}
                    {category.id === 'plants' && '🌺'}
                    {category.id === 'birds' && '🦜'}
                    {category.id === 'insects' && '🦋'}
                    {category.id === 'marine' && '🐠'}
                    {category.id === 'habitats' && '🏞️'}
                    {category.id === 'conservation' && '💚'}
                    {category.id === 'funfacts' && '✨'}
                  </div>
                  <h3 className="font-bold text-lg text-gray-800">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    {category.questions.length} questions
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Quiz Complete Screen
  if (quizComplete) {
    const percentage = Math.round((score / selectedCategory.questions.length) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-8 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">
            {percentage >= 80 ? '🏆' : percentage >= 60 ? '🌟' : '👍'}
          </div>
          <h2 className="text-3xl font-bold mb-4 text-green-800">
            Quiz Complete!
          </h2>
          <p className="text-2xl mb-6">
            You scored <span className="font-bold text-blue-600">{score}</span> out of{' '}
            <span className="font-bold">{selectedCategory.questions.length}</span>
          </p>
          <div className="mb-6">
            <div className="text-lg font-semibold mb-2">
              {percentage}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-green-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
          <p className="text-gray-700 mb-6">
            {percentage >= 80 && "Amazing! You're a nature expert! 🎉"}
            {percentage >= 60 && percentage < 80 && "Great job! Keep learning! 😊"}
            {percentage < 60 && "Good try! Practice makes perfect! 💪"}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                setCurrentQuestionIndex(0);
                setScore(0);
                setShowExplanation(false);
                setSelectedAnswer(null);
                setQuizComplete(false);
              }}
              className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
            >
              Try Again
            </button>
            <button
              onClick={backToCategories}
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            >
              Choose Another Category
            </button>
            <button
              onClick={resetQuiz}
              className="w-full px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to Levels
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Question Screen
  const currentQuestion = selectedCategory.questions[currentQuestionIndex];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={backToCategories}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            ← Back to Categories
          </button>
          <div className="text-sm text-gray-600">
            Score: <span className="font-bold text-blue-600">{score}</span> / {currentQuestionIndex + (selectedAnswer !== null ? 1 : 0)}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-500">
                {selectedCategory.name}
              </span>
              <span className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {selectedCategory.questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestionIndex + 1) / selectedCategory.questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => {
              const isCorrect = index === currentQuestion.correctAnswer;
              const isSelected = index === selectedAnswer;
              
              let buttonClass = 'w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ';
              
              if (selectedAnswer === null) {
                buttonClass += 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer';
              } else if (isSelected && isCorrect) {
                buttonClass += 'border-green-500 bg-green-100';
              } else if (isSelected && !isCorrect) {
                buttonClass += 'border-red-500 bg-red-100';
              } else if (isCorrect) {
                buttonClass += 'border-green-500 bg-green-50';
              } else {
                buttonClass += 'border-gray-300 bg-gray-50';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={buttonClass}
                >
                  <div className="flex items-center">
                    <span className="font-semibold mr-3">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span className="flex-1">{option}</span>
                    {selectedAnswer !== null && isCorrect && (
                      <span className="text-2xl">✓</span>
                    )}
                    {selectedAnswer !== null && isSelected && !isCorrect && (
                      <span className="text-2xl">✗</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {showExplanation && currentQuestion.explanation && (
            <div className={`p-4 rounded-lg mb-6 ${
              selectedAnswer === currentQuestion.correctAnswer
                ? 'bg-green-50 border-2 border-green-200'
                : 'bg-blue-50 border-2 border-blue-200'
            }`}>
              <p className="font-semibold mb-2">
                {selectedAnswer === currentQuestion.correctAnswer ? '🎉 Correct!' : '📚 Learn:'}
              </p>
              <p className="text-gray-700">{currentQuestion.explanation}</p>
            </div>
          )}

          {showExplanation && (
            <button
              onClick={nextQuestion}
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            >
              {currentQuestionIndex < selectedCategory.questions.length - 1
                ? 'Next Question →'
                : 'See Results'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
