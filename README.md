# Kaku Jain - Portfolio Landing Page

A modern, responsive portfolio website showcasing design expertise and professional work.

## 🎨 Features

### Design & Theme
- **Color Scheme**: Green (#355E3B) and white/off-white
- **Typography**: Playfair Display for headings, Inter for body text
- **Modern Animations**: Smooth transitions, fade-ins, parallax effects
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices

### Sections

1. **Hero Section**
   - Professional introduction
   - Glide Certified Expert badge
   - Call-to-action buttons
   - Animated statistics (10+ years, 150+ projects, 50+ clients)
   - Floating cards with specialties (IT Strategy Consulting, App Design & Development, Web Design, UI/UX)

2. **About Section**
   - Professional bio
   - Location: Los Cabos, Mexico (originally from Gujarat, India)
   - Experience and certification details
   - Core expertise with skill tags
   - Interactive skill tags with hover effects

3. **Portfolio Section - Featured Industries**
   - 5 industry categories with filtering:
     - Professional Services (Law Firm, Tax Advisory)
     - Real Estate (Property Management, HOA)
     - Hospitality (Yacht Management, Restaurant)
     - Automotive (Used Car Sales)
     - Creative Services (Photography)
   - 8 industry showcases:
     1. Law Firm Management App
     2. Property Management System
     3. Yacht Management Platform
     4. HOA Management System
     5. Tax Advisory Platform
     6. Pre-Owned Vehicle Platform
     7. Photography Business Suite
     8. Restaurant Operations System
   - Hover effects revealing project details
   - Smooth filtering animations

4. **Testimonials Section**
   - 4 dummy reviews with 5-star ratings
   - Auto-sliding carousel
   - Manual navigation with prev/next buttons
   - Dot indicators for navigation
   - Client avatars and company information

5. **Contact Section**
   - Contact form (name, email, subject, message)
   - Phone number: +52 123 455 4321
   - Office location: Los Cabos, Mexico
   - Social media profiles:
     - LinkedIn
     - Behance
     - Dribbble
     - Instagram
     - Twitter
     - GitHub
   - Interactive form with validation

6. **Footer**
   - Quick links navigation
   - Contact information
   - Social media links
   - Copyright information

### Interactive Features

- **Sticky Navigation**: Fixed top menu with active section highlighting
- **Smooth Scrolling**: Animated scroll to sections
- **Mobile Menu**: Hamburger menu for responsive navigation
- **Portfolio Filter**: Dynamic filtering by category
- **Testimonials Slider**: Auto-play carousel with manual controls
- **Scroll-to-Top Button**: Appears after scrolling down
- **Intersection Observer**: Elements animate when scrolling into view
- **Parallax Effects**: Subtle parallax on hero section
- **Stats Counter**: Animated counting on scroll
- **Form Validation**: Client-side form validation

## 🚀 Getting Started

### Opening the Portfolio

Simply open `index.html` in your web browser:

```bash
open index.html
```

Or use a local development server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000` in your browser.

## 📁 File Structure

```
Portfolio/
├── index.html          # Main HTML structure
├── styles.css          # All styling and animations
├── script.js           # Interactive functionality
└── README.md           # This file
```

## 🎯 Best Practices Implemented

### Performance
- Optimized CSS with CSS variables for theming
- Minimal JavaScript for better performance
- Lazy loading images through CDN
- Efficient animations using CSS transforms

### Accessibility
- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- High contrast ratios for text readability
- Alt text for all images

### SEO
- Meta descriptions
- Semantic HTML5 elements
- Proper heading hierarchy
- Descriptive links and buttons

### User Experience
- Mobile-first responsive design
- Touch-friendly interactive elements
- Clear visual hierarchy
- Consistent spacing and alignment
- Loading states and transitions

### Code Quality
- Clean, organized CSS with comments
- Modular JavaScript functions
- Consistent naming conventions
- Browser compatibility

## 🔧 Customization

### Updating Colors
The color scheme is managed through CSS variables in `styles.css`:

```css
:root {
    --primary-green: #355E3B;
    --light-green: #4a7a52;
    --dark-green: #2a4a2f;
    /* ... more variables */
}
```

### Adding Real Projects
Replace placeholder images in the portfolio section by updating the `src` attributes in `index.html`.

### Connecting Contact Form
Currently, the form logs data to console. To connect it to a backend:

1. Update the form submission handler in `script.js`
2. Add your API endpoint
3. Implement server-side validation

Example:
```javascript
fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
});
```

### Updating Social Media Links
Update the `href` attributes in the social media sections with your actual profile URLs.

## 📱 Responsive Breakpoints

- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: Below 768px
- **Small Mobile**: Below 480px

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 To-Do List

- [ ] Replace placeholder images with real project images
- [ ] Add actual social media profile links
- [ ] Connect contact form to backend/email service
- [ ] Add real project case studies
- [ ] Implement analytics tracking
- [ ] Add blog section (optional)
- [ ] Create custom 404 page
- [ ] Add favicon
- [ ] Optimize images for web

## 💡 Tips

1. **Images**: Use WebP format for better compression
2. **Performance**: Consider adding a service worker for offline access
3. **Analytics**: Add Google Analytics or similar for tracking
4. **Email**: Use services like Formspree, EmailJS, or Netlify Forms for form handling
5. **Hosting**: Deploy on Netlify, Vercel, or GitHub Pages for free hosting

## 📧 Contact Information

- **Name**: Kaku Jain
- **Organization**: Duplica
- **Location**: Gujarat, India
- **Service Areas**: USA & Mexico
- **Phone**: +52 123 455 4321
- **Email**: kaku@duplica.co
- **Experience**: 10+ years (a decade) in design
- **Certification**: Glide Certified Expert
- **Specialization**: Web & App Design

---

Built with ❤️ using HTML, CSS, and JavaScript
