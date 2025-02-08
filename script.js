const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let particles = [];
let isMouseMoving = false; // Indicateur de mouvement de la souris
let inactivityTimer; // Timer pour détecter l'inactivité de la souris
let lastMouseMoveTime = Date.now(); // Temps du dernier mouvement de la souris

// Configuration des particules
const particleCount = 100; // Nombre maximum de particules

const mousePos = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
};

// Fonction pour redimensionner le canvas
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Classe Particle
class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = mousePos.x;
    this.y = mousePos.y;
    this.radius = Math.random() * 3 + 1; // Taille aléatoire entre 1 et 4
    this.color = `rgba(0, 255, 0, ${Math.random() * 0.7 + 0.3})`; // Couleur verte avec opacité variable

    // Limiter la dispersion des particules pour qu'elles ne partent pas dans toutes les directions
    const angle = Math.random() * Math.PI / 2 - Math.PI / 4; // Angle entre -45° et 45° autour du curseur
    const speed = Math.random() * 1.5 + 1; // Vitesse modérée

    this.velocity = {
      x: Math.cos(angle) * speed, // Déplacement en X basé sur l'angle
      y: Math.sin(angle) * speed, // Déplacement en Y basé sur l'angle
    };

    this.alpha = 1; // Opacité initiale
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color.replace(/[\d.]+\)$/g, `${this.alpha})`); // Applique l'alpha
    ctx.fill();
  }

  update() {
    if (this.alpha > 0) {
      this.x += this.velocity.x; // Déplacement en X
      this.y += this.velocity.y; // Déplacement en Y
    }
    this.alpha -= 0.04; // Augmenter la vitesse de disparition en réduisant plus rapidement l'alpha
  }
}


// Fonction pour dessiner les particules
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Ajouter des particules si la souris bouge
  if (isMouseMoving && particles.length < particleCount) {
    particles.push(new Particle());
  }

  // Mettre à jour et dessiner chaque particule
  particles.forEach((particle, index) => {
    if (particle.alpha > 0) {
      particle.update();
      particle.draw();
    } else {
      particles.splice(index, 1); // Supprime les particules complètement invisibles
    }
  });

  requestAnimationFrame(draw);
}

// Fonction pour gérer le suivi de la souris
function follow(event) {
  mousePos.x = event.clientX;
  mousePos.y = event.clientY;

  // Réinitialiser le timer à chaque mouvement de la souris
  clearTimeout(inactivityTimer);
  lastMouseMoveTime = Date.now(); // Mettre à jour le temps du dernier mouvement
  isMouseMoving = true; // Indiquer que la souris est en mouvement
}

// Vérifier l'inactivité de la souris
function checkInactivity() {
  if (Date.now() - lastMouseMoveTime > 100) {
    // Si plus de 100ms d'inactivité, arrêter la création de nouvelles particules
    isMouseMoving = false;
    particles.forEach(particle => {
      if (particle.alpha > 0) {
        particle.alpha -= 0.05; // Réduire progressivement l'alpha
      }
    });
  }
}

// Initialisation
window.addEventListener("resize", resize);
window.addEventListener("mousemove", follow);
resize();
draw();

// Vérification périodique de l'inactivité
setInterval(checkInactivity, 50); // Vérifie toutes les 50ms l'inactivité



