  // When the entire page (images, etc.) finishes loading
  window.addEventListener('load', function() {
    // Hide the preloader overlay
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.style.display = 'none';
    }
  });
  
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
const verticalCloseDelay = 300;    // ms to wait for the vertical carousel to close
const horizontalCenterDelay = 500; // ms to wait for horizontal centering animation
const verticalOpenDelay = 0;       // additional delay before opening new vertical carousel (optional)
const navAdjustmentDelay = 500; // Delay for vertical adjustment (ms)


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
  
  // First, adjust vertical visibility of the clicked slide.
  adjustSlideVisibility(clickedSlideDiv).then(() => {
    // Now proceed with the rest of your function.
    closeVerticalCarouselPromise().then(() => {
      // Step 2: Smoothly center the clicked horizontal slide relative to the viewport.
      const slideWidth = clickedSlideDiv.offsetWidth;
      const targetScrollLeft = clickedSlideDiv.offsetLeft - (window.innerWidth / 2 - slideWidth / 2);
      horizontalCarousel.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
      
      // Wait for horizontal scrolling to finish
      setTimeout(() => {
        // Step 3: Clear and populate the vertical carousel anew
        document.body.style.overflow = "hidden"; // Lock body scrolling
        verticalCarousel.innerHTML = ""; // Clear previous vertical slides
        
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
        
        // Reset vertical carousel scroll position to top
        verticalCarousel.scrollTop = 0;
        verticalCarousel.scrollTo({ top: 0, left: 0 });
        void verticalCarousel.offsetHeight; // Force reflow
        
        // Step 4: Position the vertical carousel wrapper based on the clicked slide's position
        const rect = clickedSlideDiv.getBoundingClientRect();
        verticalCarouselWrapper.style.position = "fixed";
        verticalCarouselWrapper.style.left = rect.left + "px";
        verticalCarouselWrapper.style.width = rect.width + "px";
        verticalCarouselWrapper.style.top = rect.top + "px";
        verticalCarouselWrapper.style.height = `calc(100vh - ${rect.top}px)`;
        
        verticalCarouselWrapper.classList.remove("hidden");
        verticalCarouselWrapper.style.display = "flex";
        verticalCarouselWrapper.style.pointerEvents = "auto";
        
        // Step 5: Finally, open the vertical carousel so it slides in.
        // Ensure vertical scroll is at the top.
        verticalCarousel.scrollTop = 0;
        setTimeout(() => {
          verticalCarousel.style.transition = "none";
          verticalCarousel.classList.remove("open");
          void verticalCarousel.offsetWidth; // Force reflow
          verticalCarousel.style.transition = "";
          verticalCarousel.classList.add("open");
        }, verticalOpenDelay);
        
      }, horizontalCenterDelay);
    });
  });
}



/****************************************************
 * 5) Close Vertical Carousel
 ****************************************************/
function closeVerticalCarouselPromise() {
  return new Promise(resolve => {
    // Only if the vertical carousel is open
    if (!verticalCarouselWrapper.classList.contains("hidden")) {
      verticalCarousel.classList.remove("open");
      verticalCarouselWrapper.style.pointerEvents = "none";
      // Wait for the closing animation to complete
      setTimeout(() => {
        verticalCarouselWrapper.classList.add("hidden");
        document.body.style.overflow = "auto";
        resolve();
      }, verticalCloseDelay);
    } else {
      resolve();
    }
  });
}

function closeVerticalCarousel() {
  verticalCarousel.classList.remove("open");
  verticalCarouselWrapper.style.pointerEvents = "none";
  setTimeout(() => {
    verticalCarouselWrapper.classList.add("hidden");
    document.body.style.overflow = "auto";
    currentSlideIndex = null;
  }, 500); // Adjust delay to match your vertical carousel closing animation timing
}

/****************************************************
 * 6) Click outside -> close vertical carousel
 ****************************************************/
document.addEventListener("click", (e) => {
  if (verticalCarouselWrapper.classList.contains("hidden")) return; // already closed

  const clickedInsideHorizontal = horizontalCarousel.contains(e.target);
  const clickedInsideVertical = verticalCarousel.contains(e.target);

  if (!clickedInsideHorizontal && !clickedInsideVertical) {
    closeVerticalCarousel();
  }
});

// Additional keydown listener for arrow keys on smaller screens
document.addEventListener("keydown", (e) => {
  if (window.innerWidth < 769 && !verticalCarouselWrapper.classList.contains("hidden")) {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      closeVerticalCarousel();
    }
  }
});

/****************************************************
 * 7) Horizontal Carousel Nav
 ****************************************************/
prevBtn.addEventListener("click", () => {
  if (!verticalCarouselWrapper.classList.contains("hidden")) {
    closeVerticalCarousel();
  }
  horizontalCarousel.scrollBy({ left: -300, behavior: "smooth" });
});
nextBtn.addEventListener("click", () => {
  if (!verticalCarouselWrapper.classList.contains("hidden")) {
    closeVerticalCarousel();
  }
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

function adjustSlideVisibility(clickedSlideDiv) {
  const navHeight = document.querySelector('.navbar') ? document.querySelector('.navbar').offsetHeight : 0;
  const rect = clickedSlideDiv.getBoundingClientRect();
  let adjustment = 0;

  // Check if the slide's top is above the navbar
  if (rect.top < navHeight) {
    adjustment = rect.top - navHeight;
  } 
  // Check if the slide's bottom is below the viewport
  else if (rect.bottom > window.innerHeight) {
    adjustment = rect.bottom - window.innerHeight;
  }
  
  if (adjustment !== 0) {
    window.scrollBy({ top: adjustment, behavior: 'smooth' });
    // Return a Promise that resolves after a delay so that subsequent actions wait for the scroll to finish.
    return new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay; adjust as needed.
  } else {
    return Promise.resolve();
  }
}


document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !verticalCarouselWrapper.classList.contains("hidden")) {
    closeVerticalCarousel();
  }
});
