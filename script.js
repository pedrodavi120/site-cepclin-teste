// Função que agrupa toda a lógica do site
const initializeSite = () => {
    // Seleção de elementos do DOM (feita uma vez para melhor performance)
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const heroSliderElement = document.querySelector('.hero-slider');
    const scrollers = document.querySelectorAll(".scroller");
    const toggleSponsorsBtn = document.getElementById('toggle-sponsors-btn');
    const sponsorsGrid = document.getElementById('sponsors-grid');
    const scrollerContainer = document.querySelector('.scroller');
    const chatToggle = document.getElementById('chat-toggle');
    const chatWidget = document.getElementById('chat-widget');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    // Inicialização do Feather Icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    // Lógica do Menu Mobile (CORRIGIDA)
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            const isOpened = mobileMenu.classList.toggle('open');
            // Altera diretamente o HTML do botão para o ícone correto
            if (isOpened) {
                mobileMenuButton.innerHTML = '<i data-feather="x" class="text-gray-600"></i>';
            } else {
                mobileMenuButton.innerHTML = '<i data-feather="menu" class="text-gray-600"></i>';
            }
            // Pede à biblioteca para renderizar o novo ícone
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        });
    }

    // Lógica do Slider Principal (Hero) com Swiper.js
    if (typeof Swiper !== 'undefined' && heroSliderElement) {
        new Swiper(heroSliderElement, {
            loop: true,
            autoplay: {
                delay: 9000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
        });
    }

    // Inicialização do AOS (Animate on Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
        });
    }

    // Carrossel infinito de patrocinadores
    if (scrollers.length > 0) {
        scrollers.forEach((scroller) => {
            scroller.setAttribute("data-animated", true);
            const scrollerInner = scroller.querySelector(".scroller__inner");
            if (scrollerInner) {
                const scrollerContent = Array.from(scrollerInner.children);
                scrollerContent.forEach((item) => {
                    const duplicatedItem = item.cloneNode(true);
                    duplicatedItem.setAttribute("aria-hidden", true);
                    scrollerInner.appendChild(duplicatedItem);
                });
            }
        });
    }

    // Lógica para expandir a grade de patrocinadores
    if (toggleSponsorsBtn && sponsorsGrid && scrollerContainer) {
        const sponsorNames = [
            "pfizer", "gsk", "jnj", "roche", "merck", "lilly", "astrazeneca", "sanofi", 
            "novartis", "bayer", "takeda", "biontech", "modernatx", "abbvie", "amgen", 
            "regeneron", "syneos", "iqvia", "parexel", "iconplc", "medpace", "covance", "quintiles"
        ];
        
        sponsorNames.forEach(name => {
            const img = document.createElement('img');
            img.src = `https://logo.clearbit.com/${name}.com`;
            img.alt = `Logo ${name}`;
            img.loading = 'lazy'; // Otimização: Carregar logos apenas quando visíveis
            sponsorsGrid.appendChild(img);
        });

        toggleSponsorsBtn.addEventListener('click', () => {
            const isGridVisible = sponsorsGrid.classList.toggle('show');
            toggleSponsorsBtn.textContent = isGridVisible ? 'Ocultar' : 'Ver Todos';
            scrollerContainer.style.display = isGridVisible ? 'none' : 'block';
        });
    }

    // Lógica do Botão "Voltar ao Topo"
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('show');
                if (chatToggle) chatToggle.classList.add('show-scroll-btn');
                if (chatWidget) chatWidget.classList.add('show-scroll-btn');
            } else {
                scrollToTopBtn.classList.remove('show');
                if (chatToggle) chatToggle.classList.remove('show-scroll-btn');
                if (chatWidget) chatWidget.classList.remove('show-scroll-btn');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- LÓGICA DO CHATBOT ---
    if (chatToggle && chatWidget && closeChatBtn && chatMessages && chatForm && chatInput) {
        let chatOpen = false;
        
        const toggleChat = () => {
            chatOpen = !chatOpen;
            chatWidget.classList.toggle('open');
            if (chatOpen && chatMessages.children.length === 0) {
                sendGreeting();
            }
        };

        chatToggle.addEventListener('click', toggleChat);
        closeChatBtn.addEventListener('click', toggleChat);

        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const message = chatInput.value.trim();
            if (message) {
                addUserMessage(message);
                handleBotResponse(message);
                chatInput.value = '';
            }
        });
        
        const addUserMessage = (message) => {
            const messageEl = document.createElement('div');
            messageEl.classList.add('message', 'user-message');
            messageEl.textContent = message;
            chatMessages.appendChild(messageEl);
            scrollToBottom();
        };

        const addBotMessage = (html) => {
            const messageEl = document.createElement('div');
            messageEl.classList.add('message', 'bot-message');
            messageEl.innerHTML = html;
            chatMessages.appendChild(messageEl);
            scrollToBottom();
        };
        
        const showTypingIndicator = () => {
            const typingEl = document.createElement('div');
            typingEl.classList.add('message', 'bot-message', 'typing-indicator');
            typingEl.innerHTML = '<span></span><span></span><span></span>';
            chatMessages.appendChild(typingEl);
            scrollToBottom();
            return typingEl;
        };
        
        const scrollToBottom = () => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };

        const sendGreeting = () => {
            const greeting = `Olá! 👋 Sou o assistente virtual da Cepclin. Como posso te ajudar hoje?`;
            const menu = `
                <b>Digite o número ou a palavra-chave da opção desejada:</b>
                <ul>
                    <li><b>1.</b> Nossos Estudos</li>
                    <li><b>2.</b> Exames Realizados</li>
                    <li><b>3.</b> Falar com um Especialista</li>
                    <li><b>4.</b> Endereço e Horário</li>
                </ul>
            `;
            const typing = showTypingIndicator();
            setTimeout(() => {
                typing.remove();
                addBotMessage(greeting);
                const typing2 = showTypingIndicator();
                setTimeout(() => {
                    typing2.remove();
                    addBotMessage(menu);
                }, 1500);
            }, 1000);
        };
        
        const handleBotResponse = (userMessage) => {
            const message = userMessage.toLowerCase();
            let response = '';
            const typing = showTypingIndicator();
            setTimeout(() => {
                typing.remove();

                if (message.includes('1') || message.includes('estudo')) {
                    response = `Atualmente, temos estudos para: <b>Vacina COVID-19</b>, <b>Infecção Pulmonar Viral</b> e <b>Pé Diabético</b>. Você pode ver mais detalhes na seção <a href="#estudos" class="text-sky-600 font-semibold">Estudos em Andamento</a> ou se cadastrar enviando um e-mail para cepclin@cepclin.com.br.`;
                } else if (message.includes('2') || message.includes('exame')) {
                    response = `Realizamos diversos exames como Hematologia, Coagulograma, BHCG e muitos outros. Confira a lista completa na seção <a href="#exames" class="text-sky-600 font-semibold">Exames</a> do nosso site!`;
                } else if (message.includes('3') || message.includes('especialista') || message.includes('contato')) {
                    response = `Claro! Para falar com nossa equipe, você pode nos ligar no número <b>(84) 2226 0376</b> ou enviar um e-mail para <b>cepclin@cepclin.com.br</b>. Confira a seção <a href="#contato" class="text-sky-600 font-semibold">Contato</a> no nosso site! E Teremos prazer em ajudar!`;
                } else if (message.includes('4') || message.includes('endereço') || message.includes('horario')) {
                    response = `Estamos localizados na <b>Rua Dr. Ponciano Barbosa, 282 – Cidade Alta, Natal/RN</b>. Nosso horário de funcionamento é de <b>Segunda a Sexta, das 8h às 17h30</b>.`;
                } else if (['oi', 'olá', 'ola', 'menu', 'ajuda'].some(word => message.startsWith(word))) {
                    sendGreeting();
                    return;
                } else {
                    response = `Desculpe, não entendi. Por favor, escolha uma das opções do menu ou digite "menu" para ver as opções novamente.`;
                }
                
                addBotMessage(response);
            }, 1500);
        };
    }
};

// Garante que o script seja executado após o DOM estar pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSite);
} else {
    initializeSite();
}

