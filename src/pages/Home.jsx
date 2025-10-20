import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import quizImage from '../assets/quiz-card.png';
import quizImage1 from '../assets/quiz-card1.png'; // Add images later
import trophyImage from '../assets/trophy.png';
import profileImage from '../assets/profile-stats.png';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/quizzes');
    } else {
      navigate('/login');
    }
  };

  const highlights = [
    {
      title: '🧠 Create Your Own Quizzes',
      description: 'Design fun and challenging quizzes to share with the world.',
      image: quizImage1,
    },
    {
      title: '🏆 Compete on Leaderboards',
      description: 'Rise to the top and become the ultimate Quiz Master!',
      image: trophyImage,
    },
    {
      title: '📊 Track Your Progress',
      description: 'Monitor your scores and improve with every quiz.',
      image: profileImage,
    },
    {
      title: '⏳ Timed Challenges',
      description: 'Test your knowledge against the clock for extra thrills!',
      image: quizImage,
    },
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <motion.section
        className="text-center my-5"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="display-4 mb-3">QuizMania: Unleash Your Brain Power!</h1>
        <p className="lead mb-4">
          Create, take, and master quizzes. Compete globally, track your progress, and become a Quiz Master!
        </p>
        <button
          className="btn btn-primary btn-lg"
          onClick={handleGetStarted}
        >
          Start Quizzing Now
        </button>
      </motion.section>

      {/* Highlights Section */}
      <section className="container my-5">
        <h2 className="text-center mb-4">Why QuizMania?</h2>
        <div className="row">
          {highlights.map((highlight, index) => (
            <motion.div
              key={index}
              className="col-md-3 mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="card shadow-sm h-100 text-center">
                <img
                  src={highlight.image}
                  alt={highlight.title}
                  className="card-img-top img-fluid"
                  style={{ height: '150px', objectFit: 'contain', padding: '1rem' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{highlight.title}</h5>
                  <p className="card-text">{highlight.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <motion.section
        className="text-center my-5 bg-primary text-white py-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h3>Join the Quiz Revolution!</h3>
        <p>Over 100+ quiz takers are already competing. Are you ready?</p>
        <button
          className="btn btn-light btn-lg"
          onClick={handleGetStarted}
        >
          {user ? 'Explore Quizzes' : 'Sign Up Now'}
        </button>
      </motion.section>
    </div>
  );
};

export default Home;