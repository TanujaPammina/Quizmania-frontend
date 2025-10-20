import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchScores();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchScores = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const res = await axios.get('https://quizmania-backend.vercel.app/api/scores', {
        headers: { 'x-auth-token': token },
      });
      setScores(res.data);
    } catch (err) {
      console.error('Score fetch error:', err.response?.data || err.message);
      toast.error('Failed to load scores. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center my-5">
        <p>Please log in to view your profile.</p>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>
          Login
        </button>
      </div>
    );
  }

  const totalQuizzes = scores.length;
  const avgScore = totalQuizzes
    ? (scores.reduce((sum, s) => sum + (s.score / s.totalQuestions) * 100, 0) / totalQuizzes).toFixed(1)
    : 0;

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Your Profile</h2>
      <div className="card mb-4 shadow-sm">
        <div className="card-body text-center">
          <h4>{user.name}</h4>
          <p className="text-muted">{user.email}</p>
          <div className="d-flex justify-content-center gap-4">
            <div>
              <strong>Total Quizzes:</strong> {totalQuizzes}
            </div>
            <div>
              <strong>Avg Score:</strong> {avgScore}%
            </div>
          </div>
          {totalQuizzes >= 5 && (
            <span className="badge bg-success mt-2">Quiz Master</span>
          )}
        </div>
      </div>
      <h4 className="mb-3">Quiz History</h4>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : scores.length === 0 ? (
        <p className="text-center">No quizzes taken yet. <a href="/quizzes">Take one now!</a></p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Quiz</th>
                <th>Score</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {scores.map(s => (
                <tr key={s._id}>
                  <td>{s.quiz?.title || 'Unknown'}</td>
                  <td>{s.score}/{s.totalQuestions}</td>
                  <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Profile;