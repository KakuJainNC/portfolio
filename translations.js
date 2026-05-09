// Translation data for English and Spanish
const translations = {
    en: {
        // Navigation
        'header.name': 'Kaku Jain',
        'nav.home': 'Home',
        'nav.about': 'About',
        'nav.portfolio': 'Portfolio',
        'nav.testimonials': 'Testimonials',
        'nav.contact': 'Contact',
        
        // Hero Section
        'hero.badge': 'UX-Led Builder',
        'hero.title1': 'A decade designing and building digital products.',
        'hero.title2': 'Now AI-augmented.',
        'hero.title3': '',
        'hero.description': 'Brand sites, web apps, software. Built for international clients.',
        'hero.cta1': 'View My Work',
        'hero.cta2': 'Get In Touch',
        'hero.stat1': 'Years Experience',
        'hero.stat2': 'Projects Completed',
        'hero.stat3': 'Happy Clients',
        'hero.scroll': 'Scroll',
        
        // Floating Cards
        'card1': 'IT Strategy Consulting',
        'card2': 'App Design & Development',
        'card3': 'Web Design',
        'card4': 'UI/UX',
        
        // About Section
        'about.tag': 'Get To Know Me',
        'about.title': 'About Me',
        'about.subtitle': 'Designer, Builder, UX Strategist',
        'about.p1': 'A decade of design work for clients across the US, Mexico, and India — UX research, interface design, and shipping real products end-to-end. I work for Duplica as part of a multilingual team serving international markets.',
        'about.p2': 'Today, I do more than design — I build. AI-augmented workflows let me deliver brand sites, web apps, landing pages, and full software products without the traditional design-to-engineering handoff. UX comes first, build follows immediately, all from the same desk in Gujarat, India.',
        'about.basedin.title': 'Based in',
        'about.basedin.value': 'Gujarat, India',
        'about.reach.title': 'Working with',
        'about.reach.value': 'US, Mexico & India',
        'about.languages.title': 'Localized for',
        'about.languages.value': 'English, Spanish, Hindi, Marathi',
        'about.skills.title': 'Core Expertise',
        
        // Portfolio Section
        'portfolio.tag': 'My Work',
        'portfolio.title': 'Featured Industries',
        'portfolio.description': "Discover the diverse industries I've had the privilege to work with",
        'portfolio.filter.all': 'All Industries',
        'portfolio.filter.professional': 'Professional Services',
        'portfolio.filter.realestate': 'Real Estate',
        'portfolio.filter.hospitality': 'Hospitality',
        'portfolio.filter.automotive': 'Automotive',
        'portfolio.filter.creative': 'Creative Services',
        
        // Portfolio Items
        'portfolio.law.title': 'Law Firm Management',
        'portfolio.law.desc': 'Complete legal practice management solution',
        'portfolio.law.tag1': 'Legal',
        'portfolio.law.tag2': 'App Development',
        
        'portfolio.property.title': 'Property Management System',
        'portfolio.property.desc': 'Streamlined property operations and tenant management',
        'portfolio.property.tag1': 'Real Estate',
        'portfolio.property.tag2': 'Management',
        
        'portfolio.yacht.title': 'Yacht Management Platform',
        'portfolio.yacht.desc': 'Luxury yacht operations and booking system',
        'portfolio.yacht.tag1': 'Hospitality',
        'portfolio.yacht.tag2': 'Luxury Services',
        
        'portfolio.hoa.title': 'HOA Management System',
        'portfolio.hoa.desc': 'Homeowner association communication and operations',
        'portfolio.hoa.tag1': 'Community',
        'portfolio.hoa.tag2': 'Management',
        
        'portfolio.tax.title': 'Tax Advisory Platform',
        'portfolio.tax.desc': 'Comprehensive tax planning and advisory solutions',
        'portfolio.tax.tag1': 'Finance',
        'portfolio.tax.tag2': 'Advisory',
        
        'portfolio.car.title': 'Pre-Owned Vehicle Platform',
        'portfolio.car.desc': 'Digital marketplace for used car sales',
        'portfolio.car.tag1': 'Automotive',
        'portfolio.car.tag2': 'E-commerce',
        
        'portfolio.photo.title': 'Photography Business Suite',
        'portfolio.photo.desc': 'Complete solution for photography professionals',
        'portfolio.photo.tag1': 'Creative',
        'portfolio.photo.tag2': 'Portfolio',
        
        'portfolio.restaurant.title': 'Restaurant Operations System',
        'portfolio.restaurant.desc': 'End-to-end restaurant management and POS solution',
        'portfolio.restaurant.tag1': 'Hospitality',
        'portfolio.restaurant.tag2': 'Operations',
        
        // Testimonials Section
        'testimonials.tag': 'Client Feedback',
        'testimonials.title': 'What Clients Say',
        
        'testimonial1.text': "Kaku's design expertise transformed our app completely. His attention to detail and understanding of user experience is exceptional. The project was delivered on time and exceeded all our expectations.",
        'testimonial1.name': 'Sarah Martinez',
        'testimonial1.position': 'CEO, TechVision Inc.',
        
        'testimonial2.text': 'Working with Kaku was a game-changer for our brand. His creative vision and technical skills brought our ideas to life in ways we couldn\'t imagine. Highly recommend!',
        'testimonial2.name': 'Michael Chen',
        'testimonial2.position': 'Founder, GreenLeaf Studios',
        
        'testimonial3.text': 'As a Glide Certified Expert, Kaku not only delivered outstanding designs but also educated our team on best practices. His professionalism and expertise are unmatched.',
        'testimonial3.name': 'Emily Rodriguez',
        'testimonial3.position': 'Marketing Director, Innovate Digital',
        
        'testimonial4.text': "Kaku's ability to understand our business needs and translate them into beautiful, functional designs is remarkable. He's become our go-to designer for all projects.",
        'testimonial4.name': 'David Thompson',
        'testimonial4.position': 'Product Manager, CloudSync',
        
        // Contact Section
        'contact.tag': "Let's Connect",
        'contact.title': 'Get In Touch',
        'contact.description': 'Have a project in mind? Serving clients across the USA and Mexico',
        'contact.info.title': 'Contact Information',
        'contact.info.subtitle': 'Feel free to reach out through any of these channels',
        'contact.location.title': 'Office Location',
        'contact.location.value': 'Gujarat, India\nServing USA & Mexico',
        'contact.phone.title': 'Phone Number',
        'contact.email.title': 'Email Address',
        'contact.social.title': 'Follow Me',
        
        // Contact Form
        'form.name.label': 'Your Name',
        'form.name.placeholder': 'John Doe',
        'form.email.label': 'Your Email',
        'form.email.placeholder': 'john@example.com',
        'form.subject.label': 'Subject',
        'form.subject.placeholder': 'Project Inquiry',
        'form.message.label': 'Your Message',
        'form.message.placeholder': 'Tell me about your project...',
        'form.submit': 'Send Message',
        
        // Footer
        'footer.name': 'Kaku Jain',
        'footer.tagline': 'Crafting digital experiences that inspire and engage.',
        'footer.links.title': 'Quick Links',
        'footer.contact.title': 'Get In Touch',
        'footer.copyright': '© 2026 Kaku Jain. All rights reserved.',
        'footer.badge': 'Glide Certified Expert | Duplica',
        
        // Skills
        'skill.uxstrategy': 'UX Strategy',
        'skill.productdesign': 'Product Design',
        'skill.aiengineering': 'AI-Augmented Engineering',
        'skill.designsystems': 'Design Systems',
    },
    
    es: {
        // Navigation
        'header.name': 'Kaku Jain',
        'nav.home': 'Inicio',
        'nav.about': 'Acerca de',
        'nav.portfolio': 'Portafolio',
        'nav.testimonials': 'Testimonios',
        'nav.contact': 'Contacto',
        
        // Hero Section
        'hero.badge': 'Diseñador y Constructor UX',
        'hero.title1': 'Una década diseñando y construyendo productos digitales.',
        'hero.title2': 'Ahora con IA.',
        'hero.title3': '',
        'hero.description': 'Sitios de marca, aplicaciones web, software. Construido para clientes internacionales.',
        'hero.cta1': 'Ver Mi Trabajo',
        'hero.cta2': 'Contáctame',
        'hero.stat1': 'Años de Experiencia',
        'hero.stat2': 'Proyectos Completados',
        'hero.stat3': 'Clientes Satisfechos',
        'hero.scroll': 'Desplazar',
        
        // Floating Cards
        'card1': 'Consultoría de Estrategia TI',
        'card2': 'Diseño y Desarrollo de Apps',
        'card3': 'Diseño Web',
        'card4': 'UI/UX',
        
        // About Section
        'about.tag': 'Conóceme',
        'about.title': 'Acerca de Mí',
        'about.subtitle': 'Diseñador, Constructor, Estratega UX',
        'about.p1': 'Una década de trabajo de diseño para clientes en EE.UU., México e India — investigación UX, diseño de interfaces y entrega de productos reales de extremo a extremo. Trabajo para Duplica como parte de un equipo multilingüe que sirve mercados internacionales.',
        'about.p2': 'Hoy, hago más que diseñar — construyo. Los flujos de trabajo aumentados con IA me permiten entregar sitios de marca, aplicaciones web, landing pages y productos de software completos sin la tradicional transferencia entre diseño e ingeniería. UX primero, construcción inmediata, todo desde el mismo escritorio en Gujarat, India.',
        'about.basedin.title': 'Ubicado en',
        'about.basedin.value': 'Gujarat, India',
        'about.reach.title': 'Trabajando con',
        'about.reach.value': 'EE.UU., México e India',
        'about.languages.title': 'Localizado en',
        'about.languages.value': 'Inglés, Español, Hindi, Marathi',
        'about.skills.title': 'Experiencia Principal',
        
        // Portfolio Section
        'portfolio.tag': 'Mi Trabajo',
        'portfolio.title': 'Industrias Destacadas',
        'portfolio.description': 'Descubre las diversas industrias con las que he tenido el privilegio de trabajar',
        'portfolio.filter.all': 'Todas las Industrias',
        'portfolio.filter.professional': 'Servicios Profesionales',
        'portfolio.filter.realestate': 'Bienes Raíces',
        'portfolio.filter.hospitality': 'Hospitalidad',
        'portfolio.filter.automotive': 'Automotriz',
        'portfolio.filter.creative': 'Servicios Creativos',
        
        // Portfolio Items
        'portfolio.law.title': 'Gestión de Bufete de Abogados',
        'portfolio.law.desc': 'Solución completa de gestión de práctica legal',
        'portfolio.law.tag1': 'Legal',
        'portfolio.law.tag2': 'Desarrollo de Apps',
        
        'portfolio.property.title': 'Sistema de Gestión de Propiedades',
        'portfolio.property.desc': 'Operaciones de propiedades simplificadas y gestión de inquilinos',
        'portfolio.property.tag1': 'Bienes Raíces',
        'portfolio.property.tag2': 'Gestión',
        
        'portfolio.yacht.title': 'Plataforma de Gestión de Yates',
        'portfolio.yacht.desc': 'Operaciones de yates de lujo y sistema de reservas',
        'portfolio.yacht.tag1': 'Hospitalidad',
        'portfolio.yacht.tag2': 'Servicios de Lujo',
        
        'portfolio.hoa.title': 'Sistema de Gestión HOA',
        'portfolio.hoa.desc': 'Comunicación y operaciones de asociación de propietarios',
        'portfolio.hoa.tag1': 'Comunidad',
        'portfolio.hoa.tag2': 'Gestión',
        
        'portfolio.tax.title': 'Plataforma de Asesoría Fiscal',
        'portfolio.tax.desc': 'Soluciones integrales de planificación y asesoría fiscal',
        'portfolio.tax.tag1': 'Finanzas',
        'portfolio.tax.tag2': 'Asesoría',
        
        'portfolio.car.title': 'Plataforma de Vehículos Usados',
        'portfolio.car.desc': 'Mercado digital para venta de autos usados',
        'portfolio.car.tag1': 'Automotriz',
        'portfolio.car.tag2': 'Comercio Electrónico',
        
        'portfolio.photo.title': 'Suite de Negocio Fotográfico',
        'portfolio.photo.desc': 'Solución completa para profesionales de fotografía',
        'portfolio.photo.tag1': 'Creativo',
        'portfolio.photo.tag2': 'Portafolio',
        
        'portfolio.restaurant.title': 'Sistema de Operaciones de Restaurante',
        'portfolio.restaurant.desc': 'Gestión integral de restaurante y solución POS',
        'portfolio.restaurant.tag1': 'Hospitalidad',
        'portfolio.restaurant.tag2': 'Operaciones',
        
        // Testimonials Section
        'testimonials.tag': 'Opiniones de Clientes',
        'testimonials.title': 'Lo Que Dicen los Clientes',
        
        'testimonial1.text': 'La experiencia en diseño de Kaku transformó completamente nuestra aplicación. Su atención al detalle y comprensión de la experiencia del usuario es excepcional. El proyecto se entregó a tiempo y superó todas nuestras expectativas.',
        'testimonial1.name': 'Sarah Martínez',
        'testimonial1.position': 'CEO, TechVision Inc.',
        
        'testimonial2.text': 'Trabajar con Kaku fue un cambio radical para nuestra marca. Su visión creativa y habilidades técnicas dieron vida a nuestras ideas de maneras que no podíamos imaginar. ¡Altamente recomendado!',
        'testimonial2.name': 'Michael Chen',
        'testimonial2.position': 'Fundador, GreenLeaf Studios',
        
        'testimonial3.text': 'Como Experto Certificado de Glide, Kaku no solo entregó diseños sobresalientes sino que también educó a nuestro equipo sobre las mejores prácticas. Su profesionalismo y experiencia son incomparables.',
        'testimonial3.name': 'Emily Rodríguez',
        'testimonial3.position': 'Directora de Marketing, Innovate Digital',
        
        'testimonial4.text': 'La capacidad de Kaku para comprender nuestras necesidades comerciales y traducirlas en diseños hermosos y funcionales es notable. Se ha convertido en nuestro diseñador de confianza para todos los proyectos.',
        'testimonial4.name': 'David Thompson',
        'testimonial4.position': 'Gerente de Producto, CloudSync',
        
        // Contact Section
        'contact.tag': 'Conectemos',
        'contact.title': 'Contáctame',
        'contact.description': '¿Tienes un proyecto en mente? Atendiendo clientes en Estados Unidos y México',
        'contact.info.title': 'Información de Contacto',
        'contact.info.subtitle': 'No dudes en comunicarte a través de cualquiera de estos canales',
        'contact.location.title': 'Ubicación de Oficina',
        'contact.location.value': 'Gujarat, India\nAtendiendo EE.UU. y México',
        'contact.phone.title': 'Número de Teléfono',
        'contact.email.title': 'Correo Electrónico',
        'contact.social.title': 'Sígueme',
        
        // Contact Form
        'form.name.label': 'Tu Nombre',
        'form.name.placeholder': 'Juan Pérez',
        'form.email.label': 'Tu Correo',
        'form.email.placeholder': 'juan@ejemplo.com',
        'form.subject.label': 'Asunto',
        'form.subject.placeholder': 'Consulta de Proyecto',
        'form.message.label': 'Tu Mensaje',
        'form.message.placeholder': 'Cuéntame sobre tu proyecto...',
        'form.submit': 'Enviar Mensaje',
        
        // Footer
        'footer.name': 'Kaku Jain',
        'footer.tagline': 'Creando experiencias digitales que inspiran y cautivan.',
        'footer.links.title': 'Enlaces Rápidos',
        'footer.contact.title': 'Contáctame',
        'footer.copyright': '© 2026 Kaku Jain. Todos los derechos reservados.',
        'footer.badge': 'Experto Certificado de Glide | Duplica',
        
        // Skills
        'skill.uxstrategy': 'Estrategia UX',
        'skill.productdesign': 'Diseño de Producto',
        'skill.aiengineering': 'Ingeniería Aumentada con IA',
        'skill.designsystems': 'Sistemas de Diseño',
    }
};
