import { useState, useRef, useEffect } from 'react';
import coachService from '../services/coachService';
import userService from '../services/userService';
import { useUser } from '../context/UserContext';

const COPIES = 3;

const FILTERS = [
  { id: 'all', label: 'Tất cả', icon: 'bi bi-grid-3x3-gap' },
  { id: 'running', label: 'Chạy bộ', icon: 'bi bi-person-running' },
  { id: 'strength', label: 'Sức mạnh', icon: 'bi bi-dumbbell' },
  { id: 'mindful', label: 'Chánh niệm', icon: 'bi bi-brain' },
  { id: 'cardio', label: 'Cardio', icon: 'bi bi-heart-pulse' },
  { id: 'yoga', label: 'Yoga', icon: 'bi bi-flower2' },
  { id: 'mobility', label: 'Mobility & recovery', icon: 'bi bi-arrow-repeat' },
  { id: 'recipes', label: 'Recipes', icon: 'bi bi-egg-fried' },
  { id: 'new', label: 'New', icon: 'bi bi-stars' },
  { id: 'available', label: 'Available to you', icon: 'bi bi-unlock' },
  { id: 'favorites', label: 'Favorites', icon: 'bi bi-heart-fill' },
];

function CoachSection({ title, children, onSeeAll }) {
  const rowRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e) => {
    isDown.current = true;
    if (rowRef.current) {
      rowRef.current.style.scrollSnapType = 'none';
      rowRef.current.style.scrollBehavior = 'auto';
      rowRef.current.style.cursor = 'grabbing';
      startX.current = e.pageX - rowRef.current.offsetLeft;
      scrollLeft.current = rowRef.current.scrollLeft;
    }
  };

  const handleMouseMove = (e) => {
    if (!isDown.current || !rowRef.current) return;
    e.preventDefault();
    const x = e.pageX - rowRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    rowRef.current.scrollLeft = scrollLeft.current - walk;
    
    if (Math.abs(walk) > 5) {
      Array.from(rowRef.current.children).forEach(c => c.style.pointerEvents = 'none');
    }
  };

  const release = () => {
    isDown.current = false;
    if (rowRef.current) {
      rowRef.current.style.scrollSnapType = '';
      rowRef.current.style.scrollBehavior = '';
      rowRef.current.style.cursor = '';
      setTimeout(() => {
        Array.from(rowRef.current.children).forEach(c => c.style.pointerEvents = '');
      }, 50); // Small delay to prevent click firing immediately after drag
    }
  };

  return (
    <section className="coach-section">
      <div className="coach-section-header">
        <h2 className="coach-section-title">{title}</h2>
        {onSeeAll && <button type="button" className="coach-see-all" onClick={onSeeAll}>Xem tất cả</button>}
      </div>
      <div 
        className="coach-card-row"
        ref={rowRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={release}
        onMouseUp={release}
        onMouseMove={handleMouseMove}
        style={{ cursor: 'grab' }}
      >
        {children}
      </div>
    </section>
  );
}

function filterItems(items, filterId, query) {
  if (!items || !items.length) return [];
  let out = items;
  if (filterId && filterId !== 'all') {
    out = out.filter((item) => item.category === filterId);
  }
  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    out = out.filter((item) => item.title.toLowerCase().includes(q));
  }
  return out;
}

function CoachCard({ item, onClickPlay, isFavorite, onToggleFavorite }) {
  return (
    <div className="coach-card">
      <div className="coach-card-image-wrap" onClick={() => onClickPlay(item.videoUrl)}>
        {onToggleFavorite && (
          <button 
            type="button"
            className="coach-card-fav-btn"
            onClick={(e) => onToggleFavorite(e, item._id)}
            style={{ 
              position: 'absolute', top: '8px', right: '8px', zIndex: 10, 
              background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', 
              color: isFavorite ? '#ef4444' : '#fff', width: '32px', height: '32px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              transition: 'color 0.2s, transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            title={isFavorite ? "Bỏ thích" : "Yêu thích"}
          >
            <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}`} />
          </button>
        )}
        <img src={item.image || item.thumbnailUrl} alt={item.title} className="coach-card-image" style={{ cursor: 'pointer' }} />
        <span className="coach-card-play" style={{ cursor: 'pointer' }}><i className="bi bi-play-fill" /></span>
      </div>
      <h3 className="coach-card-title">{item.title}</h3>
      <p className="coach-card-meta">
        <i className="bi bi-headphones me-1" />
        {item.duration} · {item.type}
      </p>
    </div>
  );
}

function Coach() {
  const { user, setUser } = useUser();
  const [classes, setClasses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [brands, setBrands] = useState([]);
  
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [seeAllModal, setSeeAllModal] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState([]);

  // Instructor detail modal
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [instructorClasses, setInstructorClasses] = useState([]);
  const [loadingInstructorClasses, setLoadingInstructorClasses] = useState(false);

  const instructorsCarouselRef = useRef(null);
  const brandsCarouselRef = useRef(null);
  const instructorsJumpingRef = useRef(false);
  const brandsJumpingRef = useRef(false);

  useEffect(() => {
    coachService.getClasses().then(res => setClasses(res.data.data)).catch(console.error);
    coachService.getInstructors().then(res => setInstructors(res.data.data)).catch(console.error);
    coachService.getBrands().then(res => setBrands(res.data.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (user?.favoriteCoachClasses) {
      setFavoriteIds(user.favoriteCoachClasses);
    }
  }, [user]);

  const handleInstructorClick = async (inst) => {
    setSelectedInstructor(inst);
    setInstructorClasses([]);
    setLoadingInstructorClasses(true);
    try {
      const res = await coachService.getClassesByInstructor(inst._id);
      setInstructorClasses(res.data.data || []);
    } catch (err) {
      console.error('Lỗi khi tải lớp học của HLV:', err);
    } finally {
      setLoadingInstructorClasses(false);
    }
  };

  const closeInstructorModal = () => {
    setSelectedInstructor(null);
    setInstructorClasses([]);
  };

  const toggleFavorite = async (e, classId) => {
    if (e) e.stopPropagation();
    if (!user) {
      alert("Vui lòng đăng nhập để lưu danh sách yêu thích!");
      return;
    }
    try {
      let newFavs;
      if (favoriteIds.includes(classId)) {
        newFavs = favoriteIds.filter(id => id !== classId);
      } else {
        newFavs = [...favoriteIds, classId];
      }
      setFavoriteIds(newFavs); // Optimistic UI update
      setUser({ ...user, favoriteCoachClasses: newFavs }); // Optimistic context update
      await userService.updateProfile({ favoriteCoachClasses: newFavs });
    } catch (err) {
      console.error("Lỗi khi lưu danh sách yêu thích:", err);
    }
  };

  const carouselNext = (ref) => {
    if (ref?.current) ref.current.scrollBy({ left: ref.current.clientWidth, behavior: 'smooth' });
  };
  const carouselPrev = (ref) => {
    if (ref?.current) ref.current.scrollBy({ left: -ref.current.clientWidth, behavior: 'smooth' });
  };

  const setupInfiniteScroll = (elRef, jumpRef) => {
    const el = elRef?.current;
    if (!el) return;
    const total = el.scrollWidth;
    const oneCopy = total / COPIES;
    if (oneCopy <= 0) return;
    const onScroll = () => {
      if (jumpRef.current) {
        jumpRef.current = false;
        return;
      }
      const left = el.scrollLeft;
      if (left >= oneCopy * 2) {
        jumpRef.current = true;
        el.scrollLeft = left - oneCopy;
      } else if (left <= 0) {
        jumpRef.current = true;
        el.scrollLeft = left + oneCopy;
      }
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  };

  useEffect(() => {
    const el = instructorsCarouselRef.current;
    if (!el || instructors.length === 0) return;
    const init = () => {
      const oneCopy = el.scrollWidth / COPIES;
      if (oneCopy <= 0) return;
      instructorsJumpingRef.current = true;
      el.scrollLeft = oneCopy;
      instructorsJumpingRef.current = false;
    };
    init();
    const raf = requestAnimationFrame(init);
    const cleanup = setupInfiniteScroll(instructorsCarouselRef, instructorsJumpingRef);
    return () => {
      cancelAnimationFrame(raf);
      if (cleanup) cleanup();
    };
  }, [instructors.length]);

  useEffect(() => {
    const el = brandsCarouselRef.current;
    if (!el || brands.length === 0) return;
    const init = () => {
      const oneCopy = el.scrollWidth / COPIES;
      if (oneCopy <= 0) return;
      brandsJumpingRef.current = true;
      el.scrollLeft = oneCopy;
      brandsJumpingRef.current = false;
    };
    init();
    const raf = requestAnimationFrame(init);
    const cleanup = setupInfiniteScroll(brandsCarouselRef, brandsJumpingRef);
    return () => {
      cancelAnimationFrame(raf);
      if (cleanup) cleanup();
    };
  }, [brands.length]);

  const pelotonItems = classes.filter(c => c.section === 'Peloton');
  const sleepItems = classes.filter(c => c.section === 'Sleep');
  const stressItems = classes.filter(c => c.section === 'Stress');
  const fitnessItems = classes.filter(c => c.section === 'Fitness');

  const pelotonFiltered = filterItems(pelotonItems, activeFilter, searchQuery);
  const sleepFiltered = filterItems(sleepItems, activeFilter, searchQuery);
  const stressFiltered = filterItems(stressItems, activeFilter, searchQuery);
  const fitnessFiltered = filterItems(fitnessItems, activeFilter, searchQuery);

  const favoriteItemsList = filterItems(classes.filter(c => favoriteIds.includes(c._id)), 'all', searchQuery);

  const handlePlayVideo = (url) => {
    if (url) {
      setPlayingVideo(url);
    } else {
      alert("Video này chưa có liên kết hướng dẫn!");
    }
  };

  return (
    <div className="coach-page">
      <div className="coach-filters">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`coach-pill ${activeFilter === f.id ? 'coach-pill--active' : ''}`}
            onClick={() => setActiveFilter(f.id)}
          >
            <i className={`bi ${f.icon} me-2`} />
            {f.label}
          </button>
        ))}
      </div>

      <div className="coach-search-wrap">
        <i className="bi bi-search coach-search-icon" />
        <input
          type="text"
          className="coach-search-input"
          placeholder="Tìm lớp, chủ đề..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {activeFilter === 'favorites' && favoriteItemsList.length > 0 && (
        <CoachSection title="Lớp học yêu thích">
          {favoriteItemsList.map((item, i) => (
            <CoachCard key={item._id || i} item={item} onClickPlay={handlePlayVideo} isFavorite={favoriteIds.includes(item._id)} onToggleFavorite={toggleFavorite} />
          ))}
        </CoachSection>
      )}

      {activeFilter === 'favorites' && favoriteItemsList.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--fitbit-muted)' }}>
          <i className="bi bi-heart" style={{ fontSize: '3rem', marginBottom: '10px', display: 'block' }} />
          <p>Bạn chưa thêm bài tập nào vào danh sách yêu thích.</p>
        </div>
      )}

      {pelotonFiltered.length > 0 && (
        <CoachSection title="Lớp Peloton" onSeeAll={() => setSeeAllModal('Peloton')}>
          {pelotonFiltered.map((item, i) => (
            <CoachCard key={item._id || i} item={item} onClickPlay={handlePlayVideo} isFavorite={favoriteIds.includes(item._id)} onToggleFavorite={toggleFavorite} />
          ))}
        </CoachSection>
      )}

      {sleepFiltered.length > 0 && (
        <CoachSection title="Ngủ ngon hơn" onSeeAll={() => setSeeAllModal('Sleep')}>
          {sleepFiltered.map((item, i) => (
            <CoachCard key={item._id || i} item={item} onClickPlay={handlePlayVideo} isFavorite={favoriteIds.includes(item._id)} onToggleFavorite={toggleFavorite} />
          ))}
        </CoachSection>
      )}

      {stressFiltered.length > 0 && (
        <CoachSection title="Giảm căng thẳng" onSeeAll={() => setSeeAllModal('Stress')}>
          {stressFiltered.map((item, i) => (
            <CoachCard key={item._id || i} item={item} onClickPlay={handlePlayVideo} isFavorite={favoriteIds.includes(item._id)} onToggleFavorite={toggleFavorite} />
          ))}
        </CoachSection>
      )}

      {fitnessFiltered.length > 0 && (
        <CoachSection title="Tìm phong cách tập" onSeeAll={() => setSeeAllModal('Fitness')}>
          {fitnessFiltered.map((item, i) => (
            <CoachCard key={item._id || i} item={item} onClickPlay={handlePlayVideo} isFavorite={favoriteIds.includes(item._id)} onToggleFavorite={toggleFavorite} />
          ))}
        </CoachSection>
      )}

      <section className="coach-section">
        <div className="coach-section-header">
          <h2 className="coach-section-title">Huấn luyện viên</h2>
          <button type="button" className="coach-see-all" onClick={() => setSeeAllModal('instructors')}>Xem tất cả</button>
        </div>
        <div className="coach-carousel-wrap">
          <button type="button" className="coach-carousel-btn coach-carousel-btn--prev" onClick={() => carouselPrev(instructorsCarouselRef)} aria-label="Trước">
            <i className="bi bi-chevron-left" />
          </button>
          <div ref={instructorsCarouselRef} className="coach-instructor-row coach-carousel-track">
            {instructors.length > 0 && Array.from({ length: COPIES }, (_, copy) =>
              instructors.map((inst, i) => (
                <div
                  key={`inst-${copy}-${inst._id || i}`}
                  className="coach-instructor-card"
                  onClick={() => handleInstructorClick(inst)}
                  style={{ cursor: 'pointer' }}
                  title={`Xem lớp học của ${inst.name}`}
                >
                  <div className="coach-instructor-avatar-wrap">
                    <img src={inst.image} alt={inst.name} className="coach-instructor-avatar" />
                  </div>
                  <p className="coach-instructor-name">{inst.name}</p>
                  <p className="coach-instructor-role">{inst.role}</p>
                </div>
              ))
            )}
          </div>
          <button type="button" className="coach-carousel-btn coach-carousel-btn--next" onClick={() => carouselNext(instructorsCarouselRef)} aria-label="Sau">
            <i className="bi bi-chevron-right" />
          </button>
        </div>
      </section>

      <section className="coach-section">
        <div className="coach-section-header">
          <h2 className="coach-section-title">Thương hiệu</h2>
          <button type="button" className="coach-see-all" onClick={() => setSeeAllModal('brands')}>Xem tất cả</button>
        </div>
        <div className="coach-carousel-wrap">
          <button type="button" className="coach-carousel-btn coach-carousel-btn--prev" onClick={() => carouselPrev(brandsCarouselRef)} aria-label="Trước">
            <i className="bi bi-chevron-left" />
          </button>
          <div ref={brandsCarouselRef} className="coach-brand-row coach-carousel-track">
            {brands.length > 0 && Array.from({ length: COPIES }, (_, copy) =>
              brands.map((b, i) => (
                <button key={`brand-${copy}-${b._id || i}`} type="button" className="coach-brand-card">
                  <i className={`bi ${b.icon} coach-brand-icon`} />
                  <span className="coach-brand-name">{b.name}</span>
                </button>
              ))
            )}
          </div>
          <button type="button" className="coach-carousel-btn coach-carousel-btn--next" onClick={() => carouselNext(brandsCarouselRef)} aria-label="Sau">
            <i className="bi bi-chevron-right" />
          </button>
        </div>
      </section>

      {/* SEE ALL MODAL (Instructors/Brands/Classes) */}
      {seeAllModal && (
        <div className="coach-modal-overlay" onClick={() => setSeeAllModal(null)} role="presentation">
          <div className="coach-modal" onClick={(e) => e.stopPropagation()}>
            <div className="coach-modal-header">
              <h3 className="coach-modal-title">
                {seeAllModal === 'instructors' && 'Huấn luyện viên'}
                {seeAllModal === 'brands' && 'Thương hiệu'}
                {seeAllModal === 'Peloton' && 'Lớp Peloton'}
                {seeAllModal === 'Sleep' && 'Ngủ ngon hơn'}
                {seeAllModal === 'Stress' && 'Giảm căng thẳng'}
                {seeAllModal === 'Fitness' && 'Tìm phong cách tập'}
              </h3>
              <button type="button" className="coach-modal-close" onClick={() => setSeeAllModal(null)} aria-label="Đóng">
                <i className="bi bi-x-lg" />
              </button>
            </div>
            <div className="coach-modal-body">
              {seeAllModal === 'instructors' && (
                <div className="coach-modal-instructors">
                  {instructors.map((inst, i) => (
                    <div
                      key={i}
                      className="coach-instructor-card"
                      onClick={() => { setSeeAllModal(null); handleInstructorClick(inst); }}
                      style={{ cursor: 'pointer' }}
                      title={`Xem lớp học của ${inst.name}`}
                    >
                      <div className="coach-instructor-avatar-wrap">
                        <img src={inst.image} alt={inst.name} className="coach-instructor-avatar" />
                      </div>
                      <p className="coach-instructor-name">{inst.name}</p>
                      <p className="coach-instructor-role">{inst.role}</p>
                    </div>
                  ))}
                </div>
              )}
              {seeAllModal === 'brands' && (
                <div className="coach-modal-brands">
                  {brands.map((b, i) => (
                    <button key={i} type="button" className="coach-brand-card">
                      <i className={`bi ${b.icon} coach-brand-icon`} />
                      <span className="coach-brand-name">{b.name}</span>
                    </button>
                  ))}
                </div>
              )}
              {['Peloton', 'Sleep', 'Stress', 'Fitness'].includes(seeAllModal) && (
                <div className="coach-modal-classes" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '1rem 0', justifyContent: 'center' }}>
                  {seeAllModal === 'Peloton' && pelotonFiltered.map((item, i) => (
                    <CoachCard key={item._id || i} item={item} onClickPlay={handlePlayVideo} isFavorite={favoriteIds.includes(item._id)} onToggleFavorite={toggleFavorite} />
                  ))}
                  {seeAllModal === 'Sleep' && sleepFiltered.map((item, i) => (
                    <CoachCard key={item._id || i} item={item} onClickPlay={handlePlayVideo} isFavorite={favoriteIds.includes(item._id)} onToggleFavorite={toggleFavorite} />
                  ))}
                  {seeAllModal === 'Stress' && stressFiltered.map((item, i) => (
                    <CoachCard key={item._id || i} item={item} onClickPlay={handlePlayVideo} isFavorite={favoriteIds.includes(item._id)} onToggleFavorite={toggleFavorite} />
                  ))}
                  {seeAllModal === 'Fitness' && fitnessFiltered.map((item, i) => (
                    <CoachCard key={item._id || i} item={item} onClickPlay={handlePlayVideo} isFavorite={favoriteIds.includes(item._id)} onToggleFavorite={toggleFavorite} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* INSTRUCTOR DETAIL MODAL */}
      {selectedInstructor && (
        <div className="coach-modal-overlay" onClick={closeInstructorModal} role="presentation">
          <div className="coach-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', width: '90%' }}>
            <div className="coach-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
                  src={selectedInstructor.image}
                  alt={selectedInstructor.name}
                  style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--fitbit-accent, #00b4d8)' }}
                />
                <div>
                  <h3 className="coach-modal-title" style={{ marginBottom: '2px' }}>{selectedInstructor.name}</h3>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--fitbit-muted)' }}>{selectedInstructor.role}</p>
                </div>
              </div>
              <button type="button" className="coach-modal-close" onClick={closeInstructorModal} aria-label="Đóng">
                <i className="bi bi-x-lg" />
              </button>
            </div>
            <div className="coach-modal-body">
              {loadingInstructorClasses && (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--fitbit-muted)' }}>
                  <i className="bi bi-arrow-repeat" style={{ fontSize: '2rem', animation: 'spin 1s linear infinite', display: 'block', marginBottom: '8px' }} />
                  Đang tải lớp học...
                </div>
              )}
              {!loadingInstructorClasses && instructorClasses.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--fitbit-muted)' }}>
                  <i className="bi bi-calendar-x" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '10px' }} />
                  <p>Chưa có lớp học nào của huấn luyện viên này.</p>
                </div>
              )}
              {!loadingInstructorClasses && instructorClasses.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '1rem 0', justifyContent: 'center' }}>
                  {instructorClasses.map((item, i) => (
                    <CoachCard
                      key={item._id || i}
                      item={item}
                      onClickPlay={handlePlayVideo}
                      isFavorite={favoriteIds.includes(item._id)}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIDEO PLAYER MODAL */}
      {playingVideo && (
        <div className="coach-modal-overlay" style={{ zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => setPlayingVideo(null)} role="presentation">
          <div className="coach-video-modal" style={{ width: '80%', maxWidth: '800px', background: '#000', borderRadius: '12px', overflow: 'hidden', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button type="button" 
              onClick={() => setPlayingVideo(null)} 
              style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', borderRadius: '50%', width: '36px', height: '36px', zIndex: 10 }}>
              <i className="bi bi-x-lg" />
            </button>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe 
                src={playingVideo.includes('youtube') && !playingVideo.includes('autoplay') ? `${playingVideo}?autoplay=1` : playingVideo} 
                title="Video Player" 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen>
              </iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Coach;
