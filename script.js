'use strict';

const btnScrollTo = document.querySelector('.btn--scroll-to');

const section1 = document.querySelector('#section--1'); // the # symbol is the 'id'
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault(); // prevents default action happening (moving webpage to the top)
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

////////////  Page Navigation //////////////

//  OK way to add smooth scrolling from Nav bar to sections on the page. This creates an event handler for Each element in the Nav bar.

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// The problem with this approach is when you have lots of elements in the navbar, each event handler created slows down the page loading and running. The solution is event delegation. We do this by putting the event handler in the parent element, and read the target property to determine which element was clicked. However only one event handler is created, making things faster and smaller.

// Event delegation...
// First, add the event listener to the common parent element...
// Second, Determine what element originated the event using the .target which returns the element name that was clicked.
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    // check to see if element clicked has the 'nav__link' class or not. If so...
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// btn--scroll-to is the class we will be working with.

////////////////////  OLD SCHOOL WAY OF SMOOTH SCROLLING ////////////////

// btnScrollTo.addEventListener('click', function (e) {
//   const s1coords = section1.getBoundingClientRect(); // get the current coordinates of section--1 DOM Rectangle relative to the browser viewport. some attributes change as the window scrolls.
//   //////////////////  INTERESTING OTHER COORDINATES YOU CAN GET. ///////////////////
//   console.log(s1coords); // prints the coordinate information to the console.
//   console.log(e.target.getBoundingClientRect()); // prints coordinates of the button pressed.
//   // we can also get the current scroll position of the viewport...
//   console.log('Current scroll (x/y)', window.pageXOffset, window.pageYOffset); // these are aliases for scrollX and scrollY which not all browsers support.
//   console.log(
//     'height/width of viewport',
//     document.documentElement.clientHeight,
//     document.documentElement.clientWidth
//   ); // this returns the Height and width of the client viewport.
//////////////////////////////////////////////////////////////////////////////
// Back to Scrolling. This is a way to calculate the scroll to position
// window.scrollTo(
//   s1coords.left + window.pageXOffset, // scrolls to the s1 X coordinate relative the top of the webpage
//   s1coords.top + window.pageYOffset // scrolls to the s1 y coordinate relative the left side of the webpage
//       );
// a better way that is smooth...
// window.scrollTo({
//   left: s1coords.left + window.pageXOffset,
//   top: s1coords.top + window.pageYOffset,
//   behavior: 'smooth',
// });

// NEW SMOOTH SCROLLING METHOD - Only works on the newest browsers.
//   section1.scrollIntoView({ behavior: 'smooth' });
// });

////////////  Bankist Operations TABBED COMPONENT  \\\\\\\\\\\\\\\\\\\

// NOTICE. the tab numbers are separate elements to the tab text.

// when there are multiple elements that can be 'clicked', add event listener to the parent element in which the clickable elements are found. In this case that is the operations__tab-container class.
tabsContainer.addEventListener('click', function (e) {
  // you need the event 'e' to figure out which button got clicked.

  // Matching strategy  - which button got clicked?
  const clicked1 = e.target; // these two lines return the item clicked, however clicking on the number returns the span element, but clicking on the Text portion of the button returns the button element, which is what we want. Don't use this.
  console.log(clicked1);

  const clicked = e.target.closest('.operations__tab'); // what we are looking for is the 'data-tab' attribute of the 'button' that was clicked. closest selects the closest parent target. In the case of the tab numbers, the closest parent element  is the 'button' element, and for the text, the closest parent element is also the 'button' element. So this is what we want.
  console.log(clicked); // unfortunately if we click anywhere on the parent element other than a button, the event is also triggered and it will return 'null' which throws an error. So we need to ignore clicks on the parent of the target, so we create a...
  // Guard clause
  if (!clicked) return; // 'null' is a falsy value so if event returns 'null', function is halted.
  // otherwise we could test for 'operations__tab' class in clicked target which would accomplish the same result.
  // if (e.target.classList.contains('operations__tab')) { Then do the function...
  // To cause the buttons to shift up and down, first, remove active class from all button elements to move them down.

  tabs.forEach(t => t.classList.remove('operations__tab--active'));

  // then add the active class to the button clicked to raise it up.
  clicked.classList.add('operations__tab--active');

  // Change the content of the operations-_content area
  // First,  deactivate the content area of all content by deactivating the "active" class on all items
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // activate the content area based on which button is selected by adding the 'active' class to the selected content.
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`) // Using a template string to select the element according to the 'data-tab' value.
    .classList.add('operations__content--active');
  // }
});

///////////////////////////////////////////////////////////////////////////////////////////////
// Menu fade animation -
// 'mouseover' similar to 'mouseenter' except that 'mouseenter' does not bubble. The opposite event to 'mouseenter' is 'mouseleave' and the opposite of 'mouseover' is 'mouseout'

const handleHover = function (e, opacity, fontWeight) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = opacity;
      else {
        el.style.fontWeight = fontWeight;
      }
    });
    logo.style.opacity = opacity;
  }
};

// addEventListener expects a function after the 'type' of trigger event.
nav.addEventListener('mouseover', function (e) {
  handleHover(e, 0.3, 'bold');
});
nav.addEventListener('mouseout', function (e) {
  handleHover(e, 1.0, 'normal');
});

/////////////////////////////////////////////////////////////////////////////////////////////////

// STICKY NAVIGATION - Goal: Make the navigation bar reappear when we scroll below the first section of the page, regardless of the viewport size, and then set it to slightly transparent. We will use the 'scroll' event, even though there is a better way to do it. The 'scroll' event is pretty bad for performance because at every scroll movement, it is triggered.
// calculate the dynamic position of when the first section of the page reaches the top of the viewport
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);
// window.addEventListener('scroll', function (e) {
//   console.log(window.scrollY);
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// ////////  Now let us do the same with the new 'Intersection Observer API'. /////////////////

// Begin by creating a new 'IntersectionObserver' with a callback function and an object of options

// callback function... (called with 2 arguments, the entries (an array of the threshold entries), and the observer object itself)
//
// const obsCallback = function (entries, observer) {
//   // now loop over the entries...
//   entries.forEach(entry => {
//     console.log(entry, entry.isIntersecting);
//     if (entry.isIntersecting) nav.classList.add('sticky');
//     else nav.classList.remove('remove');
//   });
// };
// // options...
// const obsOptions = {
//   // create a root object that you want to monitor when 'section1' intersects it.
//   root: null, // null monitors the entire viewport
//   //threshold: 0.2, // 20% (this is the percentage of the target that is in the viewport that trippers the event. Multiple values are allowed.)
//   // whenever 20% of 'section1' intersects (comes into) the viewport, the call back function is triggered.
//
//   // when multiple values are used, the first value is the
//   threshold: [0.2], // here, when the target element is/moves completely out of the view port (0%) and when 20% of moves into/out of the view port, the event is triggered.
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// next we call the observer to observe in this case the position of 'section1'.
//observer.observe(section1); // The problem here is that when section1 goes out of view, the sticky navigation is turned off.
// So let's change the observed section to the header.
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  // observer is not needed in this case.
  // now we could loop over the entries like this...
  // entries.forEach(entry => {
  // but we don't need to loop over the entries because there is only one threshold.
  const [entry] = entries; // this gets the first element out of entries. same as entries[0]

  if (entry.isIntersecting) nav.classList.remove('sticky');
  else nav.classList.add('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, // amount of object still in the viewport (-90px) which will trigger the event, expressed in pixels or percentage.
  // however, as the CSS may change it is better to calculate this using the 'getBoundingAgent' function. See above
});
headerObserver.observe(header);

// ////////////////////////////  Revealing Elements on Scroll  /////////////////////////////////

// select all the sections of the HTML
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) entry.target.classList.add('section--hidden');
  // this fades out the section not being viewed, or you could just 'return' after the if condition to keep all sections visible after they were first displayed
  // select the 'target' (current section coming into view) and remove 'section--hidden' class
  else entry.target.classList.remove('section--hidden');
  //  observer.unobserve(entry.target); // this command stops observing targets that have already been revealed. This is a faster solution, just not as elegant.
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.1,
});

// now let's observe all sections to see when they come into view.
allSections.forEach(function (section) {
  // section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

// //////////////////////  Lazy Loading Images  /////////////////////////////////////////
// concept is to initially load a super low resolution with a blur effect and then when it comes into view, a high resolution image is loaded to replace it. This really helps with slow systems

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return; // early return if not intersecting

  entry.target.src = entry.target.dataset.src;
  // entry.target.classList.remove('lazy-img'); // replace lazy image with high def image. Problem: with slow internet connections, the lazy image is displayed immediately after removal of the 'lazy-image' class. Which presents the user with a low res image. Not very good.
  // so instead we use the 'load' event listener that waits until the high resolution is completely loaded and then we turn off the 'lazy-image' class.
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target); // stop observing the events as the images are already loaded.
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 1,
  rootMargin: '200px', // start loading the images before they come into view.
});

// observe the images to see when they come into view.

imgTargets.forEach(img => imgObserver.observe(img));

// //////////////////////////////  Slider Section of the Document  ////////////////////////////

// Currently all the slides are occupying the same space. What we will end up doing is placing them side by side and then rearrange them with the .style.transform = translateX property.
// create slider function. This keeps all the variables of the slider element out of the global space.
const slider = function () {
  // declare variables
  const slides = document.querySelectorAll('.slide');
  const btnleft = document.querySelector('.slider__btn--left');
  const btnright = document.querySelector('.slider__btn--right');
  const maxSlide = slides.length;
  let curSlide = 0;
  const dotContainer = document.querySelector('.dots');

  // let's edit the html for demo purposes to use the picture images instead of the bankist slides.
  // let's reduce the size of the images so that we can see them side by side
  // slider.style.transform = 'scale(0.3)';
  // slider.style.overflow = 'visible';

  // Let's now split up the slides into separate elements
  // slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class=dots__dot data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(function (dots) {
      dots.classList.remove('dots__dot--active');
    });
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    activateDot(slide);
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // goto next slide
  const nextSlide = function () {
    if (curSlide !== maxSlide - 1) {
      curSlide++;
    } else {
      curSlide = 0;
    }
    goToSlide(curSlide);
  };

  // goto previous slide
  const previousSlide = function () {
    console.log(curSlide);
    if (curSlide !== 0) {
      curSlide--;
    } else {
      curSlide = maxSlide - 1;
    }
    goToSlide(curSlide);
  };
  //  Initialize values
  // Add the dots to the HTML
  createDots();
  activateDot(0);
  goToSlide(curSlide);

  //  Event Handlers
  btnright.addEventListener('click', nextSlide);
  btnleft.addEventListener('click', previousSlide);

  // add event listener to the right and left arrow keys to do the same as clicking the arrow buttons
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') previousSlide(); // or you can use short-circuiting...
    e.key === 'ArrowRight' && nextSlide();
  });

  // Now let's deal with the dots
  // add dots to the HTML above
  // add event listener to the dots
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide; // or with destructuring...
      // const {slide} = e.target.dataset
      goToSlide(slide);
    }
  });
};
slider();

//
//**********************************************************************************************
//*********************************  DOM LESSONS  **********************************************

// selecting elements

// console.log(document.documentElement); // documentElement selects the entire document. Useful for manipulating full document attributes.
// console.log(document.head); // document.head selects the head of the document.
// console.log(document.body); // document.body selects the body of the document.
//
// const header = document.querySelector('.header'); // selects the FIRST header class
//
// const allSections = document.querySelectorAll('.section'); // use querySelectorAll if you wish to select all the items with the same class. This stores the node list for all the .section class items . This does not change
//
// console.log(allSections); // based on the previous statement, this gives us a node list of all items with the '.section' class.
//
// document.getElementById('section--1'); // here you access the DOM element by it's ID without the .
//
// const allButtons = document.getElementsByTagName('button'); // this returns a 'live' 'HTMLCollection' NOT a node list which often changes automatically as the page is manipulated. the variable will update itself with this method.
// console.log(allButtons);
//
// console.log(document.getElementsByClassName('btn')); // because you are getting elements by 'class' you don't need the dot. It also returns a 'live' HTMLCollection
//
// // CREATING AND INSERTING ELEMENTS
//
// // .insertAdjacentHTML - which we did in previous section.
//
// // .createElement method
// const message = document.createElement('div'); // At this point the element is created, but not in the DOM. We can now add attributes to this element.
// message.classList.add('cookie-message'); // add class to element
// // message.textContent = 'We use cookies for improved functionality and analytics.'; // simple text added to 'message'
// message.innerHTML =
//   'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
// // now we will insert this into the DOM
// // header.prepend(message); // prepend adds the element as the first item in the section
// header.append(message); // append adds the element as the last item in the section
// // however the element can only exist in one place at a time. So in this case, the append method moves the message from the first to the last position in the header.
//
// // if you want to have the same element used twice, you have to clone it.
//
// // header.prepend(message.cloneNode(true)); // Now the message is in both places.
//
// // two more methods. before and after
// // header.before(message.cloneNode(true)); // inserts before the header element
// // header.after(message.cloneNode(true)); // inserts after the header element
//
// // Delete an element
// // In this case we will delete the message element when we click the button.
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove(); // only removes the original message, not the clones
//   });
//
// /////////////////////////////////////////////////////////////////////////////
//
// // STYLES, ATTRIBUTES, AND CLASSES
//
// // MODIFYING STYLES
// message.style.backgroundColor = '#37383d';
// message.style.width = '100rem';
// message.style.padding = '2rem';
//
// // We can read the inline style we have set, but not ones that we have not set.
//
// console.log(message.style.height, message.style.width); // just returns the 100rem
// console.log(getComputedStyle(message).height); // this is how you get the height
// // you can then change the height like this.
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height) + 20 + 'px';
// console.log(getComputedStyle(message).height);
//
// // CSS Custom Properties - they work like variables. there is a list of them in the :root section of the style.css file.
//
// document.documentElement.style.setProperty('--color-primary', 'orange');
//
// // MODIFYING ATTRIBUTES
//
// const logo = document.querySelector('.nav__logo'); // stores the Bankist logo in the logo variable
// // now we can examine the attributes of the logo.
// console.log(logo.alt);
// console.log(logo.src); // returns the full source of the image file including http://...
// console.log(logo.getAttribute('src')); // this will get us the relative address of the image file.
// // the Same is true on links' href attribute...
// const link = document.querySelector('.nav__link');
// console.log(link.href);
// console.log(link.getAttribute('href'));
//
// // however we can only read standard attributes of the element we are trying to examine. custom attributes are read differently. (We have a custom attribute of 'designer' in the logo element). To read it do this...
// console.log(logo.className); // returns nothing
// console.log(logo.getAttribute('designer')); // returns the property of the 'designer' custom attribute.
//
// // We can also set the attributes like this.
// logo.alt = 'Bankist Fancy Logo';
// console.log(logo.alt);
//
// // We can also create a new attribute...
// logo.setAttribute('company', 'Bankist');
//
// // there also special DATA attributes. Special Attributes that start with the word 'data-'
// // Let's add one to the logo image element...
//
// console.log(logo.dataset.versionNumber); // remember to convert attributes with a dash to camelCase
//
// // Data attributes are very useful to store information in the html code on the fly.
//
// // MODIFYING CLASSES
// logo.classList.add('c', 'j'); // adds a class or classes to an element
// logo.classList.remove('c'); // removes a class
// logo.classList.toggle('c'); // toggles between adding the class and removing the class
// logo.classList.contains('c'); // check if an element contains a certain class
//
// // DON'T DO THIS!!!!!!
// // logo.className = 'jones'; // It will remove all the existing classes and replace them with the one class 'jonas'
//
// ////////////////////////////
//
// ///////////  EVENTS AND EVENT HANDLERS /////////////////
//
// // mouse enter event. Creates an event whenever the mouse enters the space of a specified element.
// const h1 = document.querySelector('h1');
// h1.addEventListener('mouseenter', function (e) {
//   alert('addEventListener: Great! You are reading the heading :D');
// });
//
// // another old way to add an event listener to an element, however adEventListener is better because it allows us to add multiple event listeners to the same event. We can also remove an addEventListener to an element.
//
// // h1.onmouseenter = function (e) {
// // alert('addEventListener: Great! You are reading the heading :D');
// // };
//
// // To remove an event listener, the function must be a named function.
//
// const alertH1 = function (e) {
//   alert('addEventListener: #3 Another time'); // this works, but now we can remove the EventListener...
//   // h1.removeEventListener('mouseenter', alertH1);
// };
// h1.addEventListener('mouseenter', alertH1);
// // we could also remove the EventListener after a certain length of time.
//
// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 10000);
//
// // a 3rd way of handling event handlers is using an HTML attribute. Don't use it!
// // take a look at the h1 element and look for 'onclick' attribute for h1
//
// ////////////  PROPOGATION: CAPTURING & BUBBLING PHASES /////////////////////////////
//
// // Click events may be triggered by an element down the DOM tree, but they actually are generated at the Document root, not at the target element generating the event.
// // The Capturing phase is where the event moves down the DOM tree to the target element, affecting all the parent elements of the target element.
// // As soon as the event reaches the target element, the Target phase begins. This allows the actual code to be executed at the target element.
// // The Bubbling phase is where the event response moves back up the tree, leaving its effect on each parent element as well. As the event passes through each parent element, it's as if the event happened right in each parent also.
// // All this movement of the event is referred to as event propagation.
//
// // Event Propagation - demonstration...
//
// // rgb(255,255,255)
// // First, our universal random integer function...
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
//
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
// console.log(randomColor());
//
// // now let's attach an event listener to the 'Features' link, and also to each of its parent elements. BOTTOM LINE - ONE CLICK CAN AFFECT MULTIPLE PARENT ELEMENTS.
//
// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   console.log('LINK1', e.target, e.currentTarget); // the 'target' is where the event happened. The 'currentTarget is where the current effect is happening which may be up the DOM tree.
//   this.style.backgroundColor = randomColor(); //!! The 'CurrentTarget' === the 'this' keyword.
//   console.log(e.currentTarget === this);
//   // Stop propagation... (prevents bubbling) - Generally it is Not a good idea.
//   e.stopPropagation();
// });
//
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   console.log('LINK2', e.target, e.currentTarget);
//   this.style.backgroundColor = randomColor();
// });
//
// document.querySelector('.nav').addEventListener('click', function (e) {
//   console.log('LINK3', e.target, e.currentTarget);
//   this.style.backgroundColor = randomColor();
// });
//
// // the addEventListener is ONLY listening to events during the bubbling phase, NOT during the capturing phase. Normally the capturing phase is irrelevant. The bubbling phase is very relevant for event delegation.
// // however, we can trigger events during the capturing phase by adding a third option to the addEventListener call, 'true'

/////////////////////////////////////////////////////////////////////////

///////  DOM TRAVERSING //////////////////////

const h1 = document.querySelector('h1');

// GOING DOWNWARDS in the DOM -
console.log(h1.querySelectorAll('.highlight')); // returns all the child elements of h1 that have a class of 'highlight' no matter how deep they are in the DOM (grandchildren, great-grandchildren, etc.

console.log(h1.childNodes); // returns all the direct child nodes of h1. Nodes can be anything. Text, Comments, classes, line breaks, elements, etc.
console.log(h1.children); // returns a live updated HTML collection of all the first level direct child elements of h1.

h1.firstElementChild.style.color = 'white'; //replaces first child element color to white
h1.lastElementChild.style.fontStyle = 'italic'; // replaces last child element font style to italic

// GOING UPWARDS  in the DOM - selecting parents

console.log(h1.parentNode); // selects all the parents, grandparents, etc. of the element
console.log(h1.parentElement); // selects only the parent element
// h1.closest('.header').style.background = 'var(--gradient-secondary)'; // 'closest' receives a query string just like querySelector. Here we change the background color to a CSS variable declared in the CSS file :root area.
// This particular line of code selected the 'closest' parent of the h1 element WITH the 'header' class and changed the background color to the stored color in the CSS '--gradient-secondary' variable.
//h1.closest('h1').style.background = 'var(--gradient-primary'; // in this case the closest 'h1' element to the 'h1' element is itself.

//closest finds parents. queryselector does the opposite and finds children. Both goes as far up or down in the DOM tree as is necessary.

// GOING SIDEWAYS: siblings. You can only select the adjacent sibling to the element
console.log(h1.previousElementSibling); // returns null because this is the first element at this level of the DOM
console.log(h1.nextElementSibling); // returns 'h4' as that is the next element at this level of the DOM.

console.log(h1.previousSibling); // returns the previous node
console.log(h1.nextSibling); // returns the next node

// if we need all the siblings, we move up to the parent and then read all the children...
console.log(h1.parentElement.children);
// the result is not an array, but an iterable so using the spread operator we can put the results into an array.
// const h1Array = [...h1.parentElement.children];
// h1Array.forEach(function (el) {
//   if (el !== h1) el.style.transform = 'scale(0.5)'; // other than the h1 element itself, reduce all other elements to 50% of their original size.
// });

// //////////////  Lifecycle DOM Events  /////////////////////////

// 'DOM content loaded' event- This event is triggered when all the HTML is loaded and the DOM tree is constructed, not necessarily the javascript info though. This is why we call the javascript file at the end of the HTML file so that it loads last
// <script src="script.js"></script>
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('DOM Content is loaded', e);
});
// you can use the network tab in the browser/inspect/Network tab and adjust the download speed to determine how long it takes for the webpage to load.

// The 'load' event - is triggered when all the HTML, DOM tree, CSS and  images are loaded into the window.

window.addEventListener('load', function (e) {
  console.log('complete webpage is loaded', e);
});

// The 'onbeforeunload' event fires as the user is closing the page. It is often used to ask the user if they truly want to close the page or not, or to give final instructions for closing the page.
// window.addEventListener('onbeforeunload', function (e) {
//   console.log('onbeforeunload event', e);
//   e.preventDefault(); // necessary in some browsers
//   e.returnValue = '';
// });
