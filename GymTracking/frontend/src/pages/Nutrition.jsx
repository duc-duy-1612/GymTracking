import { useEffect, useRef, useState } from 'react';
import dailySummaryService from '../services/dailySummaryService';
import nutritionService from '../services/nutritionService';
import { useUser } from '../context/UserContext';
import toast from 'react-hot-toast';

function Nutrition() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [caloriesToday, setCaloriesToday] = useState(0);
  const [adding, setAdding] = useState(false);
  const [customMeal, setCustomMeal] = useState({ name: '', calories: '', protein: 0, carbs: 0, fat: 0 });
  const [meals, setMeals] = useState([]);
  const [foodSuggestions, setFoodSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [quickMeals, setQuickMeals] = useState([]);
  const [showCreateFood, setShowCreateFood] = useState(false);
  const [newFood, setNewFood] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });
  const [libraryFoods, setLibraryFoods] = useState([]);
  const [activeMealTab, setActiveMealTab] = useState('Breakfast');
  const [showAllLibrary, setShowAllLibrary] = useState(false);
  const rowRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e) => {
    isDown.current = true;
    startX.current = e.pageX - rowRef.current.offsetLeft;
    scrollLeft.current = rowRef.current.scrollLeft;
  };
  const handleMouseLeave = () => { isDown.current = false; };
  const handleMouseUp = () => { isDown.current = false; };
  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - rowRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; 
    rowRef.current.scrollLeft = scrollLeft.current - walk;
  };

  useEffect(() => {
    nutritionService.getFoods('', '').then(res => setLibraryFoods(res.data.data)).catch(console.error);
  }, []);

  useEffect(() => {
    nutritionService.getFoods('', 'Cá nhân').then(res => setQuickMeals(res.data.data)).catch(console.error);
  }, []);

  const handleCreateFood = async (e) => {
    e.preventDefault();
    if (!newFood.name || !newFood.calories) return toast.error("Vui lòng nhập tên và lượng calo!");
    try {
      const res = await nutritionService.createFood({ ...newFood, category: 'Cá nhân' });
      setQuickMeals([res.data.data, ...quickMeals]);
      setShowCreateFood(false);
      setNewFood({ name: '', calories: '', protein: '', carbs: '', fat: '' });
      toast.success('Đã lưu vào danh sách món ăn cá nhân!');
    } catch (err) {
      toast.error('Lỗi khi lưu món ăn');
    }
  };

  useEffect(() => {
    if (customMeal.name.trim().length > 0) {
      const delayFn = setTimeout(() => {
        nutritionService.getFoods(customMeal.name).then(res => {
          setFoodSuggestions(res.data.data);
          setShowSuggestions(true);
        }).catch(console.error);
      }, 300);
      return () => clearTimeout(delayFn);
    } else {
      setFoodSuggestions([]);
      setShowSuggestions(false);
    }
  }, [customMeal.name]);

  const selectSuggestion = (food) => {
    setCustomMeal({ name: food.name, calories: food.calories, protein: food.protein, carbs: food.carbs, fat: food.fat });
    setShowSuggestions(false);
  };

  useEffect(() => {
    // Lấy ngày hiện tại định dạng YYYY-MM-DD để query lịch sử hôm nay
    const todayStr = new Date().toISOString().split('T')[0];

    Promise.all([
      dailySummaryService.getToday(),
      nutritionService.getHistory({ date: todayStr })
    ])
      .then(([summaryRes, historyRes]) => {
        let totalCals = 0;
        let totalGlucose = 0;
        const historyItems = historyRes.data?.data || [];
        if (historyItems.length > 0) {
          setMeals(historyItems.map(m => {
            totalCals += (m.macros?.calories || 0);
            totalGlucose += (m.macros?.glucose || 0);
            return {
              id: m._id,
              label: m.foodItem,
              calories: m.macros?.calories || 0,
              glucose: m.macros?.glucose || 0,
              mealType: m.mealType
            };
          }));
        }
        setCaloriesToday(totalCals);
        
        // Cache object into window variable for cross-request tracking
        window.tempGlucoseToday = totalGlucose;
        
        // Đồng bộ ngược lại database nếu Local Cache bị lệch do xóa thủ công
        if (summaryRes.data && (summaryRes.data.caloriesConsumed !== totalCals || summaryRes.data.glucoseConsumed !== totalGlucose)) {
          dailySummaryService.updateToday({ caloriesConsumed: totalCals, glucoseConsumed: totalGlucose }).catch(console.error);
        }
      })
      .catch(() => toast.error('Không tải được dữ liệu dinh dưỡng hôm nay'))
      .finally(() => setLoading(false));
  }, []);

  const targetCalories = user?.autoStats?.tdee ?? 1796;
  const remaining = Math.max(targetCalories - caloriesToday, 0);

  const addCalories = (amount, label, mealType = 'Snack', additionalMacros = { protein: 0, carbs: 0, fat: 0, glucose: 0 }) => {
    const newTotal = caloriesToday + amount;
    const newGlucose = (window.tempGlucoseToday || 0) + (additionalMacros.glucose || 0);
    window.tempGlucoseToday = newGlucose;
    setAdding(true);

    // Lưu thông tin bữa ăn chi tiết vào API nutrition
    nutritionService.addMeal({
      foodItem: label,
      mealType: mealType,
      macros: { calories: amount, ...additionalMacros }
    })
      .then((mealRes) => {
        // Sau đó cộng dồn calo và đường vào trang DailySummary
        return dailySummaryService.updateToday({ caloriesConsumed: newTotal, glucoseConsumed: newGlucose })
          .then((res) => {
            setCaloriesToday(res.data.caloriesConsumed ?? newTotal);
            const savedMeal = mealRes.data?.data;
            setMeals((prev) => [
              { id: savedMeal?._id || Date.now(), label, calories: amount, mealType },
              ...prev,
            ]);
            toast.success(`Đã thêm ${amount} cal · ${label}`);
          });
      })
      .catch(() => toast.error('Không cập nhật được bữa ăn hôm nay'))
      .finally(() => setAdding(false));
  };

  const handleSubmitCustom = (e) => {
    e.preventDefault();
    if (!customMeal.calories) return;
    const amount = Number(customMeal.calories);
    if (Number.isNaN(amount) || amount <= 0) {
      toast.error('Calo phải là số dương');
      return;
    }
    addCalories(amount, customMeal.name || 'Bữa ăn tùy chỉnh', 'Snack', { 
      protein: customMeal.protein || 0, 
      carbs: customMeal.carbs || 0, 
      fat: customMeal.fat || 0,
      glucose: 0 // Tuỳ chỉnh ko có glucose default
    });
    setCustomMeal({ name: '', calories: '', protein: 0, carbs: 0, fat: 0 });
  };

  if (loading) {
    return (
      <div className="nutrition-page">
        <h1 className="page-full-title">Dinh dưỡng</h1>
        <div className="today-sections">
          <section className="today-section">
            <h2 className="today-section-title">Đang tải...</h2>
            <div className="today-cards today-cards--1col">
              <div className="fitbit-card card-dark">
                <div className="skeleton-block" style={{ height: 24, width: '40%', marginBottom: 12 }} />
                <div className="skeleton-block" style={{ height: 40, width: '60%', marginBottom: 8 }} />
                <div className="skeleton-block" style={{ height: 20, width: '50%' }} />
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="nutrition-page">
      <h1 className="page-full-title">Dinh dưỡng</h1>
      <div className="today-sections">
        <section className="today-section">
          <h2 className="today-section-title">Tổng quan hôm nay</h2>
          <div className="today-cards today-cards--2col">
            <div className="fitbit-card">
              <div className="fitbit-card-body">
                <p className="fitbit-card-title">Calories đã ăn</p>
                <p className="fitbit-card-value">{caloriesToday.toLocaleString()} cal</p>
                <p className="fitbit-card-sub">Mục tiêu: {targetCalories.toLocaleString()} cal</p>
              </div>
              <div className="fitbit-card-icon"><i className="bi bi-egg-fried" /></div>
            </div>
            <div className="fitbit-card">
              <div className="fitbit-card-body">
                <p className="fitbit-card-title">Còn lại</p>
                <p className="fitbit-card-value">{remaining.toLocaleString()} cal</p>
                <p className="fitbit-card-sub">Hôm nay</p>
              </div>
              <div className="fitbit-card-icon"><i className="bi bi-heart-pulse" /></div>
            </div>
          </div>
        </section>

        <section className="today-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="today-section-title" style={{ margin: 0 }}>Thư viện món ăn</h2>
            <button className="coach-see-all" onClick={() => setShowAllLibrary(true)}>Xem tất cả</button>
          </div>
          <div className="coach-filters" style={{ marginBottom: '1rem', padding: '0 0.5rem', display: 'flex', flexWrap: 'wrap', gap: '8px', overflowX: 'visible' }}>
            {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map(meal => (
              <button 
                key={meal} 
                className={`coach-pill ${activeMealTab === meal ? 'coach-pill--active' : ''}`}
                onClick={() => setActiveMealTab(meal)}
              >
                {meal === 'Breakfast' ? 'Bữa sáng' : meal === 'Lunch' ? 'Bữa trưa' : meal === 'Dinner' ? 'Bữa tối' : 'Bữa phụ'}
              </button>
            ))}
          </div>
          <div 
            className="coach-card-row hide-scrollbar" 
            ref={rowRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            style={{ paddingBottom: '16px', display: 'flex', gap: '16px', overflowX: 'auto', WebkitOverflowScrolling: 'touch', cursor: 'grab' }}
          >
            {libraryFoods.map(food => (
              <div key={food._id} className="coach-card" style={{ minWidth: '200px', flexShrink: 0 }}>
                <div className="coach-card-image-wrap" onClick={() => addCalories(food.calories, food.name, activeMealTab, { protein: food.protein, carbs: food.carbs, fat: food.fat, glucose: food.glucose || 0 })}>
                  <img src={food.image || `https://loremflickr.com/400/300/food?lock=${food.name.length}`} alt={food.name} className="coach-card-image" draggable="false" style={{ cursor: 'pointer', height: '140px', objectFit: 'cover' }} />
                  <span className="coach-card-play" style={{ cursor: 'pointer', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="bi bi-plus" style={{ fontSize: '1.5rem', marginLeft: 0 }} /></span>
                </div>
                <h3 className="coach-card-title" style={{ marginTop: '12px' }}>{food.name}</h3>
                <p className="coach-card-meta">{food.calories} cal · {food.category}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="today-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="today-section-title" style={{ margin: 0 }}>Món ăn cá nhân của bạn</h2>
            <button className="coach-see-all" onClick={() => setShowCreateFood(true)}>+ Tạo món mới</button>
          </div>
          <div className="today-cards today-cards--3col">
            {quickMeals.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem 1rem', background: 'var(--fitbit-card)', borderRadius: '12px' }}>
                <p style={{ color: 'var(--fitbit-muted)', marginBottom: '10px' }}>Chưa có món ăn cá nhân nào.</p>
                <button type="button" className="btn btn-fitbit" onClick={() => setShowCreateFood(true)}>Tạo món ăn đầu tiên</button>
              </div>
            ) : (
              quickMeals.map((m) => (
                <button
                  key={m._id}
                  type="button"
                  className="fitbit-card btn-quick-meal"
                  disabled={adding}
                  onClick={() => addCalories(m.calories, m.name, 'Snack', { protein: m.protein, carbs: m.carbs, fat: m.fat, glucose: m.glucose || 0 })}
                >
                  <div className="fitbit-card-body">
                    <p className="fitbit-card-title">{m.name}</p>
                    <p className="fitbit-card-value">{m.calories} cal</p>
                    <p className="fitbit-card-sub">P: {m.protein}g · C: {m.carbs}g · F: {m.fat}g</p>
                  </div>
                  <div className="fitbit-card-icon"><i className="bi bi-plus-lg" /></div>
                </button>
              ))
            )}
          </div>
        </section>

        {/* Custom Meal Input Section Removed per request */}

        <section className="today-section">
          <h2 className="today-section-title">Bữa ăn đã ghi hôm nay (trong phiên)</h2>
          <div className="today-cards today-cards--1col">
            <div className="fitbit-card card-dark">
              {meals.length === 0 ? (
                <p className="text-muted" style={{ margin: 0 }}>Chưa có bữa nào được thêm trong phiên này.</p>
              ) : (
                <div className="history-list">
                  {meals.map((m) => {
                    const mealTypeMap = { Breakfast: 'Bữa sáng', Lunch: 'Bữa trưa', Dinner: 'Bữa tối', Snack: 'Bữa phụ' };
                    return (
                      <div key={m.id} className="history-list-row">
                        <div className="history-list-label">
                          <span style={{ display: 'inline-block', width: '80px', color: 'var(--fitbit-teal)', fontSize: '0.85rem' }}>
                            {mealTypeMap[m.mealType] || 'Bữa phụ'}
                          </span>
                          {m.label}
                        </div>
                        <div className="history-list-values">
                          <span>{m.calories} cal</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {showAllLibrary && (
        <div className="coach-modal-overlay" style={{ zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => setShowAllLibrary(false)}>
          <div className="coach-modal" style={{ width: '90%', maxWidth: '1000px', maxHeight: '85vh', background: 'var(--fitbit-card)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: 'var(--fitbit-teal)' }}>Thư viện món ăn</h2>
              <button onClick={() => setShowAllLibrary(false)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>
                <i className="bi bi-x" />
              </button>
            </div>
            
            <div className="coach-filters" style={{ marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '8px', overflowX: 'visible' }}>
              {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map(meal => (
                <button 
                  key={meal} 
                  className={`coach-pill ${activeMealTab === meal ? 'coach-pill--active' : ''}`}
                  onClick={() => setActiveMealTab(meal)}
                >
                  {meal === 'Breakfast' ? 'Bữa sáng' : meal === 'Lunch' ? 'Bữa trưa' : meal === 'Dinner' ? 'Bữa tối' : 'Bữa phụ'}
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', overflowY: 'auto', paddingRight: '10px' }} className="hide-scrollbar">
              {libraryFoods.map(food => (
                <div key={food._id} className="coach-card">
                  <div className="coach-card-image-wrap" onClick={() => { addCalories(food.calories, food.name, activeMealTab, { protein: food.protein, carbs: food.carbs, fat: food.fat }); setShowAllLibrary(false); }}>
                    <img src={food.image || `https://loremflickr.com/400/300/food?lock=${food.name.length}`} alt={food.name} className="coach-card-image" draggable="false" style={{ cursor: 'pointer', height: '140px', objectFit: 'cover' }} />
                    <span className="coach-card-play" style={{ cursor: 'pointer', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="bi bi-plus" style={{ fontSize: '1.5rem', marginLeft: 0 }} /></span>
                  </div>
                  <h3 className="coach-card-title" style={{ marginTop: '12px' }}>{food.name}</h3>
                  <p className="coach-card-meta">{food.calories} cal · {food.category}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showCreateFood && (
        <div className="coach-modal-overlay" style={{ zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => setShowCreateFood(false)}>
          <div className="coach-modal" style={{ width: '90%', maxWidth: '500px', background: 'var(--fitbit-card)', borderRadius: '16px', padding: '24px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: 'var(--fitbit-teal)' }}>Tạo món ăn mới</h3>
              <button type="button" onClick={() => setShowCreateFood(false)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>
                <i className="bi bi-x" />
              </button>
            </div>
            <form onSubmit={handleCreateFood}>
              <div className="mb-3">
                <label className="form-label">Tên món ăn <span className="text-danger">*</span></label>
                <input type="text" className="form-control" required placeholder="Ví dụ: Sinh tố bơ" value={newFood.name} onChange={(e) => setNewFood({...newFood, name: e.target.value})} />
              </div>
              <div className="mb-3">
                <label className="form-label">Lượng Calo (kcal) <span className="text-danger">*</span></label>
                <input type="number" min="0" className="form-control" required placeholder="Ví dụ: 300" value={newFood.calories} onChange={(e) => setNewFood({...newFood, calories: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div className="mb-3">
                  <label className="form-label">Protein (g)</label>
                  <input type="number" min="0" className="form-control" placeholder="0" value={newFood.protein} onChange={(e) => setNewFood({...newFood, protein: e.target.value})} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Carbs (g)</label>
                  <input type="number" min="0" className="form-control" placeholder="0" value={newFood.carbs} onChange={(e) => setNewFood({...newFood, carbs: e.target.value})} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Fat (g)</label>
                  <input type="number" min="0" className="form-control" placeholder="0" value={newFood.fat} onChange={(e) => setNewFood({...newFood, fat: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="btn btn-fitbit w-100 mt-3">Lưu món ăn</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Nutrition;

