document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.nav-toggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('nav-open');
        });
    }

    const filterBtns = document.querySelectorAll('.filter-btn');
    const workCards = document.querySelectorAll('.work-card');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            workCards.forEach(card => {
                const match = filter === 'all' || card.dataset.category === filter;
                card.classList.toggle('is-hidden', !match);
            });
        });
    });

    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        revealEls.forEach(el => observer.observe(el));
    }

    const staggerEls = document.querySelectorAll('.reveal-stagger');
    if (staggerEls.length) {
        const staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const step = parseInt(entry.target.dataset.stagger, 10) || 70;
                    Array.from(entry.target.children).forEach((child, i) => {
                        child.style.transitionDelay = `${i * step}ms`;
                    });
                    entry.target.classList.add('is-visible');
                    staggerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        staggerEls.forEach(el => staggerObserver.observe(el));
    }

    const statEls = document.querySelectorAll('.stat-num[data-count]');
    if (statEls.length) {
        const animateCount = (el) => {
            const target = parseInt(el.dataset.count, 10);
            const suffix = el.dataset.suffix || '';
            const duration = 1400;
            const start = performance.now();
            const step = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(target * eased) + suffix;
                if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        };
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    statObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        statEls.forEach(el => statObserver.observe(el));
    }

    const chatToggle = document.getElementById('chatToggle');
    const chatPanel = document.getElementById('chatPanel');
    const chatClose = document.getElementById('chatClose');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatBody = document.getElementById('chatBody');

    if (chatToggle && chatPanel) {
        chatToggle.addEventListener('click', () => {
            chatPanel.classList.toggle('is-open');
            if (chatPanel.classList.contains('is-open')) chatInput.focus();
        });
        chatClose.addEventListener('click', () => chatPanel.classList.remove('is-open'));

        const lead = { name: '', email: '', message: '' };
        let chatStep = 0;

        const addMsg = (text, from) => {
            const msg = document.createElement('div');
            msg.className = `chat-msg ${from}`;
            msg.textContent = text;
            chatBody.appendChild(msg);
            chatBody.scrollTop = chatBody.scrollHeight;
        };

        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;

            addMsg(text, 'user');
            chatInput.value = '';

            setTimeout(() => {
                if (chatStep === 0) {
                    lead.name = text;
                    addMsg(`Thanks, ${lead.name}! What's the best email to reach you on?`, 'ai');
                    chatStep = 1;
                } else if (chatStep === 1) {
                    lead.email = text;
                    addMsg("Great — and what can we help you with?", 'ai');
                    chatStep = 2;
                } else if (chatStep === 2) {
                    lead.message = text;
                    addMsg(`Thanks, ${lead.name}! One of our colleagues will get back to you at ${lead.email} shortly.`, 'ai');
                    chatStep = 3;
                } else {
                    addMsg("Noted — we've added that to your enquiry. We'll be in touch soon.", 'ai');
                }
            }, 700);
        });
    }
});
