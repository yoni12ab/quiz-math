import { useState } from 'react';
import { MinusCircle, PlusCircle } from 'lucide-react';
import { Button } from '@chakra-ui/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
const Setup = ({ onStart }) => {
  const [questionCount, setQuestionCount] = useState(5);
  const minQuestions = 3;
  const maxQuestions = 15;

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="text-base text-right w-full">כמה שאלות תרצי לתרגל?</div>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() =>
            setQuestionCount(Math.max(questionCount - 1, minQuestions))
          }
          disabled={questionCount <= minQuestions}
        >
          <MinusCircle className="w-5 h-5" />
        </Button>
        <span className="text-xl font-bold w-16 text-center">
          {questionCount}
        </span>
        <Button
          variant="outline"
          onClick={() =>
            setQuestionCount(Math.min(questionCount + 1, maxQuestions))
          }
          disabled={questionCount >= maxQuestions}
        >
          <PlusCircle className="w-5 h-5" />
        </Button>
      </div>
      <div className="text-sm text-gray-500">מינימום {minQuestions} שאלות</div>
      <Button
        onClick={() => onStart(questionCount)}
        className="text-base p-4 mt-2"
      >
        בואי נתחיל!
      </Button>
    </div>
  );
};

const Question = ({ question, type }) => {
  if (type === 'הצבה') {
    const [given, solve] = question.split('\n');
    return (
      <div className="flex flex-col items-end w-full gap-3">
        <div className="text-base text-right w-full">הצבה</div>
        <div className="text-base text-right w-full mb-1">נתון:</div>
        <div className="text-xl bg-gray-50 p-3 rounded-lg w-full text-center">
          <span dir="ltr" className="inline-block font-mono">
            {given}
          </span>
        </div>
        <div className="text-base text-right w-full mt-3 mb-1">פתור:</div>
        <div className="text-xl bg-gray-50 p-3 rounded-lg w-full text-center">
          <span dir="ltr" className="inline-block font-mono">
            {solve}
          </span>
        </div>
      </div>
    );
  }

  if (type === 'כינוס איברים דומים') {
    return (
      <div className="flex flex-col items-end w-full gap-3">
        <div className="text-base text-right w-full">כינוס איברים דומים</div>
        <div className="text-base text-right w-full mb-1">פתור:</div>
        <div className="text-xl bg-gray-50 p-3 rounded-lg w-full text-center">
          <span dir="ltr" className="inline-block font-mono">
            {question}
          </span>
        </div>
      </div>
    );
  }

  if (type === 'חישובי ריבוע') {
    const [measurement, task] = question.split('\n');
    return (
      <div className="flex flex-col items-end w-full gap-3">
        <div className="text-base text-right w-full">חישובי ריבוע</div>
        <div className="text-base text-right w-full mb-1">נתון:</div>
        <div className="text-xl bg-gray-50 p-3 rounded-lg w-full text-center">
          <span dir="ltr" className="inline-block font-mono">
            {measurement}
          </span>
        </div>
        <div className="text-base text-right w-full mt-2">{task}</div>
      </div>
    );
  }

  return null;
};

const MathQuizGame = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  const generateProblem = () => {
    const types = ['הצבה', 'כינוס איברים דומים', 'חישובי ריבוע'];
    const type = types[Math.floor(Math.random() * types.length)];
    let question, answer, options;

    switch (type) {
      case 'הצבה':
        const variable = ['x', 'y'][Math.floor(Math.random() * 2)];
        const value = Math.floor(Math.random() * 10) - 5;
        const coefficient = Math.floor(Math.random() * 5) + 1;
        question = `${variable} = ${value}\n${coefficient}${variable}`;
        answer = coefficient * value;
        options = [answer, answer + 1, answer - 1, answer * 2];
        break;

      case 'כינוס איברים דומים':
        const term1 = Math.floor(Math.random() * 10) - 5;
        const term2 = Math.floor(Math.random() * 10) - 5;
        question = `${term1}x + ${term2}x`;
        answer = term1 + term2;
        options = [
          answer + 'x',
          answer + 1 + 'x',
          answer - 1 + 'x',
          answer * 2 + 'x',
        ];
        break;

      case 'חישובי ריבוע':
        const side = Math.floor(Math.random() * 10) + 1;
        question = `צלע = ${side}\nחשב את שטח הריבוע`;
        answer = side * side;
        options = [answer, side * 4, answer + side, answer - side];
        break;
    }

    return {
      type,
      question,
      answer,
      options: options.sort(() => Math.random() - 0.5),
    };
  };

  const initializeGame = (count) => {
    // וודא שיש לפחות שאלה אחת מכל סוג
    const types = ['הצבה', 'כינוס איברים דומים', 'חישובי ריבוע'];
    let newQuestions = types.map((type) => {
      let problem = generateProblem();
      while (problem.type !== type) {
        problem = generateProblem();
      }
      return problem;
    });

    // הוסף שאלות רנדומליות להשלמת המספר הנדרש
    for (let i = types.length; i < count; i++) {
      newQuestions.push(generateProblem());
    }

    // ערבב את השאלות
    newQuestions = newQuestions.sort(() => Math.random() - 0.5);

    setQuestions(newQuestions);
    setCurrentIndex(0);
    setSelectedAnswers([]);
    setGameStarted(true);
    setShowResults(false);
  };

  const handleAnswer = (answer) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentIndex] = answer;

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswers(newAnswers);
    } else {
      setShowResults(true);
      setSelectedAnswers(newAnswers);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (
        selectedAnswers[index] === question.answer ||
        selectedAnswers[index] === question.answer + 'x'
      ) {
        correct++;
      }
    });
    return Math.floor((correct / questions.length) * 100);
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div dir="rtl">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-right text-xl">
            תרגול למבחן מתמטיקה
          </CardTitle>
          {gameStarted && !showResults && (
            <div className="text-right text-base">
              שאלה {currentIndex + 1} מתוך {questions.length}
            </div>
          )}
        </CardHeader>
        <CardContent className="flex flex-col items-start w-full gap-4">
          {!gameStarted ? (
            <Setup onStart={initializeGame} />
          ) : showResults ? (
            <div className="w-full">
              <h2 className="text-xl mb-4 text-right">
                התוצאה שלך:{' '}
                <span dir="ltr" className="inline-block">
                  {calculateScore()}%
                </span>
              </h2>
              <div className="grid grid-cols-1 gap-4 mb-6">
                {questions.map((q, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      selectedAnswers[index] === q.answer ||
                      selectedAnswers[index] === q.answer + 'x'
                        ? 'bg-green-100'
                        : 'bg-red-100'
                    }`}
                  >
                    <Question question={q.question} type={q.type} />
                    <div className="mt-3">
                      <div className="text-right mb-1 text-base">
                        התשובה שלך:
                      </div>
                      <div className="text-lg bg-white p-2 rounded-lg text-center">
                        <span dir="ltr" className="inline-block font-mono">
                          {selectedAnswers[index]}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-right mb-1 text-base">
                        התשובה הנכונה:
                      </div>
                      <div className="text-lg bg-white p-2 rounded-lg text-center">
                        <span dir="ltr" className="inline-block font-mono">
                          {q.answer}
                          {q.type === 'כינוס איברים דומים' ? 'x' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-right">
                <Button
                  onClick={() => initializeGame(questions.length)}
                  className="text-base"
                >
                  התחל מחדש
                </Button>
              </div>
            </div>
          ) : currentQuestion ? (
            <div className="w-full">
              <Question
                question={currentQuestion.question}
                type={currentQuestion.type}
              />
              <div className="grid grid-cols-2 gap-4 w-full mt-6">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="text-lg py-3 px-4 text-center bg-white border border-gray-200 hover:bg-gray-50"
                    variant="outline"
                  >
                    <span
                      dir="ltr"
                      className="inline-block font-mono text-gray-700"
                    >
                      {option}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default MathQuizGame;
