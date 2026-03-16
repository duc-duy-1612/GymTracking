import { useState } from 'react';
import dailySummaryService from '../services/dailySummaryService';
import toast from 'react-hot-toast';

const EXERCISES = [
  {
    id: 'bench-press',
    name: 'Bench Press',
    subtitle: 'Chest • Strength',
    target: 'Pectoralis Major, Anterior Deltoids',
    image: 'https://s3.amazonaws.com/prod.skimble/assets/2289486/image_iphone.jpg',
    sets: 4,
    reps: '8-10',
  },
  {
    id: 'incline-db',
    name: 'Incline Dumbbell Press',
    subtitle: 'Chest • Hypertrophy',
    target: 'Upper Chest, Anterior Deltoids',
    image: 'https://images.unsplash.com/photo-1534368959876-26bf04f2c947?w=400&h=240&fit=crop',
    sets: 3,
    reps: '10-12',
  },
  {
    id: 'squat',
    name: 'Barbell Squat',
    subtitle: 'Legs • Strength',
    target: 'Quads, Glutes, Hamstrings',
    image: 'https://images.unsplash.com/photo-1534368959876-26bf04f2c947?w=400&h=240&fit=crop',
    sets: 4,
    reps: '6-8',
  },
  {
    id: 'deadlift',
    name: 'Romanian Deadlift',
    subtitle: 'Posterior Chain',
    target: 'Hamstrings, Glutes, Lower Back',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=240&fit=crop',
    sets: 3,
    reps: '10-12',
  },
];

function Workout() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [timerSec, setTimerSec] = useState(90);
  const [timerRunning, setTimerRunning] = useState(false);

  const exercise = EXERCISES[selectedIndex];

  const handleStartSet = () => {
    dailySummaryService.updateToday({ exercisedToday: true })
      .then(() => toast.success('Đã đánh dấu hôm nay đã tập luyện'))
      .catch(() => toast.error('Không cập nhật được trạng thái tập luyện'));
  };

  const handleCompleteWorkout = () => {
    dailySummaryService.updateToday({ exercisedToday: true })
      .then(() => toast.success('Đã hoàn thành buổi tập!'))
      .catch(() => toast.error('Không cập nhật được'));
  };

  return (
    <div className="workout-page">
      <div className="workout-grid">
        <div className="workout-sidebar card-dark">
          <h5 className="workout-sidebar-title">Bài tập hôm nay</h5>
          <div className="workout-list">
            {EXERCISES.map((ex, i) => (
              <button
                key={ex.id}
                type="button"
                className={`workout-list-item ${selectedIndex === i ? 'workout-list-item--active btn-fitbit' : 'card-dark-item'}`}
                onClick={() => setSelectedIndex(i)}
              >
                <div>
                  <div className="fw-bold">{ex.name}</div>
                  <small className={selectedIndex === i ? '' : 'text-muted'}>{ex.subtitle}</small>
                </div>
              </button>
            ))}
          </div>
          <button type="button" className="btn btn-fitbit w-100 workout-complete-btn" onClick={handleCompleteWorkout}>
            <i className="bi bi-check2-circle me-2" />
            Hoàn thành buổi tập
          </button>
        </div>
        <div className="workout-main card-dark">
          <h4 className="workout-main-title">{exercise.name}</h4>
          <p className="workout-main-target text-muted">Target: {exercise.target}</p>
          <div className="workout-video-placeholder">
            <img
              src={exercise.image}
              alt={exercise.name}
              className="workout-video-image"
            />
            <i className="bi bi-play-circle-fill workout-video-play-icon" aria-hidden />
          </div>
          <div className="workout-meta">
            <div className="workout-meta-item"><small className="text-muted d-block">SETS</small><strong>{exercise.sets}</strong></div>
            <div className="workout-meta-item"><small className="text-muted d-block">REPS</small><strong>{exercise.reps}</strong></div>
          </div>
        </div>
        <div className="workout-timer card-dark">
          <h5 className="workout-timer-title"><i className="bi bi-stopwatch" /> Timer</h5>
          <p className="workout-timer-label text-muted">Nghỉ giữa hiệp</p>
          <p className="workout-timer-value">
            {String(Math.floor(timerSec / 60)).padStart(2, '0')}:{String(timerSec % 60).padStart(2, '0')}
          </p>
          <button type="button" className="btn btn-fitbit w-100" onClick={handleStartSet}>
            Bắt đầu Set
          </button>
          <p className="form-hint" style={{ marginTop: 8, marginBottom: 0, fontSize: '0.7rem' }}>
            Bấm &quot;Bắt đầu Set&quot; cũng đánh dấu hôm nay đã tập (Today / Stats).
          </p>
        </div>
      </div>
    </div>
  );
}

export default Workout;
