/**
 * ============================================================================
 * MÓDULO: COUNTDOWN TIMER (Contagem Regressiva)
 * Atualiza os contadores de Dias, Horas, Minutos e Segundos em tempo real.
 * MÓDULO: COUNTDOWN TIMER (Contagem Regressiva Ultra-Resiliente)
 * Suporta formatos ISO, brasileiro (DD/MM/AAAA), objetos Date e Safari Mobile.
 * ============================================================================
 */

/**
 * ============================================================================
 * MÓDULO: COUNTDOWN TIMER (Contagem Regressiva)
 * Atualiza os contadores de Dias, Horas, Minutos e Segundos em tempo real.
 * MÓDULO: COUNTDOWN TIMER (Contagem Regressiva Ultra-Resiliente)
 * Suporta formatos ISO, brasileiro (DD/MM/AAAA), objetos Date e Safari Mobile.
 * ============================================================================
 */

export class CountdownTimer {
  /**
   * @param {string|Date|number} targetDate - Data alvo do casamento
   * @param {Object} [domElements] - Referências opcionais aos elementos DOM
   */
  constructor(targetDate, domElements = {}) {
    this.targetDate = this.parseDate(targetDate);

    const safeDomElements = domElements || {};
    const getEl = (id) => (typeof document !== 'undefined' ? document.getElementById(id) : null);

    this.elements = {
      days: safeDomElements.days || getEl('count-days'),
      hours: safeDomElements.hours || getEl('count-hours'),
      minutes: safeDomElements.minutes || getEl('count-minutes'),
      seconds: safeDomElements.seconds || getEl('count-seconds'),
      title: safeDomElements.title || (typeof document !== 'undefined' ? document.querySelector('.countdown-title') : null)
    };

    this.timerInterval = null;
  }

  /**
   * Inicia o ciclo de contagem regressiva
   * Converte múltiplos formatos de data de forma robusta e à prova de falhas
   */
  parseDate(input) {
    if (input instanceof Date) {
      return input.getTime();
    }

    if (typeof input === 'number') {
      return input;
    }

    if (!input || typeof input !== 'string') {
      console.warn('[Countdown] Data não fornecida ou inválida. Usando data padrão de segurança.');
      return this.getDefaultFutureDate();
    }

    const trimmed = input.trim();

    if (/^\d{2}[\/\-]\d{2}[\/\-]\d{4}/.test(trimmed)) {
      const parts = trimmed.split(/[\sT]+/);
      const dateParts = parts[0].split(/[\/\-]/);
      const day = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1;
      const year = parseInt(dateParts[2], 10);

      let hours = 17;
      let minutes = 0;
      let seconds = 0;

      if (parts[1]) {
        const timeParts = parts[1].split(':');
        hours = parseInt(timeParts[0] || '17', 10);
        minutes = parseInt(timeParts[1] || '0', 10);
        seconds = parseInt(timeParts[2] || '0', 10);
      }

      const parsed = new Date(year, month, day, hours, minutes, seconds).getTime();
      if (!isNaN(parsed)) return parsed;
    }

    let timestamp = new Date(trimmed).getTime();

    if (isNaN(timestamp)) {
      const safariSafe = trimmed.replace(/-/g, '/').replace('T', ' ');
      timestamp = new Date(safariSafe).getTime();
    }

    if (isNaN(timestamp)) {
      console.error(`[Countdown] Não foi possível interpretar a data: "${input}".`);
      return this.getDefaultFutureDate();
    }

    return timestamp;
  }

  /**
   * Retorna uma data no futuro (padrão de 6 meses) caso ocorra erro de digitação
   */
  getDefaultFutureDate() {
    const future = new Date();
    future.setMonth(future.getMonth() + 6);
    return future.getTime();
  }

  /**
   * Inicia a contagem
   */
  start() {
    this.update();
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => this.update(), 1000);
  }

  /**
   * Para o temporizador se necessário
   */
  stop() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /**
   * Formata número com zero à esquerda
   */
  padZero(num) {
    const n = Math.max(0, Math.floor(num));
    return String(n).padStart(2, '0');
  }

  /**
   * Calcula a diferença e atualiza os elementos no DOM
   */
  update() {
    const now = new Date().getTime();
    const difference = this.targetDate - now;

    if (difference <= 0) {
      this.stop();
      this.renderCompleted();
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    if (this.elements.days) this.elements.days.textContent = this.padZero(days);
    if (this.elements.hours) this.elements.hours.textContent = this.padZero(hours);
    if (this.elements.minutes) this.elements.minutes.textContent = this.padZero(minutes);
    if (this.elements.seconds) this.elements.seconds.textContent = this.padZero(seconds);
  }

  /**
   * Renderiza mensagem especial quando a data do evento é alcançada
   */
  renderCompleted() {
    if (this.elements.days) this.elements.days.textContent = '00';
    if (this.elements.hours) this.elements.hours.textContent = '00';
    if (this.elements.minutes) this.elements.minutes.textContent = '00';
    if (this.elements.seconds) this.elements.seconds.textContent = '00';

    if (this.elements.title) {
      this.elements.title.textContent = '✨ O Grande Dia Chegou! ✨';
      this.elements.title.style.color = 'var(--color-primary, #C58B79)';
    }
  }
}
