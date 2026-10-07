import styles from './profile.module.css';

export default function ProfilePage() {
  const highlights = ['Testimonials', 'Pricing', 'How it Works', 'FAQ', 'Team'];
  const posts = [1, 2, 3, 4, 5, 6];

  return (
    <div className={styles.container}>
      <nav className={styles.sidebar}>
        <div className={styles.logo}>TicketAI</div>
        <div className={styles.navLinks}>
          <a href="#">Home</a>
          <a href="#">Search</a>
          <a href="#">Explore</a>
          <a href="#">Notifications</a>
          <a href="#">Profile</a>
        </div>
      </nav>

      <main className={styles.mainContent}>
        <header className={styles.profileHeader}>
          <div className={styles.profileAvatarContainer}>
            <div className={styles.storyRing}>
              <img src="https://i.pravatar.cc/300?img=11" alt="Profile" className={styles.profileAvatar} />
            </div>
          </div>

          <section className={styles.profileInfo}>
            <div className={styles.profileActions}>
              <h1 className={styles.username}>
                ulisses.bezerradasilva
                <svg className={styles.verified} width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              </h1>
              <button className={styles.btnPrimary}>Message</button>
              <button className={styles.btnSecondary}>Book Now</button>
            </div>

            <ul className={styles.stats}>
              <li><strong>319</strong> posts</li>
              <li><strong>837</strong> followers</li>
              <li><strong>5,223</strong> following</li>
            </ul>

            <div className={styles.bio}>
              <h2>Ulisses Bezerra da Silva</h2>
              <p>Personal blog &amp; Creative Direction</p>
              <p>64 Markmanor Av, London, UK</p>
              <a href="#" className={styles.websiteLink}>ulisses.bezerradasilva.com</a>
            </div>
          </section>
        </header>

        <section className={styles.highlights}>
          {highlights.map((title, i) => (
            <div key={i} className={styles.highlightItem}>
              <div className={styles.highlightCircle}>
                <img src={'https://i.pravatar.cc/150?img=' + (i + 1)} alt={title} />
              </div>
              <span>{title}</span>
            </div>
          ))}
        </section>

        <div className={styles.contentTabs}>
          <div className={styles.tab + ' ' + styles.tabActive}>POSTS</div>
          <div className={styles.tab}>REELS</div>
          <div className={styles.tab}>SAVED</div>
          <div className={styles.tab}>TAGGED</div>
        </div>

        <div className={styles.photoGrid}>
          {posts.map((item) => (
            <div key={item} className={styles.gridItem}>
              <img src={'https://picsum.photos/400/400?random=' + item} alt="Post" />
              <div className={styles.overlay}>
                <span>Likes: {100 * item}</span>
                <span>Comments: {10 * item}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
