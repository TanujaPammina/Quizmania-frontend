import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/leaderboard');
      setLeaders(res.data);
    } catch (err) {
      toast.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="container my-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-center mb-4">Leaderboard</h2>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : leaders.length === 0 ? (
        <p className="text-center">No leaders yet. <a href="/quizzes">Take a quiz!</a></p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Quizzes Taken</th>
                <th>Total Score</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((leader, index) => (
                <motion.tr
                  key={leader._id || index}
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <td>
                    {index === 0 ? (
                      <span className="badge bg-warning">🏆 #1</span>
                    ) : index === 1 ? (
                      <span className="badge bg-secondary">🥈 #2</span>
                    ) : index === 2 ? (
                      <span className="badge bg-bronze">🥉 #3</span>
                    ) : (
                      index + 1
                    )}
                  </td>
                  <td>{leader.name}</td>
                  <td>{leader.totalQuizzes}</td>
                  <td>{leader.totalScore}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default Leaderboard;