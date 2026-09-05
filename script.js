const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const panels = document.querySelectorAll('.tab-panel');
const navLinks = document.querySelectorAll('[data-tab-link]');

// Relaciona cada pestaña con los bloques de contenido que debe mostrar.
const panelGroups = {
  inicio: ['.hero', '.intro-band'],
  propuesta: ['.hub', '.proposal', '.foundations', '.academic'],
  metodologia: ['.method', '.impact'],
  podcast: ['.podcast'],
  recursos: ['.resources'],
  participa: ['.participate'],
};

Object.entries(panelGroups).forEach(([panelId, selectors]) => {
  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((panel) => {
      panel.classList.add('tab-panel');
      panel.dataset.panel = panelId;
    });
  });
});

function openPanel(panelId) {
  document.querySelectorAll('.tab-panel').forEach((panel) => {
    panel.classList.toggle('active', panel.dataset.panel === panelId);
  });
  document.querySelectorAll('.desktop-nav a').forEach((link) => {
    link.classList.toggle('is-active', link.dataset.tabLink === panelId);
  });
  const target = document.querySelector(`[data-panel="${panelId}"]`);
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// La portada es la vista inicial y conserva su contenido al cargar.
openPanel('inicio');

// Mantiene visible el estado de la barra al desplazarse.
window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 20);
}, { passive: true });

// Activa una pestaña y cierra el menu movil despues de elegir una ruta.
navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    openPanel(link.dataset.tabLink);
    mobileMenu.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});

// Abre y cierra la navegacion movil accesible.
menuButton.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('is-open');
  document.body.classList.toggle('menu-open', isOpen);
  menuButton.setAttribute('aria-expanded', String(isOpen));
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
});

// Selector de rutas para estudiante, docente y funcionario.
const routeCards = document.querySelectorAll('[data-route]');
const routeDetails = document.querySelectorAll('[data-route-detail]');
routeCards.forEach((card) => {
  card.addEventListener('click', () => {
    routeCards.forEach((item) => item.classList.toggle('active', item === card));
    routeDetails.forEach((detail) => detail.classList.toggle('active', detail.dataset.routeDetail === card.dataset.route));
  });
});

// Asistente contextual y respuestas frecuentes del proyecto.
const chatToggle = document.querySelector('.chat-toggle');
const chatWindow = document.querySelector('.chat-window');
const chatMessages = document.querySelector('.chat-messages');
const chatForm = document.querySelector('.chat-form');
const chatInput = chatForm.querySelector('input');
const answers = [
  { keys: ['redcrea', 'red crea', 'proyecto', 'objetivo'], answer: 'RedCREA es una estrategia de comunicación phygital para conectar el campus de UNIAJC con sus plataformas digitales. Su objetivo es que la comunidad encuentre información clara, verificable y útil en el momento en que la necesita, y que además pueda responder, participar y proponer mejoras. La experiencia combina rutas por público, audio, video, QR, contenidos visuales y un asistente conversacional.' },
  { keys: ['problema', 'reto', 'desinformación', 'desinformacion'], answer: 'El reto central es la fragmentación de la información institucional. Aunque existen web, redes, repositorios y canales internos, la comunidad puede no saber cuál consultar, cómo verificar una respuesta o a quién acudir. RedCREA propone ordenar esos puntos de entrada alrededor de un núcleo común y adaptar el mensaje a cada público sin perder coherencia.' },
  { keys: ['phygital', 'físico', 'fisico', 'digital'], answer: 'Phygital une la experiencia física y digital. En este proyecto, un aviso, una pantalla, un código QR o una conversación en el campus pueden llevar a una ruta web, un podcast, un video o una respuesta del asistente. La idea no es sumar canales por moda, sino hacer que todos conduzcan a información consistente y fácil de entender.' },
  { keys: ['reglamento', 'trámite', 'tramite', 'ruta de atención', 'servicio'], answer: 'La propuesta organiza reglamentos, trámites y rutas de atención en contenidos breves, verificables y segmentados por público. Una persona debería poder reconocer qué necesita resolver, encontrar el canal responsable, entender los pasos y saber qué hacer si la primera respuesta no es suficiente. El chatbot sirve como orientación inicial, no reemplaza los canales oficiales.' },
  { keys: ['docente', 'profesor', 'aula', 'moodle', 'miro', 'clase'], answer: 'La ruta docente está pensada para quienes necesitan comunicar, enseñar y colaborar en entornos híbridos. Incluye guías para aulas y pantallas interactivas, recursos como Moodle y Miro, laboratorios de prototipado y espacios de co-creación pedagógica. La estrategia puede ayudar a convertir información dispersa en materiales que se entiendan y se puedan reutilizar con los estudiantes.' },
  { keys: ['funcionario', 'administrativo', 'dependencia', 'directorio', 'proceso'], answer: 'La ruta de funcionarios ayuda a ordenar procesos, responsabilidades y puntos de contacto. Permite pensar quién actualiza cada contenido, cómo se deriva una consulta, qué dependencia responde y qué métricas muestran si la información realmente está llegando. Es una ruta interna para que la institución pueda hablar con mayor coordinación hacia afuera.' },
  { keys: ['estudiante', 'estudiantes', 'podcast', 'logro', 'campus'], answer: 'La ruta estudiante reúne trámites, vida universitaria y contenidos de orientación. Puede incluir la Misión de Iniciación para explorar el reglamento, rutas de atención, logros de la comunidad y micro-podcasts sobre fechas o procesos. Está diseñada para responder preguntas concretas sin perder el sentido de pertenencia y la conexión con el campus.' },
  { keys: ['particip', 'co-cre', 'cocre', 'tema', 'voz'], answer: 'La participación ocurre cuando la comunidad comparte dudas, propone formatos y prueba las rutas antes de que se implementen. El Toolkit 3C resume ese enfoque: Conectar con las personas, Comprender sus necesidades y Co-crear respuestas. Por eso la estrategia no trata a la audiencia como receptora pasiva, sino como parte del diseño de la comunicación.' },
  { keys: ['metodología', 'metodologia', 'design thinking', 'archer', 'investigación', 'diagnóstico'], answer: 'El proyecto combina un enfoque mixto y participativo con investigación-acción, Design Thinking y la metodología proyectual de Bruce Archer. Primero se diagnostican canales y fricciones; después se escuchan los públicos, se diseñan rutas, se prototipan mensajes y se ajustan con la comunidad. El proceso permite validar la utilidad de una pieza antes de convertirla en un recurso institucional.' },
  { keys: ['indicador', 'métrica', 'metrica', 'impacto', 'evaluar', 'medir'], answer: 'El impacto puede revisarse en cuatro dimensiones: claridad para encontrar y comprender información; confianza en los canales institucionales; participación en consultas, co-creación y ciudadanía digital; y pertenencia a la universidad. También conviene observar resolución de consultas, uso de rutas, tiempo de respuesta y percepción de los públicos, no solo cantidad de publicaciones.' },
  { keys: ['video', 'youtube', 'galería', 'galeria', 'imagen', 'recursos'], answer: 'La pestaña Recursos reúne formatos que amplían la explicación: un reproductor de video, imágenes institucionales de UNIAJC, modales de contexto y una galería interactiva. Puedes explorar las tarjetas para abrir información adicional y usar el campo de YouTube cuando el enlace del video esté disponible.' },
  { keys: ['autores', 'autoras', 'lina', 'laura'], answer: 'El proyecto fue desarrollado por Laura Isabel Guevara Martínez y Lina María Cortés Cardona para la Maestría en Comunicación Digital de la Universidad Autónoma de Occidente, 2025. La propuesta se centra en la comunidad universitaria de la Institución Universitaria Antonio José Camacho.' },
];

// Renderiza mensajes del usuario y del asistente en la ventana de chat.
function addChatMessage(text, type) {
  const message = document.createElement('p');
  message.className = `${type}-message`;
  message.textContent = text;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function answerQuestion(question) {
  const normalized = question.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const match = answers.find((item) => item.keys.some((key) => normalized.includes(key.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''))));
  return match ? match.answer : 'Puedo ayudarte a interpretar cualquier parte de esta página: la propuesta, el reto institucional, las rutas de estudiante, docente y funcionario, la metodología, los podcasts, el video, la galería, la participación o los indicadores. Pregúntame qué significa una sección, para quién sirve, cómo se usaría o qué relación tiene con la estrategia y te lo explico paso a paso.';
}

function askChat(question) {
  if (!question.trim()) return;
  addChatMessage(question, 'user');
  addChatMessage(answerQuestion(question), 'bot');
  chatInput.value = '';
}

chatToggle.addEventListener('click', () => {
  const isOpen = chatWindow.classList.toggle('is-open');
  chatToggle.setAttribute('aria-expanded', String(isOpen));
  chatWindow.setAttribute('aria-hidden', String(!isOpen));
});
chatForm.addEventListener('submit', (event) => { event.preventDefault(); askChat(chatInput.value); });
document.querySelectorAll('[data-chat-question]').forEach((button) => {
  button.addEventListener('click', () => {
    chatWindow.classList.add('is-open');
    chatToggle.setAttribute('aria-expanded', 'true');
    chatWindow.setAttribute('aria-hidden', 'false');
    askChat(button.dataset.chatQuestion);
  });
});

// Controles de reproducción para las piezas de audio del proyecto.
const playerCards = document.querySelectorAll('[data-player]');
const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '0:00';
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
};

playerCards.forEach((card) => {
  const audio = card.querySelector('audio');
  const playButton = card.querySelector('[data-action="play"]');
  const progress = card.querySelector('input[type="range"]');
  const currentTime = card.querySelector('.current-time');
  const duration = card.querySelector('.duration');

  playButton.addEventListener('click', () => {
    playerCards.forEach((otherCard) => {
      const otherAudio = otherCard.querySelector('audio');
      if (otherCard !== card) {
        otherAudio.pause();
        otherCard.querySelector('[data-action="play"]').textContent = '▶';
      }
    });
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  });

  card.querySelector('[data-action="back"]').addEventListener('click', () => { audio.currentTime = Math.max(0, audio.currentTime - 15); });
  card.querySelector('[data-action="forward"]').addEventListener('click', () => { audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 15); });
  progress.addEventListener('input', () => { audio.currentTime = (progress.value / 100) * audio.duration; });
  audio.addEventListener('loadedmetadata', () => { duration.textContent = formatTime(audio.duration); });
  audio.addEventListener('timeupdate', () => {
    currentTime.textContent = formatTime(audio.currentTime);
    progress.value = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  });
  audio.addEventListener('play', () => { playButton.textContent = 'Ⅱ'; });
  audio.addEventListener('pause', () => { playButton.textContent = '▶'; });
  audio.addEventListener('ended', () => { progress.value = 0; });
});

// Modales de contexto para ampliar la información sin sacar al usuario de la pestaña.
const infoModal = document.querySelector('[data-info-modal]');
const modalTitle = infoModal.querySelector('[data-modal-title]');
const modalText = infoModal.querySelector('[data-modal-text]');
const modalVisual = infoModal.querySelector('[data-modal-visual]');
const modalContent = {
  phygital: ['¿Qué hace phygital?', 'Phygital conecta los espacios físicos del campus con experiencias digitales: un QR, una pantalla o una conversación pueden llevar a la misma información clara y verificable.', ''],
  interaccion: ['¿Cómo usar esta experiencia?', 'Explora las pestañas, selecciona una ruta, abre las tarjetas y reproduce los audios. Cada interacción revela una parte distinta del ecosistema RedCREA.', ''],
  campus: ['Campus que conecta', 'La imagen institucional de UNIAJC sitúa el proyecto en su contexto real: una comunidad universitaria ubicada en Cali, con múltiples sedes, públicos y puntos de contacto.', 'https://www.uniajc.edu.co/wp-content/uploads/2026/09/Fondo-slider.jpg'],
  'campus-sur': ['Información para la comunidad', 'La comunicación estratégica también debe acompañar momentos concretos: horarios, inscripciones, servicios y rutas de atención que la comunidad necesita consultar.', 'https://www.uniajc.edu.co/wp-content/uploads/2026/08/fondo-slider-horarios-bucc.jpg'],
  estrategia: ['Una estrategia con muchos accesos', 'El mismo núcleo informativo puede adaptarse a una pantalla, un podcast, un video, una galería, un chatbot o una acción participativa. Cambia el formato, no la claridad.', ''],
};

function openInfoModal(key, image) {
  const content = modalContent[key] || modalContent.interaccion;
  modalTitle.textContent = content[0];
  modalText.textContent = content[1];
  modalVisual.style.backgroundImage = `url("${image || content[2] || ''}")`;
  infoModal.classList.add('is-open');
  infoModal.setAttribute('aria-hidden', 'false');
}

function closeInfoModal() {
  infoModal.classList.remove('is-open');
  infoModal.setAttribute('aria-hidden', 'true');
}

document.querySelectorAll('[data-modal]').forEach((trigger) => {
  trigger.addEventListener('click', () => openInfoModal(trigger.dataset.modal, trigger.dataset.image));
});
infoModal.querySelector('.modal-close').addEventListener('click', closeInfoModal);
infoModal.addEventListener('click', (event) => { if (event.target === infoModal) closeInfoModal(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeInfoModal(); });

// Convierte un enlace de YouTube en un reproductor embebido cuando el usuario lo suministra.
const videoForm = document.querySelector('[data-video-form]');
const videoScreen = document.querySelector('[data-video-screen]');
videoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = videoForm.querySelector('input').value.trim();
  const match = value.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  if (!match) {
    videoScreen.querySelector('.video-empty strong').textContent = 'Enlace no reconocido';
    videoScreen.querySelector('.video-empty small').textContent = 'Usa un enlace válido de YouTube';
    return;
  }
  videoScreen.innerHTML = `<iframe src="https://www.youtube.com/embed/${match[1]}?rel=0" title="Video de RedCREA en YouTube" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
});
