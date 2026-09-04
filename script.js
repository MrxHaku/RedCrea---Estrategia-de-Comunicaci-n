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
  { keys: ['redcrea', 'red crea'], answer: 'RedCREA es el ecosistema de comunicación phygital propuesto para conectar campus, plataformas digitales y participación universitaria.' },
  { keys: ['phygital', 'físico', 'fisico'], answer: 'Phygital integra la experiencia física y digital: por ejemplo, un QR en el campus puede llevarte a una ruta web, un video o un chatbot institucional.' },
  { keys: ['reglamento', 'trámite', 'tramite', 'ruta de atención'], answer: 'La propuesta organiza reglamentos, trámites y rutas de atención en contenidos breves, verificables y segmentados por público.' },
  { keys: ['docente', 'profesor', 'aula', 'moodle', 'miro'], answer: 'La ruta docente incluye guías para aulas híbridas, pantallas interactivas, laboratorios de prototipado y herramientas colaborativas como Moodle y Miro.' },
  { keys: ['funcionario', 'administrativo', 'dependencia', 'directorio'], answer: 'La ruta interna facilita saber quién hace qué, cómo alimentar los puntos informativos y cómo coordinar los mensajes entre dependencias.' },
  { keys: ['estudiante', 'estudiantes', 'podcast', 'podcast', 'logro'], answer: 'La ruta estudiante reúne trámites, la Misión de Iniciación, Saltos de la Semana y micro-podcasts sobre la vida universitaria.' },
  { keys: ['particip', 'co-cre', 'cocre', 'tema'], answer: 'La comunidad participa compartiendo dudas, proponiendo formatos y probando rutas. El Toolkit 3C propone Conectar, Comprender y Co-crear.' },
  { keys: ['metodología', 'metodologia', 'design thinking', 'archer', 'investigación'], answer: 'El proyecto combina enfoque mixto, investigación-acción participativa, metodología proyectual de Bruce Archer, Design Thinking y prototipado.' },
  { keys: ['indicador', 'métrica', 'metrica', 'impacto'], answer: 'Se propone medir claridad, confianza, interacción, resolución de consultas, participación, ciudadanía digital y sentido de pertenencia.' },
  { keys: ['autores', 'autoras', 'lina', 'laura'], answer: 'El proyecto fue desarrollado por Lina María Cortés Cardona y Laura Isabel Guevara Martínez para la Maestría en Comunicación Digital, UAO, 2025.' },
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
  const normalized = question.toLowerCase();
  const match = answers.find((item) => item.keys.some((key) => normalized.includes(key)));
  return match ? match.answer : 'Puedo ayudarte con RedCREA, phygital, rutas de estudiante, docente o funcionario, metodología, participación e indicadores.';
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
