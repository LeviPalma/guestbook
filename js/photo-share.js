/**
 * ============================================================================
 * MÓDULO: PHOTO SHARING (Compartilhamento de Fotos)
 * Gerencia a seleção da imagem pelo convidado (câmera/galeria), preview em tela,
 * simulação de upload e especificações para a futura API REST/Cloud Storage.
 * ============================================================================
 */

export class PhotoShare {
  constructor(options) {
    this.dropzone = options.dropzone;
    this.fileInput = options.fileInput;
    this.previewContainer = options.previewContainer;
    this.previewImage = options.previewImage;
    this.btnRemove = options.btnRemove;
    this.btnUpload = options.btnUpload;
    this.captionInput = options.captionInput;
    this.showToast = options.showToast;

    this.selectedFile = null;

    this.init();
  }

  /**
   * Vincula os listeners de clique, drag-and-drop e upload
   */
  init() {
    // Clique na dropzone dispara o input nativo oculto
    if (this.dropzone && this.fileInput) {
      this.dropzone.addEventListener('click', () => this.fileInput.click());

      // Suporte a Drag and Drop (para tablets / desktop)
      ['dragenter', 'dragover'].forEach(eventName => {
        this.dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          this.dropzone.classList.add('drag-active');
        });
      });

      ['dragleave', 'drop'].forEach(eventName => {
        this.dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          this.dropzone.classList.remove('drag-active');
        });
      });

      this.dropzone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
          this.handleFileSelection(files[0]);
        }
      });
    }

    // Mudança no input file (seleção pela galeria ou câmera nativa)
    if (this.fileInput) {
      this.fileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
          this.handleFileSelection(files[0]);
        }
      });
    }

    // Botão de remover/descartar preview
    if (this.btnRemove) {
      this.btnRemove.addEventListener('click', (e) => {
        e.stopPropagation();
        this.clearSelection();
      });
    }

    // Disparo de Envio / Upload
    if (this.btnUpload) {
      this.btnUpload.addEventListener('click', () => this.handleUpload());
    }
  }

  /**
   * Processa o arquivo selecionado e gera o preview imediato via FileReader
   */
  handleFileSelection(file) {
    // Validação de tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido (JPG, PNG, HEIC).');
      return;
    }

    this.selectedFile = file;

    // Leitura assíncrona para exibição no elemento <img>
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewImage.src = e.target.result;
      this.previewContainer.classList.add('active');
      this.dropzone.style.display = 'none'; // Oculta a dropzone enquanto houver preview
      this.btnUpload.disabled = false;
    };
    reader.readAsDataURL(file);
  }

  /**
   * Limpa o estado da foto selecionada e restaura os componentes
   */
  clearSelection() {
    this.selectedFile = null;
    this.fileInput.value = '';
    this.previewImage.src = '';
    this.previewContainer.classList.remove('active');
    this.dropzone.style.display = 'flex';
    this.btnUpload.disabled = true;
    if (this.captionInput) {
      this.captionInput.value = '';
    }
  }

  /**
   * Executa a simulação de upload e fornece os ganchos da futura API
   */
  async handleUpload() {
    if (!this.selectedFile) {
      alert('Por favor, escolha uma foto antes de enviar!');
      return;
    }

    const caption = this.captionInput ? this.captionInput.value.trim() : '';

    // Estado visual de carregamento (Loading)
    this.setLoadingState(true);

    try {
      /**
       * =======================================================================
       * PONTO DE INTEGRAÇÃO COM BACK-END (API DE UPLOAD DE FOTOS):
       * -----------------------------------------------------------------------
       * Aqui você deve enviar o binário da imagem para seu servidor, bucket S3,
       * Cloudinary ou Firebase Storage.
       * 
       * Exemplo real de implementação com `FormData` e `fetch`:
       * 
       * const formData = new FormData();
       * formData.append('photo', this.selectedFile);
       * formData.append('caption', caption);
       * formData.append('timestamp', new Date().toISOString());
       * 
       * const response = await fetch('https://sua-api.com/api/photos/upload', {
       *   method: 'POST',
       *   // Se necessário: headers com Bearer Token de autenticação da festa
       *   body: formData
       * });
       * 
       * if (!response.ok) {
       *   throw new Error('Falha no upload da foto');
       * }
       * const result = await response.json();
       * =======================================================================
       */

      // Simulação de latência de rede (1.2 segundos para feedback visual agradável)
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Sucesso! Notifica o convidado
      if (this.showToast) {
        this.showToast('Foto enviada aos noivos com sucesso! 📸✨');
      }

      // Limpa os campos e o preview da imagem
      this.clearSelection();

    } catch (error) {
      console.error('Erro no envio da foto:', error);
      alert('Ocorreu um erro ao enviar sua foto. Por favor, tente novamente.');
    } finally {
      this.setLoadingState(false);
    }
  }

  /**
   * Altera os botões e texto durante o upload
   */
  setLoadingState(isLoading) {
    if (!this.btnUpload) return;

    if (isLoading) {
      this.btnUpload.disabled = true;
      this.btnUpload.innerHTML = `
        <span class="spinner" aria-hidden="true"></span>
        <span>Enviando aos noivos...</span>
      `;
    } else {
      this.btnUpload.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Enviar Foto</span>
      `;
      // Se não houver arquivo, mantém desabilitado
      this.btnUpload.disabled = !this.selectedFile;
    }
  }
}
