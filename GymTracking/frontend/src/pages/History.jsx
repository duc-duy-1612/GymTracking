import { useEffect, useState } from 'react';
import dailySummaryService from '../services/dailySummaryService';
import toast from 'react-hot-toast';

const WEEKDAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

function formatDateKey(d) {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x.getTime();
}

function getDayIndex(date) {
  return new Date(date).getDay();
}

function History() {
  const [today, setToday] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dailySummaryService.getToday().then((r) => r.data),
      dailySummaryService.getHistory({ days: 7 }).then((r) => r.data),
    ])
      .then(([todayData, historyData]) => {
        setToday(todayData);
        setHistory(Array.isArray(historyData) ? historyData : []);
      })
      .catch(() => {
        toast.error('Không tải được dữ liệu lịch sử');
        setToday(null);
        setHistory([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const historyByDate = {};
  history.forEach((s) => {
    const key = formatDateKey(s.date);
    historyByDate[key] = s;
  });

  const todayIndex = new Date().getDay();
  const todayKey = formatDateKey(new Date());
  const todayData = today ?? historyByDate[todayKey];
  const todayCalories = todayData?.caloriesConsumed ?? 0;
  const todayWater = todayData?.waterMl ?? 0;
  const todayExercise = todayData?.exercisedToday ?? false;
  const todaySleep = todayData?.sleepMinutes;
  const hasActivityToday = todayCalories > 0 || todayWater > 0 || todayExercise || (todaySleep != null && todaySleep > 0);

  const last7Days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    d.setUTCHours(0, 0, 0, 0);
    const key = d.getTime();
    last7Days.push({ date: d, key, summary: historyByDate[key] });
  }
  last7Days.reverse();

  const hasActivity = (summary) => {
    if (!summary) return false;
    return (summary.caloriesConsumed ?? 0) > 0 || (summary.waterMl ?? 0) > 0 || summary.exercisedToday || (summary.sleepMinutes != null && summary.sleepMinutes > 0);
  };

  if (loading) {
    return (
      <div className="history-page">
        <h1 className="page-full-title">Lịch sử</h1>
        <div className="today-sections">
          <section className="today-section">
            <h2 className="today-section-title">Đang tải...</h2>
            <div className="today-cards today-cards--1col">
              <div className="fitbit-card card-dark">
                <div className="skeleton-block" style={{ height: 32, width: '40%', marginBottom: 16 }} />
                <div className="skeleton-block" style={{ height: 80, width: '100%' }} />
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">
      <h1 className="page-full-title">Lịch sử</h1>
    <div className="today-sections">
      <section className="today-section">
        <h2 className="today-section-title">Tổng quan hôm nay</h2>
        <div className="today-cards today-cards--3col">
          <div className="fitbit-card">
            <div className="fitbit-card-body">
              <p className="fitbit-card-title">Calories</p>
              <p className="fitbit-card-value">{todayCalories.toLocaleString()} cal</p>
              <p className="fitbit-card-sub">Từ Nutrition / Today</p>
            </div>
            <div className="fitbit-card-icon"><i className="bi bi-apple" /></div>
          </div>
          <div className="fitbit-card">
            <div className="fitbit-card-body">
              <p className="fitbit-card-title">Nước</p>
              <p className="fitbit-card-value">{todayWater.toLocaleString()} ml</p>
              <p className="fitbit-card-sub">Từ Today</p>
            </div>
            <div className="fitbit-card-icon blue"><i className="bi bi-droplet-half" /></div>
          </div>
          <div className="fitbit-card">
            <div className="fitbit-card-body">
              <p className="fitbit-card-title">Tập luyện</p>
              <p className="fitbit-card-value">{todayExercise ? 'Đã tập' : 'Chưa tập'}</p>
              <p className="fitbit-card-sub">Từ Workout / Today</p>
            </div>
            <div className="fitbit-card-icon"><i className="bi bi-activity" /></div>
          </div>
        </div>
      </section>

      <section className="today-section">
        <h2 className="today-section-title">Tuần này</h2>
        <div className="today-cards today-cards--1col">
          <div className="fitbit-card card-dark">
            <div className="history-week-grid">
              {last7Days.map(({ date, summary }) => {
                const dayIdx = getDayIndex(date);
                const isToday = date.getTime() === todayKey;
                const active = hasActivity(summary);
                return (
                  <div key={date.getTime()} className={`history-week-col ${isToday ? 'history-week-col--today' : ''}`}>
                    <span className="history-week-day">{WEEKDAY_LABELS[dayIdx]}</span>
                    <span className={`history-week-dot ${active ? 'history-week-dot--filled' : ''}`} />
                  </div>
                );
              })}
            </div>
            <p className="form-hint" style={{ marginTop: 10, marginBottom: 0 }}>
              Cột highlight là hôm nay. Chấm sáng = có dữ liệu (calo, nước, tập hoặc ngủ) từ API lịch sử.
            </p>
          </div>
        </div>
      </section>

      <section className="today-section">
        <h2 className="today-section-title">Nhật ký 7 ngày gần đây</h2>
        <div className="today-cards today-cards--1col">
          <div className="fitbit-card card-dark history-list">
            {last7Days.map(({ date, summary }) => {
              const isToday = date.getTime() === todayKey;
              const label = isToday ? 'Hôm nay' : date.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'short' });
              const cal = summary?.caloriesConsumed ?? 0;
              const water = summary?.waterMl ?? 0;
              const exercised = summary?.exercisedToday ?? false;
              const sleep = summary?.sleepMinutes;
              return (
                <div key={date.getTime()} className={`history-list-row ${isToday ? 'history-list-row--today' : ''}`}>
                  <div className="history-list-label">{label}</div>
                  <div className="history-list-values">
                    <span>Calories: {cal} cal</span>
                    <span>Nước: {water} ml</span>
                    <span>Tập: {exercised ? 'Có' : 'Chưa'}</span>
                    {sleep != null && sleep > 0 && <span>Ngủ: {Math.floor(sleep / 60)}h{sleep % 60 ? ` ${sleep % 60}m` : ''}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
    </div>
  );
}

export default History;
