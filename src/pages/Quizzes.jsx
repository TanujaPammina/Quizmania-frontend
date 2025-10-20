import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Quizzes = () => {
  const { user } = useContext(AuthContext);
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const debouncedSearch = debounce(value => setSearch(value), 300);

  useEffect(() => {
    fetchQuizzes();
  }, [search, category, difficulty]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/quizzes', {
        params: { search, category, difficulty },
      });
      setQuizzes(res.data);
    } catch (err) {
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['General Knowledge', 'Technology', 'Science', 'History', 'Other'];
  const difficulties = ['easy', 'medium', 'hard'];

  if (!user) {
    return (
      <div className="text-center my-5">
        <p>Please log in to view quizzes.</p>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Explore Quizzes</h2>
      <span className="badge bg-primary mb-3">{quizzes.length} Quizzes</span>
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search quizzes..."
            onChange={e => debouncedSearch(e.target.value)}
            disabled={!user}
          />
        </div>
        <div className="col-md-4 mb-3">
          <select
            className="form-select"
            value={category}
            onChange={e => setCategory(e.target.value)}
            disabled={!user}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4 mb-3">
          <select
            className="form-select"
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
            disabled={!user}
          >
            <option value="">All Difficulties</option>
            {difficulties.map(diff => (
              <option key={diff} value={diff}>
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : quizzes.length === 0 ? (
        <p className="text-center">No quizzes found.</p>
      ) : (
        <div className="row">
          {quizzes.map(quiz => (
            <motion.div
              key={quiz._id}
              className="col-md-4 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{quiz.title || 'No Title'}</h5>
                  <p className="card-text">
                    <span
                      className={`badge bg-${
                        quiz.category === 'General Knowledge'
                          ? 'primary'
                          : quiz.category === 'Technology'
                          ? 'success'
                          : quiz.category === 'Science'
                          ? 'info'
                          : 'warning'
                      } mb-2`}
                    >
                      {quiz.category || 'Unknown'}
                    </span>
                    <br />
                    <strong>Difficulty:</strong>{' '}
                    <span
                      className={`badge bg-${
                        quiz.difficulty === 'easy'
                          ? 'success'
                          : quiz.difficulty === 'medium'
                          ? 'warning'
                          : 'danger'
                      }`}
                    >
                      {(quiz.difficulty || 'unknown').charAt(0).toUpperCase() +
                        (quiz.difficulty || 'unknown').slice(1)}
                    </span>
                    <br />
                    <strong>Created By:</strong> {quiz.createdBy?.name || 'Unknown'}
                  </p>
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => navigate(`/quiz/${quiz._id}`)}
                  >
                    Start Quiz
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Quizzes;