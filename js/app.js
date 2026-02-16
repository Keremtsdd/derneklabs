if (typeof process === 'undefined') {
    window.process = { env: { NODE_ENV: 'production' } };
}

// Gelişmiş datepicker fallback ve jQuery UI compatibility
(() => {
    if (typeof $ !== 'undefined') {
        // Datepicker fallback - chainable ve on() metodunu destekleyen
        if (!$.fn.datepicker) {
            $.fn.datepicker = function(options) {
                return this.each(function() {
                    const $this = $(this);
                    // Temel HTML5 date input fonksiyonalitesi
                    if (!$this.data('datepicker-initialized')) {
                        $this.attr('type', 'date');
                        $this.data('datepicker-initialized', true);
                        
                        // Options callback'lerini destekle
                        if (options && typeof options === 'object') {
                            if (options.onSelect && typeof options.onSelect === 'function') {
                                $this.on('change', function() {
                                    options.onSelect.call(this, this.value);
                                });
                            }
                            if (options.onClose && typeof options.onClose === 'function') {
                                $this.on('blur', function() {
                                    options.onClose.call(this, this.value);
                                });
                            }
                        }
                    }
                });
            };
        }
        
        // jQuery UI datepicker regional ve setDefaults fallback
        if (!$.datepicker) {
            $.datepicker = { 
                regional: {},
                setDefaults: function() { return this; },
                // Ek metodlar
                parseDate: function(format, value) {
                    return new Date(value);
                },
                formatDate: function(format, date) {
                    return date.toISOString().split('T')[0];
                }
            };
        }
        
        // jQuery UI widget factory fallback (eğer yoksa)
        if (!$.widget) {
            $.widget = function() { return $; };
        }
    }
})();

// Global hata yakalayıcı - datepicker hatalarını sessizce handle et
window.addEventListener('error', (e) => {
    const errorPatterns = [
        'datepicker',
        'regional',
        'process is not defined',
        '.on is not a function',
        'jQuery UI',
        'widget is not a function'
    ];
    
    const isKnownError = errorPatterns.some(pattern => 
        e.message && e.message.toLowerCase().includes(pattern.toLowerCase())
    );
    
    if (isKnownError) {
        console.warn('Handled known compatibility error:', e.message);
        e.preventDefault();
        return true;
    }
});

// jQuery ready handler'da da hata yakalama
$(document).ready(function() {
    // jQuery seviyesinde hata yakalayıcı
    $(window).on('error', function(e) {
        const message = e.originalEvent?.message || '';
        if (message.includes('datepicker') || 
            message.includes('.on is not a function') ||
            message.includes('regional')) {
            console.warn('jQuery error handled:', message);
            e.preventDefault();
            return false;
        }
    });
    
    // jQuery Deferred exception handler
    if ($.Deferred && $.Deferred.exceptionHook) {
        const originalHook = $.Deferred.exceptionHook;
        $.Deferred.exceptionHook = function(error, stack) {
            if (error && error.message && 
                (error.message.includes('datepicker') || 
                 error.message.includes('.on is not a function'))) {
                console.warn('Deferred exception handled:', error.message);
                return;
            }
            if (originalHook) originalHook.call(this, error, stack);
        };
    }
});

class PerformanceMonitor {
    constructor() {
        this.observer = null;
        this.measurements = new Map();
        this.init();
    }
    
    init() {
        if ('PerformanceObserver' in window) {
            try {
                this.observer = new PerformanceObserver((list) => {
                    list.getEntries().forEach(entry => {
                        if (!entry.hadRecentInput && entry.value > 0.1) {
                            this.measurements.set('layout-shift', entry.value);
                        }
                    });
                });
                this.observer.observe({ entryTypes: ['layout-shift'] });
            } catch (error) {
                console.warn('PerformanceObserver init failed:', error);
            }
        }
    }
    
    measure(fn, name = 'Operation') {
        try {
            const start = performance.now();
            const result = fn();
            const duration = performance.now() - start;
            this.measurements.set(name, duration);
            return result;
        } catch (error) {
            console.warn(`Performance measurement failed for ${name}:`, error);
            return null;
        }
    }
    
    getReport() {
        console.table(Object.fromEntries(this.measurements));
    }
}

class DOMBatcher {
    constructor() {
        this.reads = [];
        this.writes = [];
        this.scheduled = false;
    }
    
    read(fn) {
        this.reads.push(fn);
        this.schedule();
        return this;
    }
    
    write(fn) {
        this.writes.push(fn);
        this.schedule();
        return this;
    }
    
    schedule() {
        if (this.scheduled) return;
        this.scheduled = true;
        
        requestAnimationFrame(() => {
            try {
                const readResults = this.reads.map(fn => {
                    try {
                        return fn();
                    } catch (error) {
                        console.warn('DOM read operation failed:', error);
                        return null;
                    }
                });
                
                this.writes.forEach((fn, index) => {
                    try {
                        fn(readResults[index]);
                    } catch (error) {
                        console.warn('DOM write operation failed:', error);
                    }
                });
                
                this.reads = this.writes = [];
                this.scheduled = false;
            } catch (error) {
                console.warn('DOM batching failed:', error);
                this.reads = this.writes = [];
                this.scheduled = false;
            }
        });
    }
}

class LazySliderLoader {
    constructor() {
        this.observer = null;
        this.loadedSliders = new Set();
        this.init();
    }
    
    init() {
        if (!('IntersectionObserver' in window)) {
            this.loadAllSliders();
            return;
        }
        
        try {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
                        this.loadSlider(entry.target);
                    }
                });
            }, { rootMargin: '50px 0px', threshold: [0, 0.1, 0.5] });
        } catch (error) {
            console.warn('IntersectionObserver init failed:', error);
            this.loadAllSliders();
        }
    }
    
    observe(element, sliderConfig) {
        if (this.observer) {
            element._sliderConfig = sliderConfig;
            this.observer.observe(element);
        } else {
            this.loadSlider(element, sliderConfig);
        }
    }
    
    loadSlider(element, config = null) {
        try {
            const selector = this.getSelector(element);
            if (this.loadedSliders.has(selector)) return;
            
            this.loadedSliders.add(selector);
            this.observer?.unobserve(element);
            
            const sliderConfig = config || element._sliderConfig || sliderConfigs[selector];
            
            if (sliderConfig && $(element).length > 0) {
                perfMonitor.measure(() => $(element).owlCarousel(sliderConfig), `Slider: ${selector}`);
            }
        } catch (error) {
            console.warn('Slider loading failed:', error);
        }
    }
    
    getSelector(element) {
        return '.' + Array.from(element.classList).find(cls => cls.includes('slider') || cls.includes('carousel'));
    }
    
    loadAllSliders() {
        Object.entries(sliderConfigs).forEach(([selector, config], index) => {
            setTimeout(() => {
                requestAnimationFrame(() => {
                    try {
                        const $slider = $(selector);
                        if ($slider.length > 0) {
                            perfMonitor.measure(() => $slider.owlCarousel(config), `Slider: ${selector}`);
                        }
                    } catch (error) {
                        console.warn(`Slider initialization failed for ${selector}:`, error);
                    }
                });
            }, index * 100);
        });
    }
}

const GPU_OPTIMIZED_CLASSES = 'will-change-transform gpu-layer';

const createResponsive = (items) => {
    const base = { nav: false, dots: false };
    const enhanced = { nav: false, dots: true };
    const desktop = { nav: false, dots: true };
    
    if (Array.isArray(items)) {
        return {
            0: { ...base, items: items[0] },
            485: { ...enhanced, items: items[1] || items[0] },
            728: { ...base, items: items[2] || items[1] || items[0] },
            900: { ...enhanced, items: items[3] || items[2] || items[1] || items[0] },
            1200: { ...desktop, items: items[4] || items[3] || items[2] || items[1] || items[0] }
        };
    }
    
    return {
        0: { ...base, items },
        485: { ...enhanced, items },
        728: { ...base, items },
        900: { ...enhanced, items },
        1200: { ...desktop, items }
    };
};

const baseSliderConfig = {
    lazyLoad: true,
    responsiveClass: true,
    slideBy: 1,
    mouseDrag: true,
    touchDrag: true,
    onInitialized: function() { 
        try {
            this.$element.addClass(GPU_OPTIMIZED_CLASSES);
        } catch (error) {
            console.warn('Slider GPU optimization failed:', error);
        }
    }
};

const sliderConfigs = {
    '.buyuk-slider': {
        ...baseSliderConfig,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        loop: true,
        margin: 0,
        items: 1,
        center: true,
        nav: true,
        dots: true,
        responsive: {
            0: { items: 1, nav: false, dots: false },
            485: { items: 1, nav: false, dots: true },
            1200: { items: 1, nav: true, dots: false }
        }
    },

    '.haber-slider': {
        ...baseSliderConfig,
        autoplay: false,
        autoplayHoverPause: true,
        autoplayTimeout: 4000,
        loop: true,
        margin: 20,
        nav: false,
        dots: true,
        responsive: createResponsive([2, 2, 3, 3, 4])
    },

    '.video-slider': {
        ...baseSliderConfig,
        autoplay: false,
        autoplayHoverPause: true,
        autoplayTimeout: 5000,
        loop: false,
        margin: 20,
        dots: true,
        nav: false,
        video: true,
        responsive: createResponsive([2, 2, 2, 3, 4])
    },

    '.tanitim-slider': {
        ...baseSliderConfig,
        autoplay: true,
        autoplayHoverPause: true,
        autoplayTimeout: 6000,
        loop: true,
        margin: 20,
        nav: false,
        dots: true,
        responsive: {
            0: { items: 1, nav: false, dots: false },
            485: { items: 1, nav: false, dots: true },
            1200: { items: 1, nav: false, dots: true }
        }
    },

    '.proje-slider': {
        ...baseSliderConfig,
        margin: 20,
        nav: false,
        dots: true,
        responsive: createResponsive([2, 2, 2, 2, 4])
    },

    '.icerik-slider': {
        ...baseSliderConfig,
        autoplay: true,
        autoplayTimeout: 4000,
        loop: false,
        margin: 20,
        nav: false,
        dots: true,
        responsive: createResponsive([2, 2, 2, 2, 4])
    },

    '.icerik-diger': {
        ...baseSliderConfig,
        autoplay: true,
        autoplayTimeout: 4500,
        loop: false,
        margin: 20,
        nav: false,
        dots: true,
        responsive: createResponsive([2, 2, 2, 2, 4])
    },

    '.etkinlik-slider': {
        ...baseSliderConfig,
        autoplay: true,
        autoplayTimeout: 5000,
        loop: true,
        margin: 10,
        dots: true,
        nav: false,
        responsive: createResponsive(1)
    }
};

class SimplifiedTabSystem {
    constructor() {
        this.activeTab = null;
        this.initTimeout = null;
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setDefaultTab();
    }
    
    bindEvents() {
        window.etkinlikler = (evt, cityName) => this.switchTab(evt, cityName);
        
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tablinks')) {
                const onclick = e.target.getAttribute('onclick');
                if (onclick) {
                    const match = onclick.match(/etkinlikler\([^,]+,\s*'([^']+)'/);
                    if (match) {
                        e.preventDefault();
                        this.switchTab(e.target, match[1]);
                    }
                }
            }
        });
    }
    
    switchTab(button, cityName) {
        try {
            if (this.initTimeout) clearTimeout(this.initTimeout);
            
            this.hideAllTabs();
            this.showTab(cityName);
            this.setActiveButton(button);
            this.activeTab = cityName;
            
            this.initTimeout = setTimeout(() => this.initializeTabSliders(cityName), 200);
        } catch (error) {
            console.warn('Tab switching failed:', error);
        }
    }
    
    hideAllTabs() {
        document.querySelectorAll('.tabcontent').forEach(content => content.style.display = 'none');
        document.querySelectorAll('.tablinks').forEach(button => button.classList.remove('active'));
    }
    
    showTab(cityName) {
        const targetTab = document.getElementById(cityName);
        if (targetTab) targetTab.style.display = 'block';
    }
    
    setActiveButton(button) {
        if (button?.classList) button.classList.add('active');
    }
    
    initializeTabSliders(tabId) {
        try {
            const tabElement = document.getElementById(tabId);
            if (!tabElement) return;
            
            const sliderElements = tabElement.querySelectorAll('[class*="slider"], .owl-carousel');
            
            sliderElements.forEach((element, index) => {
                const sliderClass = '.' + Array.from(element.classList).find(cls => 
                    cls.includes('slider') || cls.includes('carousel')
                );
                
                if (sliderClass && sliderConfigs[sliderClass]) {
                    setTimeout(() => {
                        try {
                            const $element = $(element);
                            
                            if ($element.hasClass('owl-loaded')) {
                                $element.trigger('destroy.owl.carousel').removeClass('owl-loaded');
                            }
                            
                            $element.owlCarousel(sliderConfigs[sliderClass]);
                            
                            if (sliderClass !== '.buyuk-slider') {
                                setTimeout(() => {
                                    $element.find('.owl-prev, .owl-next').hide();
                                    $element.addClass('nav-disabled');
                                }, 100);
                            }
                        } catch (error) {
                            console.warn('Tab slider initialization failed:', sliderClass, error);
                        }
                    }, index * 100);
                }
            });
        } catch (error) {
            console.warn('Tab sliders initialization failed:', error);
        }
    }
    
    setDefaultTab() {
        const defaultTab = document.getElementById('defaultOpen');
        if (defaultTab) setTimeout(() => defaultTab.click(), 100);
    }
    
    refreshTab(tabId) {
        if (this.activeTab === tabId) this.initializeTabSliders(tabId);
    }
}

class OptimizedDropdown {
    constructor() {
        document.addEventListener('click', this.handleClick.bind(this), { passive: true });
    }
    
    handleClick(e) {
        if (e.target.closest('.dropdown-menu')) e.stopPropagation();
    }
}

class LazyLightbox {
    constructor() {
        this.loaded = false;
        this.observer = null;
        this.init();
    }
    
    init() {
        if (!document.querySelector('[data-fslightbox]')) return;
        
        try {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.loaded) this.loadLightbox();
                });
            });
            
            document.querySelectorAll('[data-fslightbox]').forEach(el => this.observer.observe(el));
        } catch (error) {
            console.warn('Lightbox observer init failed:', error);
        }
    }
    
    async loadLightbox() {
        if (this.loaded) return;
        
        try {
            await import('fslightbox');
            this.loaded = true;
            this.observer?.disconnect();
        } catch (error) {
            console.warn('Lightbox loading failed:', error);
        }
    }
}

class SmartResizeHandler {
    constructor() {
        this.resizeTimer = null;
        this.callbacks = new Set();
        window.addEventListener('resize', this.handleResize.bind(this), { passive: true });
    }
    
    handleResize() {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
            requestAnimationFrame(() => {
                this.callbacks.forEach(callback => {
                    try {
                        callback();
                    } catch (error) {
                        console.warn('Resize callback failed:', error);
                    }
                });
            });
        }, 250);
    }
    
    addCallback(callback) { this.callbacks.add(callback); }
    removeCallback(callback) { this.callbacks.delete(callback); }
}

class SliderManager {
    constructor() {
        this.loadedSliders = new Map();
        this.retryCount = new Map();
        this.maxRetries = 3;
    }
    
    async initializeSlider(selector, config, priority = 'normal') {
        if (this.loadedSliders.has(selector)) return;
        
        try {
            const $element = $(selector);
            if ($element.length === 0) {
                if ((this.retryCount.get(selector) || 0) < this.maxRetries) {
                    this.retryCount.set(selector, (this.retryCount.get(selector) || 0) + 1);
                    setTimeout(() => this.initializeSlider(selector, config, priority), 500);
                }
                return;
            }
            
            const delays = { high: 0, normal: 100, low: 300 };
            const delay = delays[priority] || 100;
            
            setTimeout(() => {
                requestAnimationFrame(() => {
                    perfMonitor.measure(() => {
                        try {
                            $element.owlCarousel(config);
                            this.loadedSliders.set(selector, true);
                            this.optimizeSlider($element, selector);
                        } catch (error) {
                            console.warn('Slider initialization failed:', selector, error);
                        }
                    }, `Slider Init: ${selector}`);
                });
            }, delay);
        } catch (error) {
            console.warn('Slider manager initialization failed:', selector, error);
        }
    }
    
    optimizeSlider($element, selector) {
        try {
            $element.addClass(GPU_OPTIMIZED_CLASSES);
            
            if (selector !== '.buyuk-slider') {
                $element.find('.owl-prev, .owl-next').hide();
                $element.addClass('nav-disabled');
            }
            
            if ('ontouchstart' in window) {
                $element.on('touchstart', { passive: true }, () => {});
            }
        } catch (error) {
            console.warn('Slider optimization failed:', error);
        }
    }
    
    refreshSlider(selector) {
        try {
            const $slider = $(selector);
            if ($slider.length === 0) return;
            
            if ($slider.hasClass('owl-loaded')) {
                $slider.trigger('destroy.owl.carousel').removeClass('owl-loaded');
                $slider.find('.owl-stage-outer').children().unwrap();
            }
            
            this.loadedSliders.delete(selector);
            
            if (sliderConfigs[selector]) {
                this.initializeSlider(selector, sliderConfigs[selector]);
            }
        } catch (error) {
            console.warn('Slider refresh failed:', selector, error);
        }
    }
    
    refreshAllSliders() {
        Object.keys(sliderConfigs).forEach(selector => this.refreshSlider(selector));
    }
}

class AppInitializer {
    constructor() {
        this.initialized = false;
        this.initPromise = null;
    }
    
    async init() {
        if (this.initialized) return this.initPromise;
        this.initPromise = this.performInit();
        return this.initPromise;
    }
    
    async performInit() {
        try {
            await this.initCriticalUI();
            setTimeout(() => this.initImportantSliders(), 100);
            setTimeout(() => this.initSecondarySliders(), 300);
            setTimeout(() => this.initOptionalFeatures(), 500);
            this.initialized = true;
        } catch (error) {
            console.warn('App initialization failed:', error);
        }
    }
    
    async initCriticalUI() {
        try {
            window.tabSystem = new SimplifiedTabSystem();
            new OptimizedDropdown();
            resizeHandler.addCallback(() => sliderManager.refreshAllSliders());
        } catch (error) {
            console.warn('Critical UI initialization failed:', error);
        }
    }
    
    async initImportantSliders() {
        const criticalSliders = ['.buyuk-slider', '.tanitim-slider'];
        
        for (const selector of criticalSliders) {
            if (sliderConfigs[selector]) {
                await sliderManager.initializeSlider(selector, sliderConfigs[selector], 'high');
            }
        }
    }
    
    async initSecondarySliders() {
        const secondarySliders = ['.haber-slider', '.video-slider', '.proje-slider'];
        
        secondarySliders.forEach((selector, index) => {
            setTimeout(() => {
                document.querySelectorAll(selector).forEach(element => {
                    const isInTab = element.closest('.tabcontent');
                    if (!isInTab && sliderConfigs[selector]) {
                        sliderManager.initializeSlider(selector, sliderConfigs[selector], 'normal');
                    }
                });
            }, index * 100);
        });
    }
    
    async initOptionalFeatures() {
        const remainingSliders = ['.icerik-slider', '.icerik-diger', '.etkinlik-slider'];
        
        remainingSliders.forEach((selector, index) => {
            setTimeout(() => {
                sliderManager.initializeSlider(selector, sliderConfigs[selector], 'low');
            }, index * 200);
        });
        
        new LazyLightbox();
    }
}

// Global instance'lar
const perfMonitor = new PerformanceMonitor();
const domBatcher = new DOMBatcher();
const lazyLoader = new LazySliderLoader();
const resizeHandler = new SmartResizeHandler();
const sliderManager = new SliderManager();

// Global fonksiyonlar
window.etkinlikler = function(evt, cityName) {
    try {
        window.tabSystem?.switchTab(evt.currentTarget, cityName);
    } catch (error) {
        console.warn('Etkinlikler function failed:', error);
    }
};

// Public API
window.SliderAPI = {
    refresh: (selector) => sliderManager.refreshSlider(selector),
    refreshAll: () => sliderManager.refreshAllSliders(),
    getPerformanceReport: () => perfMonitor.getReport(),
    addResizeCallback: (callback) => resizeHandler.addCallback(callback),
    removeResizeCallback: (callback) => resizeHandler.removeCallback(callback),
    refreshTab: (tabId) => window.tabSystem?.refreshTab(tabId),
    
    forceLoadSlider: (selector) => {
        document.querySelectorAll(selector).forEach(element => {
            const $element = $(element);
            if (sliderConfigs[selector] && !$element.hasClass('owl-loaded')) {
                try {
                    $element.owlCarousel(sliderConfigs[selector]);
                    if (selector !== '.buyuk-slider') {
                        setTimeout(() => {
                            $element.find('.owl-prev, .owl-next').hide();
                            $element.addClass('nav-disabled');
                        }, 100);
                    }
                } catch (error) {
                    console.warn('Force load slider failed:', selector, error);
                }
            }
        });
    },
    
    hideAllNavExceptBuyuk: () => {
        try {
            $('.owl-carousel').each(function() {
                const $this = $(this);
                if (!$this.hasClass('buyuk-slider')) {
                    $this.find('.owl-prev, .owl-next').hide();
                    $this.addClass('nav-disabled');
                }
            });
        } catch (error) {
            console.warn('Hide navigation failed:', error);
        }
    }
};

function injectOptimizationCSS() {
    try {
        const css = `
            .will-change-transform { will-change: transform; }
            .gpu-layer { transform: translateZ(0); }
            .smooth-transition { transition: transform 0.3s ease; }
            .owl-carousel { transform: translateZ(0); }
            .owl-stage { will-change: transform; }
            .owl-item { backface-visibility: hidden; }
            .slider-loading { opacity: 0.7; }
            .slider-loaded { opacity: 1; transition: opacity 0.3s ease; }
            .tabcontent { display: none; }
            .tabcontent.active { display: block; }
            .tablinks.active { background-color: #d60b28; color: white; }
            .owl-carousel .owl-item img { width: 100%; height: auto; }
            .owl-carousel:not(.buyuk-slider) .owl-prev,
            .owl-carousel:not(.buyuk-slider) .owl-next,
            .nav-disabled .owl-prev,
            .nav-disabled .owl-next {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
            }
            .buyuk-slider .owl-prev,
            .buyuk-slider .owl-next {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    } catch (error) {
        console.warn('CSS injection failed:', error);
    }
}

function checkCSSLoading() {
    try {
        const cssLoaded = Array.from(document.styleSheets).some(sheet => {
            try {
                return sheet.href?.includes('styles.css');
            } catch(e) {
                return false;
            }
        });
        
        if (!cssLoaded) {
            const fallbackCSS = `
                body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
                .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
                .btn { padding: 10px 15px; background: #007bff; color: white; border: none; cursor: pointer; }
                .tab { background: #f8f9fa; padding: 10px; }
                .tablinks { padding: 10px 20px; margin: 5px; background: #dee2e6; border: none; cursor: pointer; }
                .tablinks.active { background: #d60b28; color: white; }
                .tabcontent { padding: 20px; border: 1px solid #dee2e6; }
            `;
            
            const fallbackStyle = document.createElement('style');
            fallbackStyle.textContent = fallbackCSS;
            document.head.appendChild(fallbackStyle);
        }
    } catch (error) {
        console.warn('CSS loading check failed:', error);
    }
}

// CSS injection
injectOptimizationCSS();
checkCSSLoading();

// App initialization
const app = new AppInitializer();

function safeInit() {
    try {
        app.init();
    } catch (error) {
        console.warn('Safe init fallback triggered:', error);
        setTimeout(() => {
            Object.keys(sliderConfigs).forEach(selector => {
                try {
                    const $element = $(selector);
                    if ($element.length > 0 && !$element.hasClass('owl-loaded')) {
                        $element.owlCarousel(sliderConfigs[selector]);
                        
                        if (selector !== '.buyuk-slider') {
                            setTimeout(() => {
                                $element.find('.owl-prev, .owl-next').hide();
                                $element.addClass('nav-disabled');
                            }, 100);
                        }
                    }
                } catch (sliderError) {
                    console.warn('Fallback slider failed:', selector, sliderError);
                }
            });
        }, 1000);
    }
}

// Initialization handlers
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', safeInit);
} else {
    safeInit();
}

// jQuery ready fallback
$(document).ready(() => {
    try {
        if (!app.initialized) safeInit();
    } catch (error) {
        console.warn('jQuery ready handler failed:', error);
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    try {
        perfMonitor.observer?.disconnect();
        lazyLoader.observer?.disconnect();
        
        // Clear all timeouts and intervals
        if (window.tabSystem && window.tabSystem.initTimeout) {
            clearTimeout(window.tabSystem.initTimeout);
        }
        
        // Remove event listeners if possible
        resizeHandler.callbacks.clear();
    } catch (error) {
        console.warn('Cleanup failed:', error);
    }
});

// Debug mode for development
if (typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    window.DEBUG = { 
        perfMonitor, 
        sliderManager, 
        app, 
        domBatcher, 
        lazyLoader,
        // Debug fonksiyonları
        testDatepicker: () => {
            console.log('Testing datepicker fallback...');
            const testInput = $('<input type="text" id="test-datepicker">');
            $('body').append(testInput);
            testInput.datepicker({
                onSelect: (date) => console.log('Date selected:', date)
            });
            testInput.on('change', () => console.log('Change event works!'));
            console.log('Datepicker test completed. Check console for results.');
        },
        clearErrors: () => {
            console.clear();
            console.log('Error console cleared. Fresh start!');
        }
    };
}