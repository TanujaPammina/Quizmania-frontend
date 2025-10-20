import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const CreateQuiz = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState({
    title: '',
    category: '',
    difficulty: '',
    questions: [
      { questionText: '', options: ['', '', '', ''], correctAnswer: '' },
    ],
  });

  const categories = ['General Knowledge', 'Technology', 'Science', 'History', 'Other'];
  const difficulties = ['easy', 'medium', 'hard'];

  const handleQuizChange = (e) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...quiz.questions];
    if (field === 'questionText' || field === 'correctAnswer') {
      newQuestions[index][field] = value;
    } else {
      newQuestions[index].options[value.index] = value.text;
    }
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        { questionText: '', options: ['', '', '', ''], correctAnswer: '' },
      ],
    });
  };

  const removeQuestion = (index) => {
    if (quiz.questions.length > 1) {
      const newQuestions = quiz.questions.filter((_, i) => i !== index);
      setQuiz({ ...quiz, questions: newQuestions });
    } else {
      toast.error('At least one question required!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/quizzes', quiz, {
        headers: { 'x-auth-token': token },
      });
      toast.success('Quiz created successfully!');
      navigate('/quizzes');
    } catch (err) {
      toast.error(err.response?.data.msg || 'Failed to create quiz');
    }
  };

  if (!user) {
    return (
      <div className="text-center my-5">
        <p>Please log in to create a quiz.</p>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Create a New Quiz</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Quiz Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={quiz.title}
            onChange={handleQuizChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            className="form-select"
            id="category"
            name="category"
            value={quiz.category}
            onChange={handleQuizChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="difficulty" className="form-label">Difficulty</label>
          <select
            className="form-select"
            id="difficulty"
            name="difficulty"
            value={quiz.difficulty}
            onChange={handleQuizChange}
            required
          >
            <option value="">Select Difficulty</option>
            {difficulties.map(diff => (
              <option key={diff} value={diff}>
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <h4 className="mb-3">Questions</h4>
        {quiz.questions.map((question, qIndex) => (
          <div key={qIndex} className="border p-3 mb-3 rounded">
            <div className="mb-3">
              <label className="form-label">Question {qIndex + 1}</label>
              <input
                type="text"
                className="form-control"
                value={question.questionText}
                onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Options</label>
              {question.options.map((option, oIndex) => (
                <input
                  key={oIndex}
                  type="text"
                  className="form-control mb-2"
                  value={option}
                  onChange={(e) => handleQuestionChange(qIndex, 'options', { index: oIndex, text: e.target.value })}
                  required
                />
              ))}
            </div>
            <div className="mb-3">
              <label className="form-label">Correct Answer</label>
              <select
                className="form-select"
                value={question.correctAnswer}
                onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                required
              >
                <option value="">Select Correct Answer</option>
                {question.options.map((option, oIndex) => (
                  <option key={oIndex} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => removeQuestion(qIndex)}
            >
              Remove Question
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-secondary mb-3"
          onClick={addQuestion}
        >
          Add Question
        </button>
        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-primary">Create Quiz</button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuiz;