// Portfolio Interactive Features: Theme Toggle, Project Search & Filter, Weather Widget

document.addEventListener("DOMContentLoaded", () => {
  // 1. Theme Toggle (Defaults to Dark Mode first)
  const themeButton = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("portfolio_theme");

  // Open in dark mode first by default unless explicitly saved as 'light'
  if (savedTheme === "light") {
    document.body.classList.remove("dark-mode");
    if (themeButton) themeButton.textContent = "Switch to Dark Mode";
  } else {
    document.body.classList.add("dark-mode");
    if (themeButton) themeButton.textContent = "Switch to Light Mode";
  }

  if (themeButton) {
    themeButton.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");
      themeButton.textContent = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";
      localStorage.setItem("portfolio_theme", isDark ? "dark" : "light");
    });
  }

  // 2. Project Search & Filter Feature (Task 3: Mandatory Requirement)
  const searchInput = document.getElementById("projectSearch");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  const projectCountMsg = document.getElementById("projectCountMsg");
  const noProjectsMsg = document.getElementById("noProjectsMsg");

  let activeCategory = "all";

  function filterProjects() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
    let visibleCount = 0;

    projectCards.forEach((card) => {
      const title = (card.getAttribute("data-title") || "").toLowerCase();
      const tech = (card.getAttribute("data-tech") || "").toLowerCase();
      const category = (card.getAttribute("data-category") || "").toLowerCase();
      const text = card.textContent.toLowerCase();

      const matchesQuery = !query || title.includes(query) || tech.includes(query) || text.includes(query);
      const matchesCategory = activeCategory === "all" || category.includes(activeCategory);

      if (matchesQuery && matchesCategory) {
        card.style.display = "flex";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    if (projectCountMsg) {
      projectCountMsg.textContent = `Showing ${visibleCount} of ${projectCards.length} projects`;
    }

    if (noProjectsMsg) {
      noProjectsMsg.style.display = visibleCount === 0 ? "block" : "none";
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterProjects);
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.getAttribute("data-filter") || "all";
      filterProjects();
    });
  });

  // 3. Weather Widget (Lecture 9 Integration)
  const cityInput = document.getElementById("cityInput");
  const weatherButton = document.getElementById("weatherButton");
  const weatherResult = document.getElementById("weatherResult");

  if (weatherButton) {
    weatherButton.addEventListener("click", getWeather);
  }

  if (cityInput) {
    cityInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") getWeather();
    });
  }

  async function getWeather() {
    const city = cityInput.value.trim();

    if (!city) {
      weatherResult.textContent = "Please enter a city name.";
      return;
    }

    weatherResult.textContent = "Loading weather...";
    const apiKey = "5c7b60c5d6abd9cb73639a1cba0fce7a";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      weatherResult.innerHTML = `
        <div class="weather-card">
          <h3>${data.name}, ${data.sys?.country || ""}</h3>
          <p class="weather-temp">${Math.round(data.main.temp)}°C</p>
          <p class="weather-desc">${data.weather[0].description}</p>
          <p class="weather-details">Humidity: ${data.main.humidity}% | Wind: ${data.wind.speed} m/s</p>
        </div>
      `;
    } catch (error) {
      weatherResult.textContent = "Unable to fetch weather. Please verify city name and try again.";
      console.error(error);
    }
  }
});