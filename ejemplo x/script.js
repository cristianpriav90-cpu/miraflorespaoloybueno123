
"use strict";

// ======================================
// 1. ALIMENTOS DISPONIBLES
// ======================================

const meals = {
  breakfast: [
    {
      name: "Avena con frutas",
      emoji: "🥣",
      description: "Avena con leche, plátano y fresas.",
      tip: "Aporta fibra y energía para comenzar el día."
    },
    {
      name: "Pan integral con huevo",
      emoji: "🍳",
      description: "Pan integral con huevo y tomate.",
      tip: "Combina cereales, proteínas y vegetales."
    },
    {
      name: "Yogur con granola",
      emoji: "🥛",
      description: "Yogur natural con granola y fruta.",
      tip: "Una alternativa práctica y variada."
    },
    {
      name: "Tostadas con palta",
      emoji: "🥑",
      description: "Pan tostado con palta y tomate.",
      tip: "Incluye grasas saludables y fibra."
    },
    {
      name: "Ensalada de frutas",
      emoji: "🍓",
      description: "Una combinación de frutas frescas.",
      tip: "Aporta vitaminas, minerales y fibra."
    }
  ],

  lunch: [
    {
      name: "Pollo con arroz",
      emoji: "🍗",
      description: "Pollo a la plancha con arroz y ensalada.",
      tip: "Combina proteínas, cereales y verduras."
    },
    {
      name: "Pescado con camote",
      emoji: "🐟",
      description: "Pescado al horno con camote y vegetales.",
      tip: "Incluye proteínas y distintos nutrientes."
    },
    {
      name: "Lentejas con arroz",
      emoji: "🥘",
      description: "Lentejas guisadas con arroz y ensalada.",
      tip: "Las lentejas aportan fibra y proteína vegetal."
    },
    {
      name: "Saltado de verduras",
      emoji: "🥦",
      description: "Verduras salteadas con arroz y pollo.",
      tip: "Una manera deliciosa de comer vegetales."
    },
    {
      name: "Quinua con pollo",
      emoji: "🍲",
      description: "Quinua cocida con pollo y verduras.",
      tip: "Una comida variada y nutritiva."
    }
  ],

  dinner: [
    {
      name: "Tortilla de verduras",
      emoji: "🍳",
      description: "Tortilla de huevo con espinaca y tomate.",
      tip: "Una alternativa sencilla con vegetales."
    },
    {
      name: "Sándwich de pollo",
      emoji: "🥪",
      description: "Pan integral con pollo, lechuga y tomate.",
      tip: "Una opción práctica y variada."
    },
    {
      name: "Crema de verduras",
      emoji: "🥣",
      description: "Crema casera de zapallo y zanahoria.",
      tip: "Una forma deliciosa de incluir verduras."
    },
    {
      name: "Ensalada de atún",
      emoji: "🥗",
      description: "Atún con lechuga, tomate y papa.",
      tip: "Aporta proteínas y vegetales."
    },
    {
      name: "Tostadas con queso",
      emoji: "🧀",
      description: "Tostadas integrales con queso y tomate.",
      tip: "Una cena sencilla y fácil de preparar."
    }
  ]
};


// ======================================
// 2. CONFIGURACIÓN DEL JUEGO
// ======================================

const categories = ["breakfast", "lunch", "dinner"];

const categoryInfo = {
  breakfast: {
    title: "¡Elige tu desayuno!",
    label: "PRIMERA ETAPA",
    description: "Los vasos esconden tu primera comida."
  },

  lunch: {
    title: "¡Elige tu almuerzo!",
    label: "SEGUNDA ETAPA",
    description: "¡Nuevos vasos y una nueva sorpresa!"
  },

  dinner: {
    title: "¡Elige tu cena!",
    label: "ÚLTIMA ETAPA",
    description: "Descubre la última comida de tu menú."
  }
};

const categoryNames = {
  breakfast: "🌅 DESAYUNO",
  lunch: "☀️ ALMUERZO",
  dinner: "🌙 CENA"
};


// ======================================
// 3. VARIABLES
// ======================================

let player = {
  name: "",
  username: ""
};

let currentStep = 0;
let currentMeals = [];
let selectedMenu = [];

let hasShuffled = false;
let hasSelected = false;
let isShuffling = false;


// ======================================
// 4. ELEMENTOS HTML
// ======================================

const registerScreen =
  document.getElementById("registerScreen");

const gameScreen =
  document.getElementById("gameScreen");

const registerForm =
  document.getElementById("registerForm");

const playerName =
  document.getElementById("playerName");

const cups =
  [...document.querySelectorAll(".cup-option")];

const shuffleButton =
  document.getElementById("shuffleButton");

const resetButton =
  document.getElementById("resetButton");

const nextButton =
  document.getElementById("nextButton");

const selectedMeal =
  document.getElementById("selectedMeal");

const finalScreen =
  document.getElementById("finalScreen");


// ======================================
// 5. CREAR CUENTA
// ======================================

registerForm.addEventListener("submit", function(event) {

  event.preventDefault();

  const name =
    document.getElementById("name").value.trim();

  const username =
    document.getElementById("username").value.trim();

  const password =
    document.getElementById("password").value;

  if (!name || !username || password.length < 4) {
    alert("Por favor, completa correctamente todos los campos.");
    return;
  }

  // No guardamos la contraseña.
  player = {
    name: name,
    username: username
  };

  try {
    localStorage.setItem(
      "nutriplayUser",
      JSON.stringify(player)
    );
  } catch (error) {
    console.warn("No se pudo guardar el perfil.", error);
  }

  startGame();
});


// ======================================
// 6. INICIAR PARTIDA
// ======================================

function startGame() {

  registerScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");

  playerName.textContent = player.name;

  currentStep = 0;
  selectedMenu = [];

  document.getElementById("finalPlayerName").textContent =
    player.name;

  document.getElementById("progressSection")
    .classList.remove("hidden");

  document.getElementById("gameArea")
    .classList.remove("hidden");

  finalScreen.classList.add("hidden");

  setupStep();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// ======================================
// 7. MEZCLAR LOS ALIMENTOS
// ======================================

function shuffleArray(array) {

  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] =
      [result[j], result[i]];
  }

  return result;
}


// ======================================
// 8. PREPARAR CADA ETAPA
// ======================================

function setupStep() {

  const category = categories[currentStep];
  const info = categoryInfo[category];

  // Elegimos tres comidas distintas de la categoría.
  currentMeals = shuffleArray(meals[category]).slice(0, 3);

  hasShuffled = false;
  hasSelected = false;
  isShuffling = false;

  document.getElementById("categoryLabel").textContent =
    info.label;

  document.getElementById("gameTitle").textContent =
    info.title;

  document.getElementById("gameDescription").textContent =
    info.description;

  document.getElementById("gameMessage").textContent =
    "Pulsa MEZCLAR VASOS para comenzar.";

  selectedMeal.classList.add("hidden");
  nextButton.classList.add("hidden");

  shuffleButton.disabled = false;
  shuffleButton.textContent = "🔀 MEZCLAR VASOS";

  resetButton.disabled = false;

  cups.forEach((cup, index) => {

    cup.disabled = true;

    cup.classList.remove(
      "selected",
      "shuffling"
    );

    cup.querySelector(".cup-question").textContent = "?";

    cup.querySelector(".cup-label").textContent =
      `VASO 0${index + 1}`;

    cup.querySelector(".cup-caption").textContent =
      "Seleccionar";

  });

  updateProgress();
}


// ======================================
// 9. BOTÓN MEZCLAR VASOS
// ======================================

shuffleButton.addEventListener("click", function() {

  if (hasShuffled || hasSelected || isShuffling) {
    return;
  }

  isShuffling = true;

  shuffleButton.disabled = true;
  resetButton.disabled = true;

  shuffleButton.textContent = "✨ MEZCLANDO...";

  document.getElementById("gameMessage").textContent =
    "¡Observa cómo se mezclan los vasos!";

  // Animación visual de los tres vasos.
  cups.forEach(cup => {
    cup.classList.add("shuffling");
  });

  // Los alimentos se vuelven a mezclar.
  const shuffledMeals = shuffleArray(currentMeals);

  setTimeout(() => {

    // Asignar cada comida a una nueva posición.
    currentMeals = shuffledMeals;

    cups.forEach((cup, index) => {

      cup.classList.remove("shuffling");

      cup.disabled = false;

      cup.querySelector(".cup-question").textContent = "?";

    });

    hasShuffled = true;
    isShuffling = false;

    shuffleButton.textContent = "✓ VASOS MEZCLADOS";

    document.getElementById("gameMessage").textContent =
      "¡Ahora selecciona uno de los tres vasos!";

    resetButton.disabled = false;

  }, 1100);

});


// ======================================
// 10. ELEGIR UN VASO
// ======================================

cups.forEach((cup, index) => {

  cup.addEventListener("click", function() {

    if (!hasShuffled || hasSelected || isShuffling) {
      return;
    }

    hasSelected = true;

    // Comida que se encuentra debajo del vaso.
    const meal = currentMeals[index];

    // Marcar el vaso seleccionado.
    cup.classList.add("selected");

    cup.querySelector(".cup-question").textContent =
      meal.emoji;

    cup.querySelector(".cup-caption").textContent =
      "¡ELEGIDO!";

    // Bloquear los demás vasos.
    cups.forEach(otherCup => {
      otherCup.disabled = true;
    });

    // Guardar o reemplazar la comida de esta etapa.
    selectedMenu[currentStep] = {
      category: categories[currentStep],
      ...meal
    };

    showMeal(meal);

    document.getElementById("gameMessage").textContent =
      "¡Excelente elección! Descubriste tu comida.";

    nextButton.classList.remove("hidden");

    if (currentStep === 2) {

      nextButton.textContent =
        "🏆 VER MI MENÚ COMPLETO";

    } else {

      nextButton.textContent =
        "CONTINUAR A LA SIGUIENTE COMIDA →";

    }

  });

});


// ======================================
// 11. MOSTRAR RESULTADO
// ======================================

function showMeal(meal) {

  selectedMeal.classList.remove("hidden");

  document.getElementById("selectedEmoji").textContent =
    meal.emoji;

  document.getElementById("selectedName").textContent =
    meal.name;

  document.getElementById("selectedDescription").textContent =
    meal.description;

  document.getElementById("selectedTip").textContent =
    "💚 " + meal.tip;

  selectedMeal.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });

}


// ======================================
// 12. BOTÓN REINICIAR ETAPA
// ======================================

resetButton.addEventListener("click", function() {

  if (isShuffling) return;

  // Volvemos a sortear los vasos de la etapa actual.
  setupStep();

});


// ======================================
// 13. BOTÓN CONTINUAR
// ======================================

nextButton.addEventListener("click", function() {

  if (!hasSelected) return;

  if (currentStep < 2) {

    currentStep++;

    setupStep();

    document.getElementById("gameArea").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  } else {

    showFinalMenu();

  }

});


// ======================================
// 14. ACTUALIZAR PROGRESO
// ======================================

function updateProgress() {

  const completed = selectedMenu.filter(Boolean).length;

  document.getElementById("progressText").textContent =
    `${completed} / 3 comidas`;

  document.getElementById("progressBar").style.width =
    `${(completed / 3) * 100}%`;

  const stepIds = [
    "stepBreakfast",
    "stepLunch",
    "stepDinner"
  ];

  stepIds.forEach((id, index) => {

    const element = document.getElementById(id);

    element.classList.remove("active", "done");

    if (index < currentStep) {

      element.classList.add("done");

    } else if (index === currentStep) {

      element.classList.add("active");

    }

  });

}


// ======================================
// 15. MOSTRAR MENÚ COMPLETO
// ======================================

function showFinalMenu() {

  document.getElementById("gameArea")
    .classList.add("hidden");

  document.getElementById("progressSection")
    .classList.add("hidden");

  finalScreen.classList.remove("hidden");

  document.getElementById("finalPlayerName").textContent =
    player.name;

  const finalMenu = document.getElementById("finalMenu");

  finalMenu.replaceChildren();

  selectedMenu.forEach(meal => {

    const card = document.createElement("article");
    card.className = "final-item";

    const emoji = document.createElement("span");
    emoji.className = "final-emoji";
    emoji.textContent = meal.emoji;

    const category = document.createElement("span");
    category.className = "final-category";
    category.textContent = categoryNames[meal.category];

    const title = document.createElement("h3");
    title.textContent = meal.name;

    const description = document.createElement("p");
    description.textContent = meal.description;

    card.append(
      emoji,
      category,
      title,
      description
    );

    finalMenu.appendChild(card);

  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


// ======================================
// 16. VOLVER A JUGAR
// ======================================

document.getElementById("restartButton")
  .addEventListener("click", function() {

    currentStep = 0;
    selectedMenu = [];

    finalScreen.classList.add("hidden");

    document.getElementById("progressSection")
      .classList.remove("hidden");

    document.getElementById("gameArea")
      .classList.remove("hidden");

    setupStep();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  });


// ======================================
// 17. VOLVER AL INICIO
// ======================================

document.getElementById("backButton")
  .addEventListener("click", function() {

    finalScreen.classList.add("hidden");

    document.getElementById("progressSection")
      .classList.remove("hidden");

    document.getElementById("gameArea")
      .classList.remove("hidden");

    currentStep = 0;
    selectedMenu = [];

    setupStep();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  });


// ======================================
// 18. BOTÓN JUGAR AHORA
// ======================================

document.getElementById("startButton")
  .addEventListener("click", function() {

    document.getElementById("gameArea").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  });


// ======================================
// 19. CERRAR SESIÓN
// ======================================

document.getElementById("logoutButton")
  .addEventListener("click", function() {

    const confirmLogout = confirm(
      "¿Deseas salir de NUTRIPLAY?"
    );

    if (!confirmLogout) return;

    try {
      localStorage.removeItem("nutriplayUser");
    } catch (error) {
      console.warn("No se pudo borrar el perfil.", error);
    }

    location.reload();

  });
