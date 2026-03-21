import { useState, useEffect, useRef, useMemo } from 'react';
import dailySummaryService from '../services/dailySummaryService';
import workoutService from '../services/workoutService';
import toast from 'react-hot-toast';

const SET_DURATION_SEC = 90;   // 1 phút 30 — thời gian 1 set
const REST_BETWEEN_SETS_SEC = 20; // 20 giây nghỉ giữa set, sau đó bấm Bắt đầu cho set tiếp theo

const FALLBACK_EXERCISES = [
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
  const [availableExercises, setAvailableExercises] = useState([]);
  const [exercisesList, setExercisesList] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('today');
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [selectedHistoryDate, setSelectedHistoryDate] = useState(new Date());

  const [startedAt] = useState(new Date());
  const [completedExercises, setCompletedExercises] = useState([]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [timerSec, setTimerSec] = useState(SET_DURATION_SEC);
  const [timerRunning, setTimerRunning] = useState(false);
  // 'idle' | 'setCounting' | 'setPaused' | 'restCounting' | 'restPaused' | 'restDone'
  const [phase, setPhase] = useState('idle');
  const [setsRemaining, setSetsRemaining] = useState(0);
  const exercisedMarkedRef = useRef(false);
  const exercise = exercisesList[selectedIndex];

  useEffect(() => {
    workoutService.getHistory().then(res => setWorkoutHistory(res.data?.data || [])).catch(console.error);
    workoutService.getExercises().then(res => {
      if (res.data?.data?.length > 0) {
        const formatted = res.data.data.map(ex => ({
          id: ex._id,
          exerciseId: ex._id,
          name: ex.name,
          subtitle: `${ex.muscleGroup} • ${ex.type}`,
          target: ex.targetMuscles ? ex.targetMuscles.join(', ') : '',
          image: ex.imageUrl || FALLBACK_EXERCISES[0].image,
          sets: ex.defaultSets || 4,
          reps: `${ex.defaultRepsMin || 8}-${ex.defaultRepsMax || 12}`,
        }));
        setAvailableExercises(formatted);
      }
    }).catch(err => console.error('Lỗi fetch exercises:', err));
  }, []);

  // Reset state when switching exercise
  useEffect(() => {
    if (!exercise) return;
    setSetsRemaining(exercise.sets);
    setTimerSec(SET_DURATION_SEC);
    setPhase('idle');
    setTimerRunning(false);
  }, [selectedIndex, exercise?.sets]);

  // Khi timer về 0: chuyển set → nghỉ 20s, hoặc nghỉ xong → restDone
  useEffect(() => {
    if (timerSec !== 0 || !timerRunning) return;
    if (phase === 'setCounting') {
      setPhase('restCounting');
      setTimerSec(REST_BETWEEN_SETS_SEC);
    } else if (phase === 'restCounting') {
      setPhase('restDone');
      setTimerRunning(false);
      setTimerSec(SET_DURATION_SEC);
    }
  }, [timerSec, timerRunning, phase]);

  // Countdown: mỗi giây giảm 1, dừng ở 0
  useEffect(() => {
    if (!timerRunning) return;
    const t = setInterval(() => {
      setTimerSec((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [timerRunning]);

  const handleStartSet = () => {
    setTimerSec(SET_DURATION_SEC);
    setTimerRunning(true);
    setPhase('setCounting');
    if (!exercisedMarkedRef.current) {
      exercisedMarkedRef.current = true;
      dailySummaryService.updateToday({ exercisedToday: true })
        .then(() => toast.success('Đã đánh dấu hôm nay đã tập'))
        .catch(() => toast.error('Không cập nhật trạng thái tập'));
    }
  };

  const handleResetForNextSet = () => {
    setSetsRemaining((s) => s - 1);
    setTimerSec(SET_DURATION_SEC);
    setPhase('idle');
    setTimerRunning(false);
  };

  const handlePause = () => {
    setTimerRunning(false);
    setPhase((p) => (p === 'setCounting' ? 'setPaused' : p === 'restCounting' ? 'restPaused' : p));
  };

  const handleResume = () => {
    setTimerRunning(true);
    setPhase((p) => (p === 'setPaused' ? 'setCounting' : p === 'restPaused' ? 'restCounting' : p));
  };

  const handleCompleteExercise = () => {
    setSetsRemaining(0);
    setPhase('idle');
    setTimerRunning(false);

    setCompletedExercises(prev => {
      if (!prev.find(e => e.exerciseId === exercise.id || e.id === exercise.id)) {
        return [...prev, {
          exerciseId: exercise.exerciseId || null,
          name: exercise.name,
          muscleGroup: exercise.subtitle.split(' • ')[0] || 'Unknown',
          type: exercise.subtitle.split(' • ')[1] || 'Strength',
          sets: exercise.sets,
          repsMin: parseInt(exercise.reps.split('-')[0]) || 8,
          repsMax: parseInt(exercise.reps.split('-')[1]) || 12,
          imageUrl: exercise.image,
          completedSets: []
        }];
      }
      return prev;
    });

    dailySummaryService.updateToday({ exercisedToday: true })
      .then(() => toast.success('Đã hoàn thành bài tập!'))
      .catch(() => toast.error('Không cập nhật được'));
  };

  const handleCompleteWorkout = async () => {
    const endedAt = new Date();
    const duration = Math.round((endedAt - startedAt) / 60000);

    // Nếu chưa lưu bài nào thì tự động thêm bài hiện tại vào mảng
    const finalExercises = completedExercises.length > 0 ? completedExercises : (exercise ? [{
      exerciseId: exercise.exerciseId || null,
      name: exercise.name,
      muscleGroup: exercise.subtitle.split(' • ')[0] || 'Unknown',
      type: exercise.subtitle.split(' • ')[1] || 'Strength',
      sets: exercise.sets,
      repsMin: parseInt(exercise.reps.split('-')[0]) || 8,
      repsMax: parseInt(exercise.reps.split('-')[1]) || 12,
      imageUrl: exercise.image,
      completedSets: []
    }] : []);

    try {
      await workoutService.createWorkout({
        startedAt,
        endedAt,
        totalDurationMinutes: duration,
        exercises: finalExercises,
        physicalCondition: { energyLevel: 8 },
        muscleGroup: exercisesList[0]?.subtitle.split(' • ')[0] || 'Full Body'
      });
      await dailySummaryService.updateToday({ exercisedToday: true });
      toast.success('Đã lưu thành công lịch sử tập luyện!');
    } catch (err) {
      toast.error('Có lỗi khi lưu buổi tập lên server.');
      console.error(err);
    }
  };

  const showCompleteExercise = setsRemaining === 0;
  const showStartNext = phase === 'restDone' && setsRemaining > 0;
  const showStartSet = phase === 'idle' && !showCompleteExercise;
  const showTimerActions = ['setCounting', 'setPaused', 'restCounting', 'restPaused'].includes(phase);
  const isSetPhase = ['idle', 'setCounting', 'setPaused'].includes(phase);
  const isRestPhase = ['restCounting', 'restPaused', 'restDone'].includes(phase);
  const timerLabel = isSetPhase ? 'Thời gian set' : 'Nghỉ giữa set';
  const timerHint = phase === 'setCounting' ? 'Đang tập set…' : phase === 'restCounting' ? 'Nghỉ 20 giây…' : phase === 'setPaused' || phase === 'restPaused' ? 'Đã tạm dừng' : null;

  return (
    <div className="workout-page">
      <div className="workout-grid">
        <div className="workout-sidebar card-dark">
          <div className="workout-sidebar-tabs" style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
            <button className={`btn flex-fill ${viewMode === 'today' ? 'btn-fitbit' : 'btn-outline-secondary'}`} onClick={() => setViewMode('today')}>Hôm nay</button>
            <button className={`btn flex-fill ${viewMode === 'history' ? 'btn-fitbit' : 'btn-outline-secondary'}`} onClick={() => setViewMode('history')}>Lịch sử</button>
          </div>
          
          {viewMode === 'today' ? (
            <>
              <h5 className="workout-sidebar-title">Bài tập hôm nay</h5>
              <div className="workout-list">
            {exercisesList.map((ex, i) => (
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
            </>
          ) : (
            <div className="workout-calendar-wrap">
              <h5 className="workout-sidebar-title">Tháng {new Date().getMonth() + 1} / {new Date().getFullYear()}</h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '8px' }}>
                {['CN','T2','T3','T4','T5','T6','T7'].map(d => <small key={d} className="text-muted">{d}</small>)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {(() => {
                  const y = new Date().getFullYear();
                  const m = new Date().getMonth();
                  const firstDay = new Date(y, m, 1).getDay();
                  const daysInMonth = new Date(y, m + 1, 0).getDate();
                  const cells = [];
                  for (let i = 0; i < firstDay; i++) cells.push(<div key={`empty-${i}`} />);
                  for (let d = 1; d <= daysInMonth; d++) {
                    const currentDate = new Date(y, m, d);
                    const isSelected = selectedHistoryDate.getDate() === d && selectedHistoryDate.getMonth() === m;
                    const hasWorkout = workoutHistory.some(w => new Date(w.date).toDateString() === currentDate.toDateString());
                    cells.push(
                      <button 
                        key={d} 
                        style={{ aspectRatio: '1', borderRadius: '8px', border: isSelected ? '1px solid var(--fitbit-teal)' : '1px solid rgba(255,255,255,0.05)', background: isSelected ? 'rgba(0,176,185,0.1)' : 'transparent', color: '#fff', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
                        onClick={() => setSelectedHistoryDate(currentDate)}
                      >
                        {d}
                        {hasWorkout && <span style={{ position: 'absolute', bottom: '4px', width: '6px', height: '6px', borderRadius: '50%', background: '#f43f5e' }} />}
                      </button>
                    );
                  }
                  return cells;
                })()}
              </div>
            </div>
          )}
        </div>
        {viewMode === 'history' ? (
          <div className="workout-main card-dark" style={{ gridColumn: 'span 2', overflowY: 'auto', maxHeight: '80vh' }}>
            <h4 className="workout-main-title border-bottom border-secondary pb-3 mb-4">
              Chi tiết tập luyện - {selectedHistoryDate.toLocaleDateString('vi-VN')}
            </h4>
            {(() => {
              const historiesOfDay = workoutHistory.filter(w => new Date(w.date).toDateString() === selectedHistoryDate.toDateString());
              if (historiesOfDay.length === 0) {
                return (
                  <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '200px' }}>
                    <i className="bi bi-calendar-x text-muted mb-2" style={{ fontSize: '2rem' }}></i>
                    <p className="text-muted">Không có dữ liệu buổi tập nào trong ngày này.</p>
                  </div>
                );
              }
              return (
                <div className="history-details-list">
                  {historiesOfDay.map(session => (
                    <div key={session._id} className="mb-4 bg-dark p-3 rounded">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="text-fitbit-teal m-0"><i className="bi bi-clock-history me-2" />{new Date(session.date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} ({session.totalDurationMinutes || 0} phút)</h6>
                        <span className="badge bg-secondary">{session.muscleGroup || 'Full Body'}</span>
                      </div>
                      <div className="table-responsive">
                        <table className="table table-dark table-borderless align-middle m-0">
                          <tbody>
                            {session.exercises?.map((ex, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ width: '50px', padding: '8px 0' }}>
                                  <img src={ex.imageUrl || 'https://images.unsplash.com/photo-1534368959876-26bf04f2c947?w=100'} alt={ex.name} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                                </td>
                                <td>
                                  <div className="fw-bold fs-6">{ex.name}</div>
                                  <small className="text-muted">{ex.muscleGroup} • {ex.type}</small>
                                </td>
                                <td className="text-end pe-0">
                                  <span className="d-block fw-bold text-light">{ex.sets} Sets</span>
                                  <small className="text-muted">{ex.repsMin}-{ex.repsMax} Reps</small>
                                </td>
                              </tr>
                            ))}
                            {(!session.exercises || session.exercises.length === 0) && (
                              <tr><td colSpan="3" className="text-muted fst-italic py-2">Đây là bản ghi tóm tắt (không có chi tiết từng bài).</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        ) : exercise ? (
          <>
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
                <div className="workout-meta-item">
                  <small className="text-muted d-block">SETS</small>
                  <strong>{setsRemaining} / {exercise.sets}</strong>
                </div>
                <div className="workout-meta-item"><small className="text-muted d-block">REPS</small><strong>{exercise.reps}</strong></div>
              </div>
            </div>
            <div className="workout-timer card-dark">
              <h5 className="workout-timer-title"><i className="bi bi-stopwatch" /> Timer</h5>
              <p className="workout-timer-label text-muted">{timerLabel}</p>
              <p className="workout-timer-value">
                {String(Math.floor(timerSec / 60)).padStart(2, '0')}:{String(timerSec % 60).padStart(2, '0')}
              </p>
              {showStartSet && (
                <button type="button" className="btn btn-fitbit w-100" onClick={handleStartSet}>
                  Bắt đầu Set
                </button>
              )}
              {showStartNext && (
                <>
                  <p className="workout-timer-hint">Sẵn sàng set tiếp theo. Bấm Bắt đầu để chuyển set.</p>
                  <button type="button" className="btn btn-fitbit w-100" onClick={handleResetForNextSet}>
                    Bắt đầu
                  </button>
                </>
              )}
              {showCompleteExercise && (
                <button type="button" className="btn btn-fitbit w-100" onClick={handleCompleteExercise}>
                  Hoàn thành bài tập
                </button>
              )}
              {timerHint && <p className="workout-timer-hint">{timerHint}</p>}
              {showTimerActions && (
                <div className="workout-timer-actions">
                  {phase === 'setCounting' || phase === 'restCounting' ? (
                    <button type="button" className="btn btn-outline-light btn-sm workout-timer-btn" onClick={handlePause}>
                      <i className="bi bi-pause-fill me-1" /> Tạm dừng
                    </button>
                  ) : (
                    <button type="button" className="btn btn-fitbit btn-sm workout-timer-btn" onClick={handleResume}>
                      <i className="bi bi-play-fill me-1" /> Tiếp tục
                    </button>
                  )}
                  <button type="button" className="btn btn-outline-light btn-sm workout-timer-btn" onClick={handleResetForNextSet}>
                    <i className="bi bi-check2 me-1" /> Hoàn thành set
                  </button>
                  <button type="button" className="btn btn-outline-light btn-sm workout-timer-btn" onClick={handleCompleteExercise}>
                    <i className="bi bi-flag-fill me-1" /> Hoàn thành bài tập
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="workout-main card-dark d-flex flex-column align-items-center justify-content-center" style={{ gridColumn: 'span 2', minHeight: '300px' }}>
            <i className="bi bi-grid-plus d-block text-muted mb-3" style={{ fontSize: '3rem' }}></i>
            <h5 className="text-muted">Chưa có bài tập nào hôm nay</h5>
            <p className="text-muted">Bấm dấu + ở góc dưới để chọn bài tập từ hệ thống</p>
          </div>
        )}
      </div>

      {/* LOCAL FAB FOR ADDING EXERCISE */}
      {viewMode === 'today' && (
      <div className="fab-wrap">
        <button
          type="button"
          className="fab"
          title="Thêm bài tập"
          onClick={() => setIsAddModalOpen(true)}
        >
          <i className="bi bi-plus-lg" />
        </button>
      </div>
      )}

      {/* MODAL FOR ADDING EXERCISE */}
      {isAddModalOpen && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1" onClick={(e) => {
          if (e.target.classList.contains('modal')) setIsAddModalOpen(false);
        }}>
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content card-dark border-secondary">
              <div className="modal-header border-secondary">
                <h5 className="modal-title">Chọn bài tập để thêm</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setIsAddModalOpen(false)}></button>
              </div>
              <div className="modal-body p-0">
                <div className="list-group list-group-flush rounded-bottom">
                  {availableExercises.map((ex) => {
                    const isAdded = exercisesList.some(e => e.id === ex.id);
                    return (
                      <button
                        key={ex.id}
                        type="button"
                        className={`list-group-item list-group-item-action ${isAdded ? 'bg-dark opacity-50' : 'bg-transparent'} text-light border-secondary d-flex align-items-center py-3`}
                        onClick={() => {
                          if (!isAdded) {
                            setExercisesList([...exercisesList, ex]);
                            if (exercisesList.length === 0) setSelectedIndex(0);
                            setIsAddModalOpen(false);
                          }
                        }}
                        disabled={isAdded}
                      >
                        <img src={ex.image} alt={ex.name} className="rounded me-3" style={{ width: '48px', height: '48px', objectFit: 'cover' }} />
                        <div className="flex-grow-1 text-start">
                          <div className="fw-bold fs-6">{ex.name}</div>
                          <small className="text-muted">{ex.subtitle}</small>
                        </div>
                        {isAdded ? <i className="bi bi-check-circle-fill text-success fs-5" /> : <i className="bi bi-plus-circle text-primary fs-5" />}
                      </button>
                    )
                  })}
                  {availableExercises.length === 0 && (
                    <div className="text-center text-muted p-4">
                      <i className="bi bi-cloud-slash d-block fs-1 mb-2"></i>
                      Chưa có bài tập nào trong cơ sở dữ liệu.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Workout;
