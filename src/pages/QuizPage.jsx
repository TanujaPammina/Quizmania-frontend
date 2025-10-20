import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const QuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isReviewing, setIsReviewing] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (timeLeft > 0 && !loading && quiz && score === null) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && score === null) {
      handleTimeout();
    }
  }, [timeLeft, loading, quiz, score]);

  const fetchQuiz = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`https://quizmania-backend.vercel.app/api/quizzes/${quizId}`, {
        headers: { 'x-auth-token': token },
      });
      console.log('Quiz Data:', res.data);
      if (!res.data || !res.data.questions || res.data.questions.length === 0) {
        throw new Error('Invalid or empty quiz data');
      }
      setQuiz(res.data);
    } catch (err) {
      console.error('Quiz fetch error:', err);
      toast.error('Failed to load quiz: ' + err.message);
      setQuiz(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer) => {
    const isCorrect = answer === quiz.questions[currentQuestion].correctAnswer;
    toast.info(isCorrect ? 'Correct!' : 'Wrong!');
    setAnswers([...answers, answer]);

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(30);
    } else {
      calculateScore([...answers, answer]);
    }
  };

  const handleTimeout = () => {
    setAnswers([...answers, null]);
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(30);
    } else {
      calculateScore([...answers, null]);
    }
  };

  const calculateScore = async (finalAnswers) => {
    const calculatedScore = finalAnswers.reduce((acc, ans, i) => 
      ans && ans === quiz.questions[i].correctAnswer ? acc + 1 : acc, 0);
    setScore(calculatedScore);
    toast.success(`Quiz completed! Score: ${calculatedScore}/${quiz.questions.length}`);

    try {
      const token = localStorage.getItem('token');
      await axios.post('https://quizmania-backend.vercel.app/api/scores', {
        quizId,
        score: calculatedScore,
        totalQuestions: quiz.questions.length,
      }, {
        headers: { 'x-auth-token': token },
      });
      toast.success('Score saved!');
    } catch (err) {
      toast.error('Failed to save score');
    }
  };

  if (!user) {
    return (
      <div className="text-center my-5">
        <p>Please log in to take the quiz.</p>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>
          Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center my-5">
        <p>Quiz not found.</p>
        <button className="btn btn-primary" onClick={() => navigate('/quizzes')}>
          Back to Quizzes
        </button>
      </div>
    );
  }

  if (score !== null && isReviewing) {
    return (
      <div className="container my-5">
        <h2 className="text-center mb-4">Review Answers - {quiz.title}</h2>
        {quiz.questions.map((question, qIndex) => (
          <div key={qIndex} className="card shadow-sm mb-3">
            <div className="card-body">
              <h5 className="card-title">
                Question {qIndex + 1}: {question.questionText}
              </h5>
              <div className="d-flex flex-column">
                {question.options.map((option, oIndex) => {
                  const isCorrect = option === question.correctAnswer;
                  const isUserAnswer = answers[qIndex] === option;
                  let className = 'btn mb-2';
                  if (isCorrect) {
                    className += ' btn-success text-white';
                  } else if (isUserAnswer && !isCorrect) {
                    className += ' btn-danger text-white';
                  } else {
                    className += ' btn-outline-secondary';
                  }

                  return (
                    <button
                      key={oIndex}
                      className={className}
                      disabled
                    >
                      {option}
                      {isCorrect && ' (Correct)'}
                      {isUserAnswer && !isCorrect && ' (Your Answer)'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
        <div className="text-center">
          <button
            className="btn btn-primary mt-3"
            onClick={() => setIsReviewing(false)}
          >
            Back to Results
          </button>
        </div>
      </div>
    );
  }

  if (score !== null) {
    return (
      <div className="container my-5 text-center">
        <h2 className="mb-4">Quiz Completed!</h2>
        <p className="display-4">Score: {score}/{quiz.questions.length}</p>
        <button
          className="btn btn-primary mt-3 me-2"
          onClick={() => navigate('/quizzes')}
        >
          Back to Quizzes
        </button>
        <button
          className="btn btn-secondary mt-3 me-2"
          onClick={() => navigate('/profile')}
        >
          View Profile
        </button>
        <button
          className="btn btn-info mt-3"
          onClick={() => setIsReviewing(true)}
        >
          Review Answers
        </button>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">{quiz.title || 'Quiz'}</h2>
      <div className="progress mb-4">
        <div
          className="progress-bar"
          style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
        >
          {currentQuestion + 1}/{quiz.questions.length}
        </div>
      </div>
      <div className="text-center mb-4">
        <p className={`text-${timeLeft <= 10 ? 'danger' : 'primary'}`}>
          Time Left: {timeLeft}s
        </p>
      </div>
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </h5>
          <p className="card-text">{question.questionText || 'No question'}</p>
          <div className="d-flex flex-column">
            {question.options && question.options.length > 0 ? (
              question.options.map((option, index) => (
                <button
                  key={index}
                  className="btn btn-outline-primary mb-2"
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </button>
              ))
            ) : (
              <p>No options available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;