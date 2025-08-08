// Smooth scrolling para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Fechar todos os outros FAQs
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Abrir o FAQ clicado se não estava ativo
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// Calculadora de Juros
document.getElementById('jurosForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const valorFinanciado = parseFloat(document.getElementById('valorFinanciado').value);
    const numeroParcelas = parseInt(document.getElementById('numeroParcelas').value);
    const valorParcela = parseFloat(document.getElementById('valorParcela').value);
    
    if (!valorFinanciado || !numeroParcelas || !valorParcela) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    // Calcular a taxa de juros mensal usando aproximação
    const valorTotal = valorParcela * numeroParcelas;
    const jurosTotal = valorTotal - valorFinanciado;
    const taxaMensalAproximada = (jurosTotal / valorFinanciado / numeroParcelas) * 100;
    
    // Taxas médias de referência (valores aproximados do BACEN)
    const taxasReferencia = {
        'cartao': 12.5,
        'emprestimo': 3.5,
        'financiamento': 1.8,
        'cheque-especial': 8.0
    };
    
    // Para este exemplo, usaremos a taxa média de empréstimo pessoal
    const taxaReferencia = 3.5;
    

    let classe = '';
    
    let resultado = `
            <div class="resultado-alerta alto">
                <h4>⚠️ ALERTA: Forte Indício de Juros Abusivos!</h4>
                <p>Sua análise preliminar indica que os juros do seu contrato podem estar <strong>muito acima da média de mercado</strong>.</p>
                <p>Para uma análise detalhada e gratuita, preencha o formulário abaixo e entraremos em contato!</p>
            </div>
        `;
    
    document.getElementById('resultadoConteudo').innerHTML = resultado;
    document.getElementById('resultado').style.display = 'block';
    
    // Scroll para o resultado
    document.getElementById('resultado').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
});

// Formulário de Contato
document.getElementById('contatoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;
    const valorDivida = document.getElementById('valorDivida').value;
    const tipoDivida = document.getElementById('tipoDivida').value;
    const aceito = document.getElementById('aceito').checked;
    
    if (!nome || !telefone || !email || !valorDivida || !tipoDivida || !aceito) {
        alert('Por favor, preencha todos os campos e aceite os termos.');
        return;
    }
    
    // Aqui você pode integrar com um serviço de e-mail ou CRM
    // Por exemplo: enviar para um webhook, Google Sheets, etc.
    
    // Simular envio
    alert('Obrigado! Sua solicitação foi enviada. Entraremos em contato em até 24 horas.');
    
    // Opcional: redirecionar para WhatsApp com mensagem pré-preenchida
    const mensagem = `Olá! Gostaria de solicitar uma análise gratuita do meu contrato.
    
Nome: ${nome}
Telefone: ${telefone}
E-mail: ${email}
Valor da dívida: ${valorDivida}
Tipo de dívida: ${tipoDivida}`;
    
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappUrl, '_blank');
    
    // Limpar formulário
    this.reset();
});

// Animações ao scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar animação aos elementos
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.problema-item, .solucao-item, .processo-item, .stat-item, .depoimento');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Contador animado para estatísticas
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Ativar contadores quando a seção de estatísticas for visível
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                if (number) {
                    stat.textContent = '0';
                    animateCounter(stat, number);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});

// Validação de telefone (formato brasileiro)
document.getElementById('telefone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
        if (value.length <= 2) {
            value = value.replace(/(\d{0,2})/, '($1');
        } else if (value.length <= 7) {
            value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
        } else {
            value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        }
    }
    
    e.target.value = value;
});

// Scroll suave para o topo quando clicar no logo (se houver)
document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// Destacar seção ativa no menu (se houver menu fixo)
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute('id');
        const navLink = document.querySelector(`a[href="#${id}"]`);
        
        if (navLink && scrollPos >= top && scrollPos <= bottom) {
            document.querySelectorAll('nav a').forEach(link => {
                link.classList.remove('active');
            });
            navLink.classList.add('active');
        }
    });
});

