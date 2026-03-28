import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import StarRating from '../components/StarRating';

const CRITERIA = [
  { key: 'teachingQuality', label: 'Teaching Quality', icon: '📖', desc: 'Clarity and effectiveness of teaching' },
  { key: 'courseContent', label: 'Course Content', icon: '📚', desc: 'Relevance and depth of material' },
  { key: 'accessibility', label: 'Accessibility', icon: '🚪', desc: 'Availability and approachability' },
  { key: 'communication', label: 'Communication', icon: '💬', desc: 'Clarity in explaining concepts' },
  { key: 'overallSatisfaction', label: 'Overall Satisfaction', icon: '⭐', desc: 'Your overall experience' },
];

const SubmitFeedback = () => {
  const [courses, setCourses] = useState([]);
  const [submittedIds, setSubmittedIds] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [ratings, setRatings] = useState({ teachingQuality: 0, courseContent: 0, accessibility: 0, communication: 0, overallSatisfaction: 0 });
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      axios.get('/api/courses'),
      axios.get('/api/feedback/my'),
    ]).then(([c, fb]) => {
      setCourses(c.data.data);
      setSubmittedIds(fb.data.data.map(f => f.course?._id));
    }).finally(() => setLoading(false));
  }, []);

  const availableCourses = courses.filter(c => !submittedIds.includes(c._id));
  const selectedCourseObj = courses.find(c => c._id === selectedCourse);
  const allRated = Object.values(ratings).every(v => v > 0);

  const handleSubmit = async () => {
    if (!selectedCourse) return toast.error('Please select a course');
    if (!allRated) return toast.error('Please rate all criteria');
    setSubmitting(true);
    try {
      await axios.post('/api/feedback', { courseId: selectedCourse, ratings, comment, isAnonymous });
      toast.success('🎉 Feedback submitted successfully!');
      navigate('/student');
    } catch (e) { toast.error(e?.response?.data?.message || 'Submission failed'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <Layout title="Submit Feedback"><div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Loading…</div></Layout>;

  return (
    <Layout title="Submit Feedback">
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 32, background: '#fff', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
          {['Select Course', 'Rate Criteria', 'Add Comments'].map((s, i) => (
            <div key={i} onClick={() => i < step && setStep(i + 1)}
              style={{ flex: 1, padding: '14px', textAlign: 'center', fontSize: 13, fontWeight: 600, cursor: i < step ? 'pointer' : 'default', background: step === i + 1 ? 'linear-gradient(135deg,#6C63FF,#9C6FFF)' : step > i + 1 ? '#F0FDF4' : 'transparent', color: step === i + 1 ? '#fff' : step > i + 1 ? '#4CAF50' : 'var(--text-muted)', transition: 'all .2s' }}>
              {step > i + 1 ? '✓ ' : `${i + 1}. `}{s}
            </div>
          ))}
        </div>

        {/* Step 1: Select Course */}
        {step === 1 && (
          <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: 32, boxShadow: 'var(--shadow)', border: '1px solid var(--border)', animation: 'fadeIn .3s ease' }}>
            <h3 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Select a Course</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>Choose the course you want to provide feedback for</p>
            {availableCourses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#4CAF50' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
                <h3 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600 }}>All Done!</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>You've submitted feedback for all your courses.</p>
              </div>
            ) : availableCourses.map(c => (
              <div key={c._id} onClick={() => { setSelectedCourse(c._id); }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderRadius: 12, border: `2px solid ${selectedCourse === c._id ? 'var(--primary)' : 'var(--border)'}`, background: selectedCourse === c._id ? 'var(--primary-light)' : '#fff', marginBottom: 12, cursor: 'pointer', transition: 'all .2s' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text)' }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{c.code} · 👨‍🏫 {c.faculty?.name} · {c.credits} credits</div>
                </div>
                {selectedCourse === c._id && <span style={{ fontSize: 22 }}>✅</span>}
              </div>
            ))}
            {selectedCourse && (
              <button onClick={() => setStep(2)} style={{ width: '100%', marginTop: 16, padding: '14px', borderRadius: 12, background: 'linear-gradient(135deg,#6C63FF,#9C6FFF)', color: '#fff', border: 'none', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
                Continue →
              </button>
            )}
          </div>
        )}

        {/* Step 2: Ratings */}
        {step === 2 && (
          <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: 32, boxShadow: 'var(--shadow)', border: '1px solid var(--border)', animation: 'fadeIn .3s ease' }}>
            <div style={{ marginBottom: 24, padding: '14px 20px', background: 'var(--primary-light)', borderRadius: 12, border: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 600, color: 'var(--primary)', fontSize: 15 }}>{selectedCourseObj?.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>👨‍🏫 {selectedCourseObj?.faculty?.name}</div>
            </div>
            <h3 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Rate Your Experience</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>Click the stars to rate each criteria</p>
            {CRITERIA.map(c => (
              <div key={c.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{c.icon} {c.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{c.desc}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <StarRating value={ratings[c.key]} onChange={v => setRatings(p => ({ ...p, [c.key]: v }))} size={30} />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{['','Poor','Fair','Good','Very Good','Excellent'][ratings[c.key]] || 'Click to rate'}</span>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, padding: '14px', borderRadius: 12, background: 'var(--bg)', border: '1px solid var(--border)', fontWeight: 600, cursor: 'pointer', fontSize: 15 }}>← Back</button>
              <button onClick={() => allRated ? setStep(3) : toast.error('Rate all criteria')} style={{ flex: 2, padding: '14px', borderRadius: 12, background: 'linear-gradient(135deg,#6C63FF,#9C6FFF)', color: '#fff', border: 'none', fontWeight: 700, fontSize: 15, cursor: 'pointer', opacity: allRated ? 1 : 0.5 }}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Comments */}
        {step === 3 && (
          <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: 32, boxShadow: 'var(--shadow)', border: '1px solid var(--border)', animation: 'fadeIn .3s ease' }}>
            <h3 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Add Comments</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>Share any specific feedback or suggestions (optional)</p>
            <textarea value={comment} onChange={e => setComment(e.target.value)} rows={5}
              placeholder="Tell us more about your experience — what worked well, what could be improved…"
              style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid var(--border)', fontSize: 14, resize: 'vertical', outline: 'none', boxSizing: 'border-box', lineHeight: 1.6, transition: 'border .2s' }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 20, marginTop: 4 }}>
              <span>{comment.length}/1000 characters</span>
            </div>

            {/* Anonymous toggle */}
            <div onClick={() => setIsAnonymous(p => !p)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 12, border: `2px solid ${isAnonymous ? 'var(--primary)' : 'var(--border)'}`, background: isAnonymous ? 'var(--primary-light)' : '#fff', cursor: 'pointer', marginBottom: 24, transition: 'all .2s' }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: isAnonymous ? 'var(--primary)' : '#fff', border: `2px solid ${isAnonymous ? 'var(--primary)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, transition: 'all .2s' }}>
                {isAnonymous ? '✓' : ''}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: isAnonymous ? 'var(--primary)' : 'var(--text)' }}>Submit Anonymously 🎭</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Your name won't be shown to faculty</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setStep(2)} style={{ flex: 1, padding: '14px', borderRadius: 12, background: 'var(--bg)', border: '1px solid var(--border)', fontWeight: 600, cursor: 'pointer', fontSize: 15 }}>← Back</button>
              <button onClick={handleSubmit} disabled={submitting} style={{ flex: 2, padding: '14px', borderRadius: 12, background: 'linear-gradient(135deg,#6C63FF,#FF6584)', color: '#fff', border: 'none', fontWeight: 700, fontSize: 15, cursor: submitting ? 'not-allowed' : 'pointer', boxShadow: '0 4px 20px rgba(108,99,255,.4)' }}>
                {submitting ? '⏳ Submitting…' : '🚀 Submit Feedback'}
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SubmitFeedback;
