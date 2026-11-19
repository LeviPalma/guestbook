/**
 * ============================================================================
 * MÓDULO: GUESTBOOK (Mural de Recados)
 * Gerencia persistência em localStorage, renderização dinâmica e higienização.
 * ============================================================================
 */

const STORAGE_KEY = 'wedding_app_guestbook_messages';

// Mensagens padrão para enriquecer a experiência inicial dos convidados
const SEED_MESSAGES = [
  {
    id: 'seed-1',
    name: 'Mariana & Lucas (Padrinhos)',
    message: 'Que a caminhada de vocês seja repleta de cumplicidade, paciência e muito amor! A festa está inesquecível! 🥂✨',
    timestamp: 'Hoje às 18:30'
  },
  {
    id: 'seed-2',
    name: 'Tia Carmen',
    message: 'Ver vocês dois juntos enche nossos corações de alegria. Que Deus abençoe essa união todos os dias!',
    timestamp: 'Hoje às 19:15'
  }
];

export class Guestbook {
  constructor(formElement, muralListElement, counterElement, showToastFn) {
    this.form = formElement;
    this.muralList = muralListElement;
    this.counterElement = counterElement;
    this.showToast = showToastFn;

    this.messages = this.loadMessages();
    this.init();
  }

  /**
   * Inicializa ouvintes de eventos e primeira renderização
   */
  init() {
    this.render();

    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  /**
   * Carrega mensagens salvas no localStorage
   * [INTEGRAÇÃO FUTURA DE API]:
   * Substitua ou complemente esta chamada com um `fetch('/api/guestbook')`
   * para sincronizar em tempo real as mensagens de todos os convidados via WebSocket ou polling.
   */
  loadMessages() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      // Se não houver nada salvo, armazena as mensagens de exemplo
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_MESSAGES));
      return [...SEED_MESSAGES];
    } catch (error) {
      console.warn('Erro ao acessar localStorage:', error);
      return [...SEED_MESSAGES];
    }
  }

  /**
   * Salva o array de mensagens no localStorage
   */
  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.messages));
    } catch (error) {
      console.error('Falha ao gravar no localStorage:', error);
    }
  }

  /**
   * Trata o envio do formulário de novo recado
   */
  handleSubmit(event) {
    event.preventDefault();

    const nameInput = this.form.querySelector('#guest-name');
    const messageInput = this.form.querySelector('#guest-message');

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !message) {
      alert('Por favor, preencha seu nome e sua mensagem!');
      return;
    }

    const newMessage = {
      id: 'msg-' + Date.now(),
      name: name,
      message: message,
      timestamp: 'Agora mesmo'
    };

    /**
     * =========================================================================
     * PONTO DE INTEGRAÇÃO COM BACK-END (API):
     * -------------------------------------------------------------------------
     * Para persistir em um banco real (ex: Firebase, Supabase, Node.js/PostgreSQL):
     * 
     * await fetch('https://sua-api.com/api/guestbook', {
     *   method: 'POST',
     *   headers: { 'Content-Type': 'application/json' },
     *   body: JSON.stringify({ name, message })
     * });
     * =========================================================================
     */

    // Adiciona a mensagem no início da lista local
    this.messages.unshift(newMessage);
    this.saveToStorage();

    // Renderiza o novo card instantaneamente no mural
    this.prependMessageCard(newMessage);
    this.updateCounter();

    // Limpa os campos do formulário
    this.form.reset();

    // Notificação de sucesso
    if (this.showToast) {
      this.showToast('Mensagem enviada com carinho aos noivos! 💌');
    }
  }

  /**
   * Higieniza texto para evitar ataques de Cross-Site Scripting (XSS)
   */
  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Extrai as iniciais do nome para o avatar estilizado
   */
  getInitials(name) {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  /**
   * Gera o elemento HTML para o card de mensagem
   */
  createCardElement(msg) {
    const card = document.createElement('article');
    card.className = 'message-card';
    card.id = msg.id;

    const initials = this.getInitials(msg.name);
    const safeName = this.escapeHtml(msg.name);
    const safeBody = this.escapeHtml(msg.message);

    card.innerHTML = `
      <div class="card-top">
        <div class="guest-info">
          <div class="guest-avatar" aria-hidden="true">${initials}</div>
          <strong class="guest-name">${safeName}</strong>
        </div>
        <time class="message-time">${msg.timestamp}</time>
      </div>
      <p class="message-body">${safeBody}</p>
    `;

    return card;
  }

  /**
   * Insere um card individual no topo da lista com animação suave
   */
  prependMessageCard(msg) {
    // Se havia o aviso de mural vazio, remove
    const emptyNotice = this.muralList.querySelector('.mural-empty');
    if (emptyNotice) {
      emptyNotice.remove();
    }

    const card = this.createCardElement(msg);
    this.muralList.prepend(card);
  }

  /**
   * Renderiza todos os recados na tela
   */
  render() {
    this.muralList.innerHTML = '';

    if (this.messages.length === 0) {
      this.muralList.innerHTML = `
        <div class="mural-empty">
          Seja o primeiro a deixar uma mensagem especial para os noivos! ✨
        </div>
      `;
      this.updateCounter();
      return;
    }

    this.messages.forEach(msg => {
      const card = this.createCardElement(msg);
      this.muralList.appendChild(card);
    });

    this.updateCounter();
  }

  /**
   * Atualiza o badge numérico com a contagem de recados
   */
  updateCounter() {
    if (this.counterElement) {
      const count = this.messages.length;
      this.counterElement.textContent = `${count} ${count === 1 ? 'recado' : 'recados'}`;
    }
  }
}
