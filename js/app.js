/**
 * ============================================================================
 * WEDDING APP - CONTROLADOR PRINCIPAL (APP.JS)
 * Roteador SPA (Single Page Application), Gestão de Histórico e Inicialização
 * ============================================================================
 */

import { CountdownTimer } from './countdown.js';
import { Guestbook } from './guestbook.js';
import { PhotoShare } from './photo-share.js';
import { RSVPManager } from './rsvp.js';

class WeddingApp {
  constructor() {
    this.currentViewId = 'view-home';
    this.views = document.querySelectorAll('.view');
    this.toastElement = document.getElementById('toast');
    this.toastTimeout = null;

    this.init();
  }

  /**
   * Ponto de entrada da aplicação
   */
  init() {
    // Inicializa a contagem regressiva primeiro para garantir execução imediata
    this.initCountdown();
    this.setupNavigation();
    this.setupHistoryRouting();
    this.initGuestbook();
    this.initPhotoShare();
    this.initRSVP();
  }

  /**
   * Configura os cliques em botões com o atributo data-target
   */
  setupNavigation() {
    document.addEventListener('click', (e) => {
      const targetBtn = e.target.closest('[data-target]');
      if (!targetBtn) return;

      e.preventDefault();
      const targetViewId = targetBtn.getAttribute('data-target');
      this.navigateTo(targetViewId);
    });
  }

  /**
   * Suporte a navegação pelo botão "Voltar" nativo do celular (Histórico do Navegador)
   * Proporciona uma experiência autêntica de aplicativo nativo.
   */
  setupHistoryRouting() {
    // Estado inicial no histórico (com tratamento seguro para file:// protocol)
    try {
      history.replaceState({ viewId: 'view-home' }, '', '#home');
    } catch (e) {
      // Ignora erro de segurança caso aberto via protocolo file://
    }

    window.addEventListener('popstate', (event) => {
      if (event.state && event.state.viewId) {
        this.switchViewDOM(event.state.viewId);
      } else {
        this.switchViewDOM('view-home');
      }
    });
  }

  /**
   * Altera a tela atual, empilhando o histórico
   */
  navigateTo(viewId) {
    if (viewId === this.currentViewId) return;

    // Atualiza histórico do navegador com tratamento seguro
    try {
      const hash = viewId.replace('view-', '#');
      history.pushState({ viewId: viewId }, '', hash);
    } catch (e) {
      // Ignora erro caso aberto diretamente do disco local (file://)
    }

    this.switchViewDOM(viewId);
  }

  /**
   * Alterna as classes CSS para ativar a view desejada com animação suave
   */
  switchViewDOM(viewId) {
    const nextView = document.getElementById(viewId);
    if (!nextView) return;

    // Remove estado ativo de todas as telas
    this.views.forEach(view => {
      view.classList.remove('active');
    });

    // Ativa a nova tela
    nextView.classList.add('active');
    this.currentViewId = viewId;

    // Garante que o scroll volte ao topo da página suavemente
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Inicializa o Temporizador de Contagem Regressiva
   */
  initCountdown() {
    // Configuração da data do casamento (28 de Novembro de 2027, 17:00)
    const weddingDate = '2027-11-28T17:00:00';

    const domElements = {
      days: document.getElementById('count-days'),
      hours: document.getElementById('count-hours'),
      minutes: document.getElementById('count-minutes'),
      seconds: document.getElementById('count-seconds')
    };

    const countdown = new CountdownTimer(weddingDate, domElements);
    countdown.start();
  }

  /**
   * Inicializa o Módulo do Mural de Mensagens
   */
  initGuestbook() {
    const form = document.getElementById('guestbook-form');
    const muralList = document.getElementById('mural-list');
    const counter = document.getElementById('mural-count');

    new Guestbook(form, muralList, counter, (msg) => this.showToast(msg));
  }

  /**
   * Inicializa o Módulo de Compartilhamento de Fotos
   */
  initPhotoShare() {
    new PhotoShare({
      dropzone: document.getElementById('photo-dropzone'),
      fileInput: document.getElementById('photo-input'),
      previewContainer: document.getElementById('photo-preview-container'),
      previewImage: document.getElementById('photo-preview-img'),
      btnRemove: document.getElementById('btn-remove-preview'),
      btnUpload: document.getElementById('btn-upload-photo'),
      captionInput: document.getElementById('photo-caption'),
      showToast: (msg) => this.showToast(msg)
    });
  }

  /**
   * Inicializa o Módulo de Confirmação de Presença (RSVP)
   */
  initRSVP() {
    new RSVPManager({
      form: document.getElementById('rsvp-form'),
      btnPlus: document.getElementById('btn-guest-plus'),
      btnMinus: document.getElementById('btn-guest-minus'),
      countDisplay: document.getElementById('guest-count'),
      inputsContainer: document.getElementById('guest-inputs-container'),
      phoneInput: document.getElementById('rsvp-phone'),
      showToast: (msg) => this.showToast(msg)
    });
  }

  /**
   * Exibe mensagens de feedback elegantes (Toasts flutuantes)
   */
  showToast(message) {
    if (!this.toastElement) return;

    const textEl = this.toastElement.querySelector('.toast-text');
    if (textEl) {
      textEl.textContent = message;
    }

    this.toastElement.classList.add('show');

    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }

    this.toastTimeout = setTimeout(() => {
      this.toastElement.classList.remove('show');
    }, 3500);
  }
}

// Inicializa a aplicação com segurança para qualquer estado de carregamento
function startApp() {
  new WeddingApp();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
