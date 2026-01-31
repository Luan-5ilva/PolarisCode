// ====================================
// POLARIS CODE - MAIN SCRIPT
// ====================================

// Estado da aplicação
const appState = {
    isMenuOpen: false,
    currentSection: 'home',
    scrollPosition: 0,
    isScrolling: false
};

// ====================================
// INICIALIZAÇÃO
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupScrollEffects();
    setupAnimations();
    setupForm();
    setupVideoBackground();
    setupIntersectionObserver();
}

// ====================================
// NAVEGAÇÃO
// ====================================

function setupNavigation() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');

    // Toggle menu mobile
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            appState.isMenuOpen = !appState.isMenuOpen;
            mobileMenuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = appState.isMenuOpen ? 'hidden' : '';
        });
    }

    // Smooth scroll e fechamento do menu
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Fechar menu mobile se estiver aberto
                if (appState.isMenuOpen) {
                    appState.isMenuOpen = false;
                    mobileMenuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }

                // Smooth scroll
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Atualizar link ativo
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                appState.currentSection = targetId.replace('#', '');
            }
        });
    });

    // Destacar link ativo baseado na posição do scroll
    window.addEventListener('scroll', debounce(() => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
                appState.currentSection = sectionId;
            }
        });
    }, 100));
}

// ====================================
// EFEITOS DE SCROLL
// ====================================

function setupScrollEffects() {
    const header = document.querySelector('.header');
    let lastScrollPosition = 0;

    window.addEventListener('scroll', debounce(() => {
        const currentScrollPosition = window.pageYOffset;

        // Adicionar classe 'scrolled' ao header
        if (currentScrollPosition > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Parallax effect no vídeo de fundo
        const videoBackground = document.querySelector('.video-background video');
        if (videoBackground) {
            const scrolled = currentScrollPosition;
            videoBackground.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.3}px))`;
        }

        lastScrollPosition = currentScrollPosition;
        appState.scrollPosition = currentScrollPosition;
    }, 10));
}

// ====================================
// ANIMAÇÕES
// ====================================

function setupAnimations() {
    // Animação da estrela no hero
    const starIcon = document.querySelector('.star-icon svg');
    if (starIcon) {
        let rotation = 0;
        setInterval(() => {
            rotation += 0.5;
            // A rotação já é feita via CSS, mas podemos adicionar efeitos extras aqui
        }, 50);
    }

    // Contador animado para estatísticas
    animateCounters();

    // Efeito hover nos cards de serviço
    setupCardEffects();
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // Velocidade da animação

    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        let current = 0;
        const increment = target / speed;
        const isPercentage = counter.textContent.includes('%');
        const hasPlus = counter.textContent.includes('+');

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.ceil(current) + (isPercentage ? '%' : hasPlus ? '+' : '');
                setTimeout(updateCounter, 1);
            } else {
                counter.textContent = target + (isPercentage ? '%' : hasPlus ? '+' : '');
            }
        };

        // Iniciar animação quando o elemento estiver visível
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(counter);
    });
}

function setupCardEffects() {
    const cards = document.querySelectorAll('.servico-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Adicionar efeito de brilho na posição do mouse
            const glow = document.createElement('div');
            glow.style.position = 'absolute';
            glow.style.left = x + 'px';
            glow.style.top = y + 'px';
            glow.style.width = '100px';
            glow.style.height = '100px';
            glow.style.background = 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)';
            glow.style.borderRadius = '50%';
            glow.style.pointerEvents = 'none';
            glow.style.transform = 'translate(-50%, -50%)';
            glow.style.transition = 'opacity 0.5s ease';

            card.style.position = 'relative';
            card.appendChild(glow);

            setTimeout(() => {
                glow.style.opacity = '0';
                setTimeout(() => glow.remove(), 500);
            }, 100);
        });

        // Efeito de movimento 3D
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ====================================
// VÍDEO DE FUNDO
// ====================================

function setupVideoBackground() {
    const video = document.getElementById('bg-video');

    if (video) {
        // Garantir que o vídeo está tocando
        const playVideo = () => {
            video.play().catch(error => {
                console.log('Autoplay prevented:', error);
                // Se autoplay falhar, tentar novamente após interação do usuário
                document.addEventListener('click', () => {
                    video.play();
                }, { once: true });
            });
        };

        // Tentar tocar quando o vídeo estiver pronto
        video.addEventListener('loadeddata', playVideo);

        // Ajustar qualidade do vídeo baseado na conexão
        if ('connection' in navigator) {
            const connection = navigator.connection;
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                video.style.display = 'none'; // Ocultar vídeo em conexões lentas
            }
        }

        // Pausar vídeo quando a aba não está visível (economizar recursos)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                video.pause();
            } else {
                video.play();
            }
        });
    }
}

// ====================================
// INTERSECTION OBSERVER
// ====================================

function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Animar elementos filhos com delay
                const children = entry.target.querySelectorAll('[data-animate]');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('visible');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Observar seções e cards
    const elementsToObserve = document.querySelectorAll('section, .servico-card, .processo-item, .stat-item');
    elementsToObserve.forEach(element => {
        observer.observe(element);
    });
}

// ====================================
// FORMULÁRIO DE CONTATO
// ====================================

function setupForm() {
    const form = document.getElementById('contactForm');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Coletar dados do formulário
            const formData = {
                nome: document.getElementById('nome').value.trim(),
                email: document.getElementById('email').value.trim(),
                telefone: document.getElementById('telefone').value.trim(),
                mensagem: document.getElementById('mensagem').value.trim()
            };

            // Validação básica
            if (!validateForm(formData)) {
                return;
            }

            // Desabilitar botão de envio
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';

            try {
                // AQUI VOCÊ DEVE INTEGRAR COM SUA API DE BACKEND
                // Exemplo de chamada:
                // const response = await fetch('/api/contato', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json'
                //     },
                //     body: JSON.stringify(formData)
                // });

                // Simulação de envio (remover em produção)
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Feedback de sucesso
                showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
                form.reset();

            } catch (error) {
                console.error('Erro ao enviar formulário:', error);
                showNotification('Erro ao enviar mensagem. Por favor, tente novamente.', 'error');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });

        // Validação em tempo real
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateField(input);
            });

            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateField(input);
                }
            });
        });
    }
}

function validateForm(data) {
    let isValid = true;

    // Validar nome
    if (data.nome.length < 3) {
        showFieldError('nome', 'Nome deve ter pelo menos 3 caracteres');
        isValid = false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showFieldError('email', 'E-mail inválido');
        isValid = false;
    }

    // Validar mensagem
    if (data.mensagem.length < 10) {
        showFieldError('mensagem', 'Mensagem deve ter pelo menos 10 caracteres');
        isValid = false;
    }

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    switch (field.id) {
        case 'nome':
            if (value.length < 3) {
                errorMessage = 'Nome deve ter pelo menos 3 caracteres';
                isValid = false;
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'E-mail inválido';
                isValid = false;
            }
            break;
        case 'mensagem':
            if (value.length < 10) {
                errorMessage = 'Mensagem deve ter pelo menos 10 caracteres';
                isValid = false;
            }
            break;
    }

    if (!isValid) {
        showFieldError(field.id, errorMessage);
    } else {
        clearFieldError(field.id);
    }

    return isValid;
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    field.classList.add('error');
    field.style.borderColor = '#ff4444';

    // Remover mensagem de erro anterior
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Adicionar nova mensagem de erro
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#ff4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.5rem';
    errorDiv.textContent = message;
    field.parentElement.appendChild(errorDiv);
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    field.classList.remove('error');
    field.style.borderColor = '';

    const errorMessage = field.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// ====================================
// NOTIFICAÇÕES
// ====================================

function showNotification(message, type = 'info') {
    // Remover notificação anterior se existir
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Criar notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#FFD700' : '#ff4444'};
        color: ${type === 'success' ? '#000' : '#fff'};
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
        font-weight: 500;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remover após 5 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ====================================
// UTILITÁRIOS
// ====================================

// Debounce function para otimizar performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Detectar dispositivo móvel
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Adicionar animação de entrada nas animações CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ====================================
// PERFORMANCE OPTIMIZATION
// ====================================

// Lazy loading de imagens
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    // Observar todas as imagens com data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Log de inicialização
console.log('%c🌟 Polaris Code', 'font-size: 20px; font-weight: bold; color: #FFD700;');
console.log('%cSua estrela guia em tecnologia', 'font-size: 14px; color: #a0a0a0;');
console.log('%cWebsite carregado com sucesso!', 'font-size: 12px; color: #4CAF50;');
