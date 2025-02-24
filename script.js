/****************************************************
 * 1) Slides Data
 ****************************************************/
const slidesData = [
  {
    mainImage: "./images//1.THE Portal/Brand-Identity.jpg",
    verticalImages: [
      "./images//1.THE Portal/2.jpg",
      "./images//1.THE Portal/3.jpg",
      "./images//1.THE Portal/4.jpg",
      "./images//1.THE Portal/5.jpg",
      "./images//1.THE Portal/6.jpg",
      "./images//1.THE Portal/7.jpg",
      "./images//1.THE Portal/8.jpg",
      "./images//1.THE Portal/9.jpg",
      "./images//1.THE Portal/10.jpg",
    ]
  },
  {
    mainImage: "./images/4.Essenza/1.jpg",
    verticalImages: [
      "./images/4.Essenza/2.jpg",
      "./images/4.Essenza/3.jpg",
      "./images/4.Essenza/4.jpg",
      "./images/4.Essenza/5.jpg",
      "./images/4.Essenza/6.jpg",
      "./images/4.Essenza/7.jpg",
      "./images/4.Essenza/8.jpg",
      "./images/4.Essenza/9.jpg",
      "./images/4.Essenza/10.jpg",
      "./images/4.Essenza/11.jpg",
      
    ]
  },
  {
    mainImage: "./images/2.Pure Space/1.jpg",
    verticalImages: [
      "./images/2.Pure Space/2.jpg",
      "./images/2.Pure Space/3.jpg",
      "./images/2.Pure Space/4.jpg",
      "./images/2.Pure Space/5.jpg",
      "./images/2.Pure Space/6.jpg",
      "./images/2.Pure Space/7.jpg",
      "./images/2.Pure Space/8.jpg",
      "./images/2.Pure Space/9.jpg",
      "./images/2.Pure Space/10.jpg",
    ]
  },
  {
    mainImage: "./images/3.ARCH Labs/1.jpg",
    verticalImages: [
      "./images/3.ARCH Labs/2.jpg",
      "./images/3.ARCH Labs/3.jpg",
      "./images/3.ARCH Labs/4.jpg",
      "./images/3.ARCH Labs/5.jpg",
      "./images/3.ARCH Labs/6.jpg",
      "./images/3.ARCH Labs/7.jpg",
      "./images/3.ARCH Labs/8.jpg",
      "./images/3.ARCH Labs/9.jpg",
      "./images/3.ARCH Labs/10.jpg",
    ]
  },
];

/****************************************************
 * 2) DOM References
 ****************************************************/
const horizontalCarousel = document.getElementById("horizontalCarousel");
const verticalCarouselWrapper = document.getElementById("verticalCarouselWrapper");
const verticalCarousel = document.getElementById("verticalCarousel");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentSlideIndex = null;

/****************************************************
 * 3) Create Horizontal Slides
 ****************************************************/
function createHorizontalSlides() {
  slidesData.forEach((slide, index) => {
    const slideDiv = document.createElement("div");
    slideDiv.classList.add("slide");

    // Spinner
    const spinner = document.createElement("div");
    spinner.classList.add("spinner");
    slideDiv.appendChild(spinner);

    // Main image
    const img = document.createElement("img");
    img.src = slide.mainImage;
    img.addEventListener("load", () => {
      spinner.style.display = "none";
      img.classList.add("loaded");
    });

    // Overlay
    const overlayDiv = document.createElement("div");
    overlayDiv.classList.add("slide-overlay");

    const iconSpan = document.createElement("span");
    iconSpan.classList.add("click-icon");
    iconSpan.textContent = "↓";

    const overlayText = document.createElement("div");
    overlayText.classList.add("overlay-text");
    overlayText.textContent = "Click to view more";

    overlayDiv.appendChild(iconSpan);
    overlayDiv.appendChild(overlayText);
    slideDiv.appendChild(overlayDiv);

    // Click -> open vertical carousel
    slideDiv.addEventListener("click", (e) => {
      e.stopPropagation();
      openVerticalCarousel(index, slideDiv);
    });

    slideDiv.appendChild(img);
    horizontalCarousel.appendChild(slideDiv);
  });
}

/****************************************************
 * 4) Open Vertical Carousel
 *    - Align top to the horizontal slide’s bounding box
 *    - Let it extend downward
 ****************************************************/
function openVerticalCarousel(slideIndex, clickedSlideDiv) {
  currentSlideIndex = slideIndex;
  document.body.style.overflow = "hidden";

  // Clear old vertical slides
  verticalCarousel.querySelectorAll(".vertical-slide").forEach(vs => vs.remove());

  // Populate new vertical slides
  slidesData[slideIndex].verticalImages.forEach(imageUrl => {
    const vs = document.createElement("div");
    vs.classList.add("vertical-slide");

    const spinner = document.createElement("div");
    spinner.classList.add("spinner");
    vs.appendChild(spinner);

    const img = document.createElement("img");
    img.src = imageUrl;
    img.addEventListener("load", () => {
      spinner.style.display = "none";
      img.classList.add("loaded");
    });

    vs.appendChild(img);
    verticalCarousel.appendChild(vs);
  });

  // Position the wrapper so the top aligns with the clicked slide
  const rect = clickedSlideDiv.getBoundingClientRect();
  verticalCarouselWrapper.style.position = "fixed";
  verticalCarouselWrapper.style.left = rect.left + "px";
  verticalCarouselWrapper.style.width = rect.width + "px";
  // From that slide's top to bottom of screen
  verticalCarouselWrapper.style.top = rect.top + "px";
  verticalCarouselWrapper.style.height = `calc(100vh - ${rect.top}px)`;

  verticalCarouselWrapper.classList.remove("hidden");
  verticalCarouselWrapper.style.display = "flex";

  // If already open, reset
  if (!verticalCarouselWrapper.classList.contains("hidden")) {
    verticalCarousel.style.transition = "none";
    verticalCarousel.classList.remove("open");
    verticalCarousel.getBoundingClientRect(); // reflow
    verticalCarousel.style.transition = "";
  }

  verticalCarouselWrapper.style.pointerEvents = "auto";

  requestAnimationFrame(() => {
    verticalCarousel.classList.add("open");
  });
}

/****************************************************
 * 5) Close Vertical Carousel
 ****************************************************/
function closeVerticalCarousel() {
  verticalCarousel.classList.remove("open");
  verticalCarouselWrapper.style.pointerEvents = "none";

  setTimeout(() => {
    verticalCarouselWrapper.classList.add("hidden");
    document.body.style.overflow = "auto";
    currentSlideIndex = null;
  }, 500);
}

/****************************************************
 * 6) Click outside -> close vertical carousel
 ****************************************************/
document.addEventListener("click", (e) => {
  if (verticalCarouselWrapper.classList.contains("hidden")) return;

  const clickedInsideHorizontal = horizontalCarousel.contains(e.target);
  const clickedInsideVertical = verticalCarousel.contains(e.target);

  if (!clickedInsideHorizontal && !clickedInsideVertical) {
    closeVerticalCarousel();
  }
});

/****************************************************
 * 7) Horizontal Carousel Nav
 ****************************************************/
prevBtn.addEventListener("click", () => {
  horizontalCarousel.scrollBy({ left: -300, behavior: "smooth" });
});
nextBtn.addEventListener("click", () => {
  horizontalCarousel.scrollBy({ left: 300, behavior: "smooth" });
});

/****************************************************
 * 8) INIT: Create the horizontal slides
 ****************************************************/
createHorizontalSlides();

/****************************************************
 * 9) Hamburger Toggle
 ****************************************************/
const hamburgerBtn = document.getElementById("hamburgerBtn");
const navLinks = document.getElementById("navLinks");

hamburgerBtn.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
  });
});

document.addEventListener("click", (e) => {
  // If the nav isn't open, do nothing
  if (!navLinks.classList.contains("open")) return;

  // If we clicked inside the navLinks or on the hamburger, do nothing
  if (navLinks.contains(e.target) || hamburgerBtn.contains(e.target)) {
    return;
  }

  // Otherwise, user clicked outside -> close the sidebar
  navLinks.classList.remove("open");
});

// When a dot is clicked, scroll to the corresponding section.
document.querySelectorAll('.scroll-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    const sectionId = dot.getAttribute('data-section');
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Use IntersectionObserver to update active dot as sections enter viewport.
const sections = document.querySelectorAll('section');
const observerOptions = {
  threshold: 0.6
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      document.querySelectorAll('.scroll-dot').forEach(dot => {
        dot.classList.toggle('active', dot.getAttribute('data-section') === id);
      });
    }
  });
}, observerOptions);

sections.forEach(section => {
  observer.observe(section);
});
