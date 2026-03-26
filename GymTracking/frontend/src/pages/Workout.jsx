import { useState, useEffect, useRef } from 'react';
import dailySummaryService from '../services/dailySummaryService';
import workoutService from '../services/workoutService';
import toast from 'react-hot-toast';

const SET_DURATION_SEC = 90;
const REST_BETWEEN_SETS_SEC = 20;
const DEFAULT_SETS = 3;

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1534368959876-26bf04f2c947?w=400&h=240&fit=crop';

function Workout() {
  const [availableExercises, setAvailableExercises] = useState([]);
  const [exercisesList, setExercisesList] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('today');
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [selectedHistoryDate, setSelectedHistoryDate] = useState(new Date());

  const [startedAt] = useState(new Date());
  const [completedExercises, setCompletedExercises] = useState([]);
  const [sessionSaved, setSessionSaved] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [timerSec, setTimerSec] = useState(SET_DURATION_SEC);
  const [timerRunning, setTimerRunning] = useState(false);
  const [phase, setPhase] = useState('idle'); // idle | setCounting | setPaused | restCounting | restPaused | restDone
  const [completedSetsCount, setCompletedSetsCount] = useState(0);

  const exercisedMarkedRef = useRef(false);
  const autoCompleteRef = useRef(false);

  const exercise = exercisesList[selectedIndex];
  const targetSets = exercise?.sets || DEFAULT_SETS;

  // ── Fetch data ──────────────────────────────────────────
  const fetchHistory = () => {
    workoutService.getHistory()
      .then(res => setWorkoutHistory(res.data?.data || []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchHistory();
    workoutService.getExercises()
      .then(res => {
        if (res.data?.data?.length > 0) {
          setAvailableExercises(res.data.data.map(ex => ({
            id: ex._id,
            exerciseId: ex._id,
            name: ex.name,
            subtitle: `${ex.muscleGroup} • ${ex.type}`,
            target: ex.targetMuscles?.join(', ') || '',
            image: ex.imageUrl || FALLBACK_IMAGE,
            sets: ex.defaultSets || DEFAULT_SETS,
            reps: `${ex.defaultRepsMin || 8}-${ex.defaultRepsMax || 12}`,
          })));
        }
      })
      .catch(err => console.error('Lỗi fetch exercises:', err));
  }, []);

  // ── Reset khi đổi bài ───────────────────────────────────
  useEffect(() => {
    if (!exercise) return;
    setCompletedSetsCount(0);
    setTimerSec(SET_DURATION_SEC);
    setPhase('idle');
    setTimerRunning(false);
  }, [selectedIndex]);

  // ── Countdown ───────────────────────────────────────────
  useEffect(() => {
    if (!timerRunning) return;
    const t = setInterval(() => setTimerSec(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [timerRunning]);

  // ── Hết timer ─────────────────────────────────────────
  useEffect(() => {
    if (timerSec !== 0 || !timerRunning) return;
    if (phase === 'setCounting') {
      setTimerRunning(false);
      markSetComplete(completedSetsCount);
    } else if (phase === 'restCounting') {
      setPhase('restDone');
      setTimerRunning(false);
      setTimerSec(SET_DURATION_SEC);
    }
  }, [timerSec, timerRunning, phase]);

  // ── Đánh dấu 1 set hoàn thành ──────────────────────────
  const markSetComplete = (currentSets, exOverride) => {
    const ex = exOverride || exercise;
    const newCount = currentSets + 1;
    setCompletedSetsCount(newCount);

    if (!exercisedMarkedRef.current) {
      exercisedMarkedRef.current = true;
      dailySummaryService.updateToday({ exercisedToday: true }).catch(() => {});
    }

    const required = ex?.sets || DEFAULT_SETS;
    if (newCount >= required) {
      finishExercise(ex, newCount);
    } else {
      toast.success(`✅ Set ${newCount}/${required} xong! Nghỉ 20 giây...`, { duration: 2000 });
      setPhase('restCounting');
      setTimerSec(REST_BETWEEN_SETS_SEC);
      setTimerRunning(true);
    }
  };

  // ── Hoàn thành 1 bài ───────────────────────────────────
  const finishExercise = (ex, setsCount) => {
    const exData = ex || exercise;
    const sCount = setsCount ?? completedSetsCount;
    setPhase('idle');
    setTimerRunning(false);
    toast.success(`🏆 Xong bài "${exData?.name}"! (${sCount} set)`, { duration: 3000 });

    setCompletedExercises(prev => {
      const idx = prev.findIndex(e => e.name === exData?.name);
      const entry = {
        exerciseId: exData?.exerciseId || null,
        name: exData?.name,
        muscleGroup: exData?.subtitle?.split(' • ')[0] || 'Unknown',
        type: exData?.subtitle?.split(' • ')[1] || 'Strength',
        sets: sCount,
        repsMin: parseInt(exData?.reps?.split('-')[0]) || 8,
        repsMax: parseInt(exData?.reps?.split('-')[1]) || 12,
        imageUrl: exData?.image,
        completedSets: Array.from({ length: sCount }, (_, i) => ({ setNumber: i + 1 }))
      };
      const updated = idx >= 0 ? prev.map((e, i) => i === idx ? entry : e) : [...prev, entry];

      const allDone = exercisesList.length > 0 && exercisesList.every(le =>
        updated.some(c => c.name === le.name)
      );
      if (allDone && !autoCompleteRef.current) {
        autoCompleteRef.current = true;
        setTimeout(() => autoFinishWorkout(updated), 800);
      }
      return updated;
    });

    setCompletedSetsCount(0);
    setTimerSec(SET_DURATION_SEC);
    const next = selectedIndex + 1;
    if (next < exercisesList.length) {
      setTimeout(() => setSelectedIndex(next), 500);
    }
  };

  // ── Tự động kết thúc buổi tập ──────────────────────────
  const autoFinishWorkout = async (finalExercises) => {
    try {
      const endedAt = new Date();
      await workoutService.createWorkout({
        startedAt, endedAt,
        totalDurationMinutes: Math.round((endedAt - startedAt) / 60000),
        exercises: finalExercises,
        physicalCondition: { energyLevel: 8 },
        muscleGroup: exercisesList[0]?.subtitle?.split(' • ')[0] || 'Full Body'
      });
      await dailySummaryService.updateToday({ exercisedToday: true });
      setSessionSaved(true);
      fetchHistory();
      toast.success('🎉 Đã hoàn thành toàn bộ buổi tập!', { duration: 5000 });
    } catch (err) {
      toast.error('Lỗi khi lưu buổi tập.');
      console.error(err);
    }
  };

  // ── Handlers ───────────────────────────────────────────
  const handleStartSet = () => {
    setTimerSec(SET_DURATION_SEC);
    setTimerRunning(true);
    setPhase('setCounting');
    if (!exercisedMarkedRef.current) {
      exercisedMarkedRef.current = true;
      dailySummaryService.updateToday({ exercisedToday: true })
        .then(() => toast.success('Đã đánh dấu hôm nay đã tập'))
        .catch(() => {});
    }
  };

  // Bấm "Hoàn thành set" → +1 set thủ công
  const handleCompleteSet = () => {
    setTimerRunning(false);
    setPhase('idle');
    setTimerSec(SET_DURATION_SEC);
    markSetComplete(completedSetsCount);
  };

  const handlePause = () => {
    setTimerRunning(false);
    setPhase(p => p === 'setCounting' ? 'setPaused' : p === 'restCounting' ? 'restPaused' : p);
  };

  const handleResume = () => {
    setTimerRunning(true);
    setPhase(p => p === 'setPaused' ? 'setCounting' : p === 'restPaused' ? 'restCounting' : p);
  };



  // Bấm "Hoàn thành buổi tập" → tất cả bài đủ set rồi lưu
  const handleCompleteWorkout = async () => {
    const endedAt = new Date();
    const merged = exercisesList.map(le => {
      const done = completedExercises.find(c => c.name === le.name);
      if (done) return done;
      return {
        exerciseId: le.exerciseId || null,
        name: le.name,
        muscleGroup: le.subtitle?.split(' • ')[0] || 'Unknown',
        type: le.subtitle?.split(' • ')[1] || 'Strength',
        sets: le.sets || DEFAULT_SETS,
        repsMin: parseInt(le.reps?.split('-')[0]) || 8,
        repsMax: parseInt(le.reps?.split('-')[1]) || 12,
        imageUrl: le.image,
        completedSets: Array.from({ length: le.sets || DEFAULT_SETS }, (_, i) => ({ setNumber: i + 1 }))
      };
    });
    const finalExercises = merged.length > 0 ? merged : (exercise ? [{
      exerciseId: exercise.exerciseId || null,
      name: exercise.name,
      muscleGroup: exercise.subtitle?.split(' • ')[0] || 'Unknown',
      type: exercise.subtitle?.split(' • ')[1] || 'Strength',
      sets: targetSets,
      repsMin: parseInt(exercise.reps?.split('-')[0]) || 8,
      repsMax: parseInt(exercise.reps?.split('-')[1]) || 12,
      imageUrl: exercise.image,
      completedSets: Array.from({ length: targetSets }, (_, i) => ({ setNumber: i + 1 }))
    }] : []);

    try {
      await workoutService.createWorkout({
        startedAt, endedAt,
        totalDurationMinutes: Math.round((endedAt - startedAt) / 60000),
        exercises: finalExercises,
        physicalCondition: { energyLevel: 8 },
        muscleGroup: exercisesList[0]?.subtitle?.split(' • ')[0] || 'Full Body'
      });
      await dailySummaryService.updateToday({ exercisedToday: true });
      setSessionSaved(true);
      fetchHistory();
      toast.success('Đã lưu thành công lịch sử tập luyện!');
    } catch (err) {
      toast.error('Có lỗi khi lưu buổi tập lên server.');
      console.error(err);
    }
  };

  // ── Display flags ───────────────────────────────────────
  const showStartSet = phase === 'idle' && completedSetsCount < targetSets;
  const showStartNext = phase === 'restDone';
  const showTimerActions = ['setCounting', 'setPaused', 'restCounting', 'restPaused'].includes(phase);
  const isSetPhase = ['idle', 'setCounting', 'setPaused'].includes(phase);
  const timerLabel = isSetPhase ? 'Thời gian set' : 'Nghỉ giữa set';
  const timerHint = phase === 'setCounting' ? 'Đang tập set…'
    : phase === 'restCounting' ? 'Nghỉ 20 giây…'
    : (phase === 'setPaused' || phase === 'restPaused') ? 'Đã tạm dừng' : null;

  // ── Render ─────────────────────────────────────────────
  return (
    <div className="workout-page">
      <div className="workout-grid">
        {/* SIDEBAR */}
        <div className="workout-sidebar card-dark">
          <div className="workout-sidebar-tabs" style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
            <button className={`btn flex-fill ${viewMode === 'today' ? 'btn-fitbit' : 'btn-outline-secondary'}`} onClick={() => setViewMode('today')}>Hôm nay</button>
            <button className={`btn flex-fill ${viewMode === 'history' ? 'btn-fitbit' : 'btn-outline-secondary'}`} onClick={() => setViewMode('history')}>Lịch sử</button>
          </div>

          {viewMode === 'today' ? (
            <>
              <h5 className="workout-sidebar-title">Bài tập hôm nay</h5>
              <div className="workout-list">
                {exercisesList.map((ex, i) => {
                  const isDone = completedExercises.some(c => c.name === ex.name);
                  return (
                    <button key={ex.id} type="button"
                      className={`workout-list-item ${selectedIndex === i ? 'workout-list-item--active btn-fitbit' : 'card-dark-item'}`}
                      onClick={() => setSelectedIndex(i)}
                    >
                      <div>
                        <div className="fw-bold">{isDone ? '✅ ' : ''}{ex.name}</div>
                        <small className={selectedIndex === i ? '' : 'text-muted'}>{ex.subtitle}</small>
                      </div>
                    </button>
                  );
                })}
              </div>
              <button type="button" className="btn btn-fitbit w-100 workout-complete-btn" onClick={handleCompleteWorkout}>
                <i className="bi bi-check2-circle me-2" />
                {sessionSaved ? '✅ Đã lưu buổi tập' : 'Hoàn thành buổi tập'}
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
                  const y = new Date().getFullYear(), m = new Date().getMonth();
                  const firstDay = new Date(y, m, 1).getDay();
                  const daysInMonth = new Date(y, m + 1, 0).getDate();
                  const cells = [];
                  for (let i = 0; i < firstDay; i++) cells.push(<div key={`e${i}`} />);
                  for (let d = 1; d <= daysInMonth; d++) {
                    const cd = new Date(y, m, d);
                    const isSel = selectedHistoryDate.getDate() === d && selectedHistoryDate.getMonth() === m;
                    const has = workoutHistory.some(w => new Date(w.date).toDateString() === cd.toDateString());
                    cells.push(
                      <button key={d} onClick={() => setSelectedHistoryDate(cd)}
                        style={{ aspectRatio: '1', borderRadius: '8px', border: isSel ? '1px solid var(--fitbit-teal)' : '1px solid rgba(255,255,255,0.05)', background: isSel ? 'rgba(0,176,185,0.1)' : 'transparent', color: '#fff', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
                        {d}
                        {has && <span style={{ position: 'absolute', bottom: '4px', width: '6px', height: '6px', borderRadius: '50%', background: '#f43f5e' }} />}
                      </button>
                    );
                  }
                  return cells;
                })()}
              </div>
            </div>
          )}
        </div>

        {/* MAIN CONTENT */}
        {viewMode === 'history' ? (
          <div className="workout-main card-dark" style={{ gridColumn: 'span 2', overflowY: 'auto', maxHeight: '80vh' }}>
            <h4 className="workout-main-title border-bottom border-secondary pb-3 mb-4">
              Chi tiết tập luyện - {selectedHistoryDate.toLocaleDateString('vi-VN')}
            </h4>
            {(() => {
              const list = workoutHistory.filter(w => new Date(w.date).toDateString() === selectedHistoryDate.toDateString());
              if (!list.length) return (
                <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '200px' }}>
                  <i className="bi bi-calendar-x text-muted mb-2" style={{ fontSize: '2rem' }} />
                  <p className="text-muted">Không có dữ liệu buổi tập nào trong ngày này.</p>
                </div>
              );
              return (
                <div className="history-details-list">
                  {list.map(session => (
                    <div key={session._id} className="mb-4 bg-dark p-3 rounded">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="text-fitbit-teal m-0"><i className="bi bi-clock-history me-2" />{new Date(session.date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} ({session.totalDurationMinutes || 0} phút)</h6>
                        <span className="badge bg-secondary">{session.muscleGroup || 'Full Body'}</span>
                      </div>
                      <table className="table table-dark table-borderless align-middle m-0">
                        <tbody>
                          {session.exercises?.map((ex, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                              <td style={{ width: 50, padding: '8px 0' }}>
                                <img src={ex.imageUrl || FALLBACK_IMAGE} alt={ex.name} style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} />
                              </td>
                              <td><div className="fw-bold">{ex.name}</div><small className="text-muted">{ex.muscleGroup} • {ex.type}</small></td>
                              <td className="text-end"><span className="fw-bold">{ex.sets} Sets</span><br /><small className="text-muted">{ex.repsMin}-{ex.repsMax} Reps</small></td>
                            </tr>
                          ))}
                          {!session.exercises?.length && <tr><td colSpan="3" className="text-muted fst-italic">Bản ghi tóm tắt.</td></tr>}
                        </tbody>
                      </table>
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
                <img src={exercise.image} alt={exercise.name} className="workout-video-image" />
                <i 
                  className="bi bi-play-circle-fill workout-video-play-icon" 
                  style={{ display: exercise.image?.includes('.mp4') ? 'block' : 'none' }}
                  aria-hidden 
                />
              </div>
            </div>

            <div className="workout-timer card-dark">
              <div className="workout-meta mb-4" style={{ display: 'flex', justifyContent: 'space-around', backgroundColor: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
                <div className="workout-meta-item text-center">
                  <small className="text-muted d-block mb-1">SETS XONG</small>
                  <strong className="fs-4" style={{ color: completedSetsCount >= targetSets ? '#22c55e' : 'inherit' }}>
                    {completedSetsCount} / {targetSets}
                  </strong>
                </div>
                <div className="workout-meta-item text-center">
                  <small className="text-muted d-block mb-1">REPS / SET</small>
                  <strong className="fs-4">{exercise.reps}</strong>
                </div>
              </div>

              <h5 className="workout-timer-title"><i className="bi bi-stopwatch" /> Timer</h5>
              <p className="workout-timer-label text-muted">{timerLabel}</p>
              <p className="workout-timer-value">
                {String(Math.floor(timerSec / 60)).padStart(2, '0')}:{String(timerSec % 60).padStart(2, '0')}
              </p>

              {showStartSet && (
                <button type="button" className="btn btn-fitbit w-100" onClick={handleStartSet}>
                  Bắt đầu Set {completedSetsCount + 1}
                </button>
              )}
              {showStartNext && (
                <>
                  <p className="workout-timer-hint">Nghỉ xong! Bấm để bắt đầu set tiếp.</p>
                  <button type="button" className="btn btn-fitbit w-100" onClick={handleStartSet}>
                    Bắt đầu Set {completedSetsCount + 1}
                  </button>
                </>
              )}
              {timerHint && <p className="workout-timer-hint">{timerHint}</p>}

              {showTimerActions && (
                <div className="workout-timer-actions">
                  {(phase === 'setCounting' || phase === 'restCounting') ? (
                    <button type="button" className="btn btn-outline-light btn-sm workout-timer-btn" onClick={handlePause}>
                      <i className="bi bi-pause-fill me-1" /> Tạm dừng
                    </button>
                  ) : (
                    <button type="button" className="btn btn-fitbit btn-sm workout-timer-btn" onClick={handleResume}>
                      <i className="bi bi-play-fill me-1" /> Tiếp tục
                    </button>
                  )}
                  <button type="button" className="btn btn-outline-light btn-sm workout-timer-btn" onClick={handleCompleteSet}>
                    <i className="bi bi-check2 me-1" /> Hoàn thành set
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="workout-main card-dark d-flex flex-column align-items-center justify-content-center" style={{ gridColumn: 'span 2', minHeight: '300px' }}>
            <i className="bi bi-grid-plus d-block text-muted mb-3" style={{ fontSize: '3rem' }} />
            <h5 className="text-muted">Chưa có bài tập nào hôm nay</h5>
            <p className="text-muted">Bấm dấu + ở góc dưới để chọn bài tập từ hệ thống</p>
          </div>
        )}
      </div>

      {/* FAB */}
      {viewMode === 'today' && (
        <div className="fab-wrap">
          <button type="button" className="fab" title="Thêm bài tập" onClick={() => setIsAddModalOpen(true)}>
            <i className="bi bi-plus-lg" />
          </button>
        </div>
      )}

      {/* MODAL */}
      {isAddModalOpen && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1"
          onClick={e => { if (e.target.classList.contains('modal')) setIsAddModalOpen(false); }}>
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content card-dark border-secondary">
              <div className="modal-header border-secondary">
                <h5 className="modal-title">Chọn bài tập để thêm</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setIsAddModalOpen(false)} />
              </div>
              <div className="modal-body p-0">
                <div className="list-group list-group-flush rounded-bottom">
                  {availableExercises.map(ex => {
                    const isAdded = exercisesList.some(e => e.id === ex.id);
                    return (
                      <button key={ex.id} type="button" disabled={isAdded}
                        className={`list-group-item list-group-item-action ${isAdded ? 'bg-dark opacity-50' : 'bg-transparent'} text-light border-secondary d-flex align-items-center py-3`}
                        onClick={() => {
                          if (!isAdded) {
                            setExercisesList(prev => [...prev, ex]);
                            if (exercisesList.length === 0) setSelectedIndex(0);
                            setIsAddModalOpen(false);
                          }
                        }}
                      >
                        <img src={ex.image} alt={ex.name} className="rounded me-3" style={{ width: 48, height: 48, objectFit: 'cover' }} />
                        <div className="flex-grow-1 text-start">
                          <div className="fw-bold fs-6">{ex.name}</div>
                          <small className="text-muted">{ex.subtitle}</small>
                        </div>
                        {isAdded ? <i className="bi bi-check-circle-fill text-success fs-5" /> : <i className="bi bi-plus-circle text-primary fs-5" />}
                      </button>
                    );
                  })}
                  {!availableExercises.length && (
                    <div className="text-center text-muted p-4">
                      <i className="bi bi-cloud-slash d-block fs-1 mb-2" />
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
