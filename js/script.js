// Aguarda o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const themeToggleBtn = document.getElementById('themeToggle');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const menuCategories = document.querySelectorAll('.menu-category');
    const saveBtn = document.getElementById('saveBtn');
    const routesBtn = document.getElementById('routesBtn');
    const sendToPhoneBtn = document.getElementById('sendToPhoneBtn');
    const shareBtn = document.getElementById('shareBtn');
    const phoneModal = document.getElementById('phoneModal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const sections = document.querySelectorAll('section');
    const hoursStatusElement = document.getElementById('hoursStatus');
    
    // Horários de funcionamento
    const businessHours = {
        weekdays: { // Segunda a Sábado
            open: 12, // 12:00
            close: 23 // 23:00
        },
        sunday: {
            open: 12, // 12:00
            close: 17 // 17:00
        }
    };
    
    // Alternar modo claro/escuro
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.body.classList.remove('dark-mode');
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }
    
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
    
    // Menu mobile
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Fechar menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Navegação suave
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
    
    // Alternar categorias do cardápio
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove a classe active de todos os botões
            categoryBtns.forEach(b => b.classList.remove('active'));
            
            // Adiciona a classe active ao botão clicado
            btn.classList.add('active');
            
            // Obtém a categoria
            const category = btn.getAttribute('data-category');
            
            // Esconde todas as categorias do cardápio
            menuCategories.forEach(cat => {
                cat.classList.remove('active');
            });
            
            // Mostra a categoria selecionada
            document.getElementById(category).classList.add('active');
        });
    });
    
    // Botão Salvar (com animação e localStorage)
    saveBtn.addEventListener('click', function() {
        const isSaved = localStorage.getItem('restaurantSaved') === 'true';
        
        if (isSaved) {
            // Remover dos salvos
            localStorage.setItem('restaurantSaved', 'false');
            this.innerHTML = '<i class="far fa-bookmark"></i> Salvar';
            
            // Animação de remoção
            this.classList.add('btn-secondary');
            this.classList.remove('btn-primary');
            
            // Notificação visual
            showNotification('Restaurante removido dos salvos!', 'info');
        } else {
            // Salvar
            localStorage.setItem('restaurantSaved', 'true');
            this.innerHTML = '<i class="fas fa-bookmark"></i> Salvo';
            
            // Animação de salvamento
            this.classList.remove('btn-secondary');
            this.classList.add('btn-primary');
            
            // Efeito de pulso
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 300);
            
            // Notificação visual
            showNotification('Restaurante salvo com sucesso!', 'success');
        }
    });
    
    // Verificar se o restaurante já está salvo ao carregar a página
    function checkSavedStatus() {
        if (localStorage.getItem('restaurantSaved') === 'true') {
            saveBtn.innerHTML = '<i class="fas fa-bookmark"></i> Salvo';
            saveBtn.classList.remove('btn-secondary');
            saveBtn.classList.add('btn-primary');
        }
    }
    
    // Botão Rotas (simulação)
    routesBtn.addEventListener('click', () => {
        showNotification('Abrindo rotas no seu aplicativo de mapas...', 'info');
        
        // Simular abertura do Google Maps
        setTimeout(() => {
            window.open('https://www.google.com/maps/dir//R.+J%C3%BAlio+Prestes,+192+-+Centro,+Mogi+das+Cruzes+-+SP,+08780-110', '_blank');
        }, 500);
    });
    
    // Botão Enviar para Smartphone (se existir)
    if (sendToPhoneBtn) {
        sendToPhoneBtn.addEventListener('click', () => {
            openModal(phoneModal);
        });
    }
    
    // Sistema de modais
    function openModal(modal) {
        modal.classList.add('active');
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // Fechar modal ao clicar no overlay ou no botão fechar
    modalOverlay.addEventListener('click', closeModal);
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Função para verificar se o restaurante está aberto
    function checkBusinessHours() {
        const now = new Date();
        const currentDay = now.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTime = currentHour + currentMinute / 60;
        
        let isOpen = false;
        let nextOpening = null;
        let nextClosing = null;
        let message = '';
        
        // Verifica se é domingo
        if (currentDay === 0) {
            // Domingo
            isOpen = currentTime >= businessHours.sunday.open && currentTime < businessHours.sunday.close;
            nextOpening = businessHours.sunday.open;
            nextClosing = businessHours.sunday.close;
        } else {
            // Segunda a Sábado
            isOpen = currentTime >= businessHours.weekdays.open && currentTime < businessHours.weekdays.close;
            nextOpening = businessHours.weekdays.open;
            nextClosing = businessHours.weekdays.close;
        }
        
        // Calcula quanto tempo falta para abrir/fechar
        if (isOpen) {
            // Está aberto, calcula quanto tempo até fechar
            const closeTime = nextClosing;
            const hoursUntilClose = closeTime - currentTime;
            
            if (hoursUntilClose > 1) {
                message = `Aberto • Fecha em ${Math.floor(hoursUntilClose)}h${Math.round((hoursUntilClose % 1) * 60)}min`;
            } else if (hoursUntilClose > 0) {
                const minutesUntilClose = Math.round(hoursUntilClose * 60);
                message = `Aberto • Fecha em ${minutesUntilClose}min`;
            } else {
                message = 'Aberto • Fecha em breve';
            }
            
            return {
                status: 'open',
                message: message,
                hoursUntilClose: hoursUntilClose
            };
        } else {
            // Está fechado, calcula quanto tempo até abrir
            let hoursUntilOpen = 0;
            
            if (currentTime < nextOpening) {
                // Ainda vai abrir hoje
                hoursUntilOpen = nextOpening - currentTime;
            } else {
                // Já fechou, vai abrir amanhã
                if (currentDay === 6) {
                    // Sábado -> Domingo
                    hoursUntilOpen = (24 - currentTime) + businessHours.sunday.open;
                } else if (currentDay === 0) {
                    // Domingo -> Segunda
                    hoursUntilOpen = (24 - currentTime) + businessHours.weekdays.open;
                } else {
                    // Dia de semana -> Próximo dia
                    hoursUntilOpen = (24 - currentTime) + businessHours.weekdays.open;
                }
            }
            
            if (hoursUntilOpen > 24) {
                const days = Math.floor(hoursUntilOpen / 24);
                const hours = Math.floor(hoursUntilOpen % 24);
                message = `Fechado • Abre em ${days}d ${hours}h`;
            } else if (hoursUntilOpen > 1) {
                message = `Fechado • Abre em ${Math.floor(hoursUntilOpen)}h${Math.round((hoursUntilOpen % 1) * 60)}min`;
            } else {
                const minutesUntilOpen = Math.round(hoursUntilOpen * 60);
                message = `Fechado • Abre em ${minutesUntilOpen}min`;
            }
            
            return {
                status: 'closed',
                message: message,
                hoursUntilOpen: hoursUntilOpen
            };
        }
    }
    
    // Atualiza o status do horário de funcionamento
    function updateBusinessHoursStatus() {
        const status = checkBusinessHours();
        
        let statusHTML = '';
        if (status.status === 'open') {
            statusHTML = `
                <div class="hours-status open">
                    <i class="fas fa-door-open"></i>
                    <span>Aberto agora</span>
                </div>
                <div class="hours-countdown">${status.message}</div>
            `;
        } else {
            statusHTML = `
                <div class="hours-status closed">
                    <i class="fas fa-door-closed"></i>
                    <span>Fechado no momento</span>
                </div>
                <div class="hours-countdown">${status.message}</div>
            `;
        }
        
        hoursStatusElement.innerHTML = statusHTML;
    }
    
    // Notificação visual
    function showNotification(message, type) {
        // Remove notificação anterior se existir
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Cria nova notificação
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Estilo da notificação
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background-color: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1002;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
            max-width: 350px;
        `;
        
        document.body.appendChild(notification);
        
        // Remove após 3 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
    
    // Animação de entrada por scroll
    function checkScroll() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight - 100) {
                section.classList.add('show');
            }
        });
        
        // Animar cards de avaliação individualmente
        const reviewCards = document.querySelectorAll('.review-card');
        reviewCards.forEach((card, index) => {
            const cardTop = card.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (cardTop < windowHeight - 100) {
                // Delay para criar efeito cascata
                setTimeout(() => {
                    card.classList.add('show');
                }, index * 200);
            }
        });
    }
    
    // Inicialização
    function init() {
        initTheme();
        checkSavedStatus();
        updateBusinessHoursStatus(); // Inicializa o status do horário
        checkScroll(); // Verificar elementos visíveis no carregamento
        
        // Atualiza o status do horário a cada minuto
        setInterval(updateBusinessHoursStatus, 60000);
        
        // Adicionar classe hidden para animação de entrada
        sections.forEach(section => {
            if (!section.classList.contains('hero')) {
                section.classList.add('hidden');
            }
        });
        
        document.querySelectorAll('.review-card').forEach(card => {
            card.classList.add('hidden');
        });
    }
    
    // Event listeners para scroll e resize
    window.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    
    // Inicializar aplicação
    init();
});