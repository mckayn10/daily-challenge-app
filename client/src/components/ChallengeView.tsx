import React, { useState } from 'react';
import { useChallenge } from '../contexts/ChallengeContext';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import './ChallengeView.css';

const ChallengeView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submission, setSubmission] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string>('');
  const [submitError, setSubmitError] = useState<string>('');
  
  const { todayChallenge: challenge, loading } = useChallenge();
  const { token } = useAuth();

  if (loading) {
    return <div className="loading">Loading today's challenge...</div>;
  }

  if (!challenge) {
    return <div className="loading">No challenge available today.</div>;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if photo is required for this challenge type
    const isPhotoRequired = challenge?.category === 'photo' || 
                           (challenge?.category === 'fitness' && challenge?.requirements?.some(req => req.toLowerCase().includes('photo')));
    
    if (isPhotoRequired && !selectedFile) {
      setSubmitError('Photo is required for this challenge');
      return;
    }
    
    if (!challenge) return;

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitMessage('');
    
    try {
      const response = await fetch(`${API_ENDPOINTS.submissions}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          challengeId: challenge._id,
          description: submission
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage(`🎉 ${data.message} You earned ${data.points} points!`);
        setSelectedFile(null);
        setSubmission('');
        
        // Show new stats to user
        if (data.newStats) {
          setTimeout(() => {
            setSubmitMessage(prev => 
              `${prev}\n\nUpdated Stats:\n` +
              `Points: ${data.newStats.totalPoints}\n` +
              `Streak: ${data.newStats.currentStreak}\n` +
              `Level: ${data.newStats.level}`
            );
          }, 1000);
        }
      } else {
        setSubmitError(data.message || 'Failed to submit challenge');
      }
    } catch (error) {
      console.error('Error submitting challenge:', error);
      setSubmitError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="challenge-view">
      <div className="challenge-header">
        <h2>{challenge.title}</h2>
        <div className="challenge-meta">
          <span className={`difficulty ${challenge.difficulty}`}>
            {challenge.difficulty}
          </span>
          <span className="category">#{challenge.category}</span>
          <span className="points">{challenge.points} points</span>
        </div>
      </div>

      <div className="challenge-content">
        <div className="challenge-description">
          <h3>Challenge Description</h3>
          <p>{challenge.description}</p>
        </div>

        <div className="challenge-requirements">
          <h3>Requirements</h3>
          <ul>
            {challenge.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>

        <div className="submission-form">
          <h3>Submit Your Challenge</h3>
          <form onSubmit={handleSubmit}>
            {/* Show photo upload only for photo challenges or fitness challenges that mention photos */}
            {(challenge.category === 'photo' || 
              (challenge.category === 'fitness' && challenge.requirements?.some(req => req.toLowerCase().includes('photo')))) && (
              <div className="file-upload">
                <label htmlFor="file-input" className="file-upload-label">
                  {selectedFile ? selectedFile.name : 'Choose Photo 📸'}
                </label>
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
                />
              </div>
            )}

            <div className="text-input">
              <label htmlFor="submission-text">
                {challenge.category === 'photo' 
                  ? 'Tell us about your photo (optional)' 
                  : challenge.category === 'creative'
                  ? 'Share your creative work'
                  : challenge.category === 'learning'
                  ? 'Share what you learned'
                  : challenge.category === 'mindfulness'
                  ? 'Share your thoughts or experience'
                  : challenge.category === 'fitness'
                  ? 'Describe your activity'
                  : 'Describe your submission'
                }
              </label>
              <textarea
                id="submission-text"
                value={submission}
                onChange={(e) => setSubmission(e.target.value)}
                placeholder={
                  challenge.category === 'photo' 
                    ? "Share the story behind your photo..." 
                    : challenge.category === 'creative'
                    ? "Paste your creative work here..."
                    : challenge.category === 'learning'
                    ? "What interesting thing did you learn today?"
                    : challenge.category === 'mindfulness'
                    ? "Reflect on your experience..."
                    : challenge.category === 'fitness'
                    ? "How did the activity make you feel?"
                    : "Tell us about your challenge completion..."
                }
                rows={challenge.category === 'creative' ? 8 : 4}
                required={challenge.category !== 'photo'}
              />
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting || 
                       (challenge.category === 'photo' && !selectedFile) ||
                       (challenge.category !== 'photo' && !submission.trim())}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Challenge 🚀'}
            </button>

            {submitMessage && (
              <div className="submit-success">
                {submitMessage.split('\n').map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </div>
            )}

            {submitError && (
              <div className="submit-error">
                {submitError}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChallengeView;