// App.jsx
import { useState, useEffect } from 'react';
import './index.css';

function App() {
  // --- STATE MANAGEMENT ---
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // --- IMAGES DATA ---
  // Ensure these filenames match exactly what you put in the "public" folder
  const galleryImages = [
    { src: "/food-1.jpg", title: "Signature Dish", desc: "Culinary perfection.", class: "" },
    { src: "/food-2.jpg", title: "Tall Refreshment", desc: "Ice cold delight.", class: "tall" },
    { src: "/DSCF6645.jpg", title: "Espresso Pour", desc: "Hot meets cold.", class: "tall" },
    { src: "/DSC08931(1).jpg", title: "Barista Skills", desc: "Perfect latte art.", class: "" },
    { src: "/DSC09151.jpg", title: "Loaded Fries", desc: "Cheesy indulgence.", class: "wide" },
    { src: "/DSC09169.jpg", title: "Summer Chill", desc: "Refreshing blend.", class: "" },
    { src: "/DSC09032.jpg", title: "The Dipper", desc: "Spice and crunch.", class: "big" },
    { src: "/DSC09108.jpg", title: "Sweet Tooth", desc: "Caramel drizzle.", class: "" },
    { src: "/DSC09099(1).jpg", title: "Gourmet Toast", desc: "Savory toppings.", class: "wide" },
  ];

  // --- EFFECTS ---
  // Simulate loading screen
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // --- HANDLERS ---
  const openLightbox = (img) => {
    setSelectedImage(img);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden'; // Stop scrolling
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  return (
    <>
      {/* LOADER */}
      <div className={`loader ${loading ? '' : 'hidden'}`}>
        <div className="loader-content">
          <h2>Loading Gallery...</h2>
        </div>
      </div>

      {/* NAVBAR */}
      <nav>
        <a href="#" className="logo">
          {/* Ensure Layer4.png is in your public folder */}
          <img src="/Layer4.png" alt="TTB Logo" />
        </a>
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li><a href="#">Home</a></li>
          <li><a href="#">Menu</a></li>
          <li><a href="#" style={{ color: 'var(--accent)' }}>Order Now</a></li>
        </ul>
      </nav>

      {/* HEADER */}
      <header className="page-header">
        <h1 className="main-title">A Visual Feast</h1>
        <p className="subtitle">The Art of Brunch & Vibes</p>
      </header>

      {/* GALLERY GRID */}
      <section className="gallery-section">
        <div className="gallery-grid">
          {galleryImages.map((img, index) => (
            <div
              key={index}
              className={`gallery-item ${img.class}`}
              onClick={() => openLightbox(img)}
            >
              <img src={img.src} alt={img.title} />
              <div className="overlay">
                <h3>{img.title}</h3>
                <p>{img.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LIGHTBOX */}
      {lightboxOpen && selectedImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <span className="close-btn" onClick={closeLightbox}>&times;</span>
          <img
            src={selectedImage.src}
            alt={selectedImage.title}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
          />
          <div className="lightbox-caption">
            <h3>{selectedImage.title}</h3>
            <p>{selectedImage.desc}</p>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer>
        <h3>Visit Us</h3>
        <p>6/46 Green Lanka Towers, Nawam Mawatha, Colombo</p>
        <p>© 2025 The Traveling Bruncher.</p>
      </footer>
    </>
  );
}

export default App;