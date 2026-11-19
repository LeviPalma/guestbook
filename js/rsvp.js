/**
 * ============================================================================
 * MÓDULO: RSVP (Confirmação de Presença)
 * Gerencia a lógica do formulário, contagem dinâmica de acompanhantes,
 * persistência em localStorage e simulação de integração com a API.
 * ============================================================================
 */

export class RSVPManager {
  constructor(options = {}) {
    this.form = options.form || document.getElementById('rsvp-form');
    this.btnPlus = options.btnPlus || document.getElementById('btn-guest-plus');
    this.btnMinus = options.btnMinus || document.getElementById('btn-guest-minus');
    this.countDisplay = options.countDisplay || document.getElementById('guest-count');
    this.inputsContainer = options.inputsContainer || document.getElementById('guest-inputs-container');
    this.phoneInput = options.phoneInput || document.getElementById('rsvp-phone');
    this.showToast = options.showToast || null;

    this.guestCount = 0;
    this.maxGuests = 10; // Limite de bom senso para usabilidade mobile

    this.init();
  }

  /**
   * Inicializa ouvintes de eventos e estados iniciais
   */
  init() {
    if (!this.form) return;

    this.setupStepper();
    this.setupPhoneMask();
    this.setupFormSubmit();
    this.checkExistingRSVP();
  }

  /**
   * Configura os botões de incremento e decremento de acompanhantes
   */
  setupStepper() {
    if (this.btnPlus) {
      this.btnPlus.addEventListener('click', () => this.addGuest());
    }

    if (this.btnMinus) {
      this.btnMinus.addEventListener('click', () => this.removeGuest());
    }

    this.updateStepperUI();
  }

  /**
   * Adiciona um novo acompanhante e cria o campo de input dinamicamente
   */
  addGuest() {
    if (this.guestCount >= this.maxGuests) {
      alert(`Você pode adicionar no máximo ${this.maxGuests} acompanhantes.`);
      return;
    }

    this.guestCount++;
    this.updateStepperUI();

    // Cria o elemento de input para o acompanhante com animação suave
    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'form-group guest-input-animated';
    inputWrapper.dataset.guestIndex = this.guestCount;

    inputWrapper.innerHTML = `
      <label for="guest-companion-${this.guestCount}" class="form-label">
        Nome do Acompanhante ${this.guestCount}
      </label>
      <input 
        type="text" 
        id="guest-companion-${this.guestCount}" 
        class="form-input companion-name-input" 
        placeholder="Nome completo do acompanhante" 
        required 
        maxlength="80"
        autocomplete="off"
      >
    `;

    this.inputsContainer.appendChild(inputWrapper);

    // Foca suavemente no novo input criado para melhorar a usabilidade
    const newInput = inputWrapper.querySelector('input');
    if (newInput) {
      newInput.focus();
    }
  }

  /**
   * Remove o último acompanhante e seu respectivo input
   */
  removeGuest() {
    if (this.guestCount <= 0) return;

    this.guestCount--;
    this.updateStepperUI();

    // Remove o último elemento filho inserido
    if (this.inputsContainer.lastElementChild) {
      this.inputsContainer.lastElementChild.remove();
    }
  }

  /**
   * Atualiza o número exibido e habilita/desabilita o botão de diminuir
   */
  updateStepperUI() {
    if (this.countDisplay) {
      this.countDisplay.textContent = this.guestCount;
    }

    if (this.btnMinus) {
      this.btnMinus.disabled = this.guestCount <= 0;
    }

    if (this.btnPlus) {
      this.btnPlus.disabled = this.guestCount >= this.maxGuests;
    }
  }

  /**
   * Máscara formatadora elegante para telefone/WhatsApp brasileiro: (DD) 99999-9999
   */
  setupPhoneMask() {
    if (!this.phoneInput) return;

    this.phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);

      if (value.length > 6) {
        e.target.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
      } else if (value.length > 2) {
        e.target.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      } else if (value.length > 0) {
        e.target.value = `(${value}`;
      } else {
        e.target.value = '';
      }
    });
  }

  /**
   * Gerencia o envio e validação do formulário de confirmação
   */
  async setupFormSubmit() {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = this.form.querySelector('#rsvp-name');
      const fullName = nameInput ? nameInput.value.trim() : '';
      const phone = this.phoneInput ? this.phoneInput.value.trim() : '';

      // Coleta o nome de todos os acompanhantes gerados dinamicamente
      const companionInputs = this.inputsContainer.querySelectorAll('.companion-name-input');
      const companions = Array.from(companionInputs)
        .map(input => input.value.trim())
        .filter(name => name.length > 0);

      // Validação básica
      if (!fullName || !phone) {
        alert('Por favor, preencha seu nome e seu WhatsApp!');
        return;
      }

      // Payload dos dados da confirmação
      const rsvpPayload = {
        fullName: fullName,
        phone: phone, // Chave única para o banco de dados
        companionsCount: companions.length,
        companions: companions,
        confirmedAt: new Date().toISOString()
      };

      const submitBtn = this.form.querySelector('#btn-submit-rsvp');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span class="spinner" aria-hidden="true"></span>
          <span>Confirmando sua presença...</span>
        `;
      }

      try {
        /**
         * =========================================================================
         * // Integração futura com API:
         * -------------------------------------------------------------------------
         * Substitua esta simulação pela requisição real para o seu back-end:
         *
         * const response = await fetch('https://sua-api.com/api/rsvp', {
         *   method: 'POST',
         *   headers: {
         *     'Content-Type': 'application/json'
         *   },
         *   body: JSON.stringify(rsvpPayload)
         * });
         *
         * if (!response.ok) {
         *   const errorData = await response.json();
         *   throw new Error(errorData.message || 'Erro ao confirmar presença');
         * }
         * const data = await response.json();
         * =========================================================================
         */

        // Simulação de latência de rede (800ms para feedback visual fluido)
        await new Promise(resolve => setTimeout(resolve, 800));

        // Salva a flag no navegador para saber que o RSVP já foi concluído
        localStorage.setItem('rsvp_feito', 'true');
        // Opcional: armazena os dados salvos localmente
        localStorage.setItem('rsvp_dados', JSON.stringify(rsvpPayload));

        // Exibe mensagem de sucesso amigável
        const successMessage = 'Presença confirmada! Te esperamos lá! 🎉✨';
        if (this.showToast) {
          this.showToast(successMessage);
        } else {
          alert(successMessage);
        }

        // Limpa o formulário e reseta acompanhantes
        this.resetForm();

        // Opcional: atualiza botão na Home caso exista
        this.updateHomeRSVPStatus();

      } catch (error) {
        console.error('Falha ao registrar RSVP:', error);
        alert('Ocorreu um erro ao confirmar sua presença. Por favor, tente novamente.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>Confirmar Presença</span>
          `;
        }
      }
    });
  }

  /**
   * Limpa o formulário e redefine o contador de acompanhantes
   */
  resetForm() {
    this.form.reset();
    this.guestCount = 0;
    this.inputsContainer.innerHTML = '';
    this.updateStepperUI();
  }

  /**
   * Verifica se o convidado já realizou o RSVP anteriormente no mesmo dispositivo
   */
  checkExistingRSVP() {
    const isDone = localStorage.getItem('rsvp_feito') === 'true';
    if (isDone) {
      this.updateHomeRSVPStatus();
    }
  }

  /**
   * Altera visualmente o botão da Home caso a presença já esteja confirmada
   */
  updateHomeRSVPStatus() {
    const homeRsvpBtn = document.querySelector('[data-target="rsvp-view"], [data-target="view-rsvp"]');
    if (homeRsvpBtn) {
      const title = homeRsvpBtn.querySelector('.action-title');
      const desc = homeRsvpBtn.querySelector('.action-desc');
      if (title) title.textContent = 'Presença Confirmada!';
      if (desc) desc.textContent = 'Sua presença e a dos seus acompanhantes já foram registradas ♥';
      homeRsvpBtn.style.borderColor = 'var(--color-success, #3E8256)';
    }
  }
}
