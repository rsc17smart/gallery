var OTO = OTO || {};

OTO.Gallery = class {
    constructor(container, options) {
        this.container = container;
        this.options = options;
        this.slides = container.children;
        this.slideIndex = 0;
        this.slideAutoPlay = null;

        this.moveToNext = this.moveToNext.bind(this);
        this.moveToPrev = this.moveToPrev.bind(this);
    }

    constructHtml() {
        this.container.classList.add('oto-gallery');

        const uniqueClass = `oto-gallery-${Math.floor((Math.random() * 100) + 1)}`;
        this.container.classList.add(`${uniqueClass}`);

        const slides = this.slides;
        const slidesLength = this.slides.length;
        const slidesHeight = [];
        
        // Add the list of slides into the container element
        const gallery = document.createElement('div');
        gallery.classList.add('oto-gallery-track');

        for (let i = 0; i < slidesLength; i++) {
            const slideEl = document.createElement('div');
            const slideInnerContent = slides[i].outerHTML;

            slidesHeight.push(slides[i].clientHeight);

            slideEl.classList.add('oto-gallery-slide');
            slideEl.innerHTML = slideInnerContent;
            slideEl.style.width = `${this.container.clientWidth}px`;
            gallery.appendChild(slideEl);
        }

        const galleryHeight = Math.max.apply(null, slidesHeight);

        if (this.options['effect'] === 'fade') {
            this.container.classList.add('fade-effect');
        } else if (this.options['effect'] === 'zoom') {
            this.container.classList.add('zoom-effect');
        } else {
            gallery.style.width = `${this.container.clientWidth * (this.slides.length + 1)}px`;
        }

        gallery.style.height = `${galleryHeight}px`;

        this.container.appendChild(gallery);
        
        // Sanitize old structure ?? Is it ok to use another loop for sanitize or should I use the loop already used above?
        for (let i = 0; i < slidesLength; i++) {
            slides[0].parentNode.removeChild(slides[0]);
        }

        // Add the prev button
        const prevElem = document.createElement('button');
        prevElem.className = 'oto-gallery-arrow prev-arrow';
        prevElem.addEventListener('click', this.moveToPrev, false);
        this.container.appendChild(prevElem);

        // Add the next button
        const nextElem = document.createElement('button');
        nextElem.className = 'oto-gallery-arrow next-arrow';
        nextElem.addEventListener('click', this.moveToNext, false);
        this.container.appendChild(nextElem);

        // Add the dot elements
        const dotsContainer = document.createElement('ul');
        dotsContainer.className = 'oto-gallery-dots';

        for (let i = 0; i < gallery.children.length; i++) {
            const dotElem = document.createElement('li');
            dotElem.innerHTML = '<button class="oto-gallery-dot"></button>';
            dotElem.addEventListener('click', this.moveToDot.bind(this, i), false);
            dotsContainer.appendChild(dotElem);
        }

        if (this.options['autoplay'] === true) {
            let slideInterval = 0;

            if (this.options['setInterval'] === parseInt(this.options['setInterval'], 10)) {
                slideInterval = this.options['setInterval'];
            } else {
                slideInterval = 2000;
            }

            const customInlineStyle = document.createElement('style');
            customInlineStyle.innerHTML = `.${uniqueClass} .oto-gallery-dots li.active .oto-gallery-dot::after {transition-duration: ${slideInterval}ms;}`;
            document.body.prepend(customInlineStyle);
        }

        this.container.appendChild(dotsContainer);
    }

    moveToSlide(n) {
        const slideWidth = this.container.clientWidth;
        const btnPrev = this.slides[1];
        const btnNext = this.slides[2];
        const dots = this.slides[3].children;
        let slidesTrackPos = [];

        if (this.options['effect'] === 'fade' || this.options['effect'] === 'zoom') {
            if (n > this.slides[0].children.length - 1) {
                this.slideIndex = 0;
                n = 0;
            } else if (n < 0) {
                this.slideIndex = this.slides[0].children.length - 1;
                n = this.slides[0].children.length - 1;
            } else {
                this.slideIndex = n;
            }
        } else {
            for (let i = 0; i < this.slides[0].children.length; i++) {
                slidesTrackPos.push( -slideWidth * i);
            }

            if (n > this.slides[0].children.length - 2) {
                btnPrev.removeAttribute('disabled');
                btnNext.setAttribute('disabled', true);
                this.slideIndex = this.slides[0].children.length - 1;
            } else if (n < 1) {
                btnPrev.setAttribute('disabled', true);
                btnNext.removeAttribute('disabled');
                this.slideIndex = 0;
            } else {
                btnPrev.removeAttribute('disabled');
                btnNext.removeAttribute('disabled');
                this.slideIndex = n;
            }

            this.slides[0].style.transform = `translateX(${slidesTrackPos[n]}px)`;
        }

        for (let d = 0; d < this.slides[0].children.length; d++) {
            if (d === n) {
                this.slides[0].children[d].classList.add('active');
                dots[d].classList.add('active');
            } else {
                this.slides[0].children[d].classList.remove('active');
                dots[d].classList.remove('active');
            }
        }
    }

    moveToNext() {
        this.moveToSlide(this.slideIndex + 1);
        this.autoPlayNext(clearInterval(this.slideAutoPlay));
    }

    moveToPrev() {
        this.moveToSlide(this.slideIndex - 1);
        this.autoPlayNext(clearInterval(this.slideAutoPlay));
    }

    moveToDot(n) {
        this.moveToSlide(n);
        this.autoPlayNext(clearInterval(this.slideAutoPlay));
    }

    autoPlayNext() {
        if (this.options['autoplay'] === true) {
            let slideInterval = 0;

            if (this.options['setInterval'] === parseInt(this.options['setInterval'], 10)) {
                slideInterval = this.options['setInterval'];
            } else {
                slideInterval = 2000;
            }

            this.slideAutoPlay = setInterval(() => this.moveToNext(), slideInterval);
        }
    }

    generate() {
        this.constructHtml();
        this.moveToSlide(this.slideIndex);
        this.autoPlayNext(this.slideAutoPlay);
        // console.log(this.options);
    };
}