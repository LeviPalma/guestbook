# 💍 App de Casamento — Guestbook & Fotos (Mobile-First)

Aplicação Single Page Application (SPA) desenvolvida em **HTML5**, **CSS3 puro** (Flexbox/Grid) e **JavaScript moderno (ES6+)**, criada especificamente para proporcionar a melhor experiência interativa aos convidados de um casamento através do celular.

---

## 📁 Estrutura de Diretórios e Arquivos

```
Wedding/
├── index.html               # Marcação semântica e casca SPA (as 3 views principais)
├── css/
│   ├── variables.css        # Design tokens: paleta romântica, tipografia e raios
│   └── style.css            # Layout mobile-first, animações e componentes
├── js/
│   ├── app.js               # Controlador central e roteador de navegação SPA
│   ├── countdown.js         # Módulo de contagem regressiva em tempo real
│   ├── guestbook.js         # Mural de recados (persistência com localStorage)
│   └── photo-share.js       # Preview de imagem, upload simulado e hook para API
└── assets/
    └── images/              # Diretório para fotos e imagens estáticas
```

---

## 🚀 Como Executar Localmente

Como a aplicação utiliza módulos ES6 nativos (`<script type="module">`), execute-a através de um servidor HTTP local simples:

### Opção 1: Usando `npx serve` (Node.js)
```bash
npx serve .
```

### Opção 2: Usando Python
```bash
python -m http.server 8080
```

### Opção 3: Extensão "Live Server" do VS Code
Clique com o botão direito em `index.html` e selecione **"Open with Live Server"**.

---

## 🎨 Paleta de Cores & Design Romântico
- **Fundo Principal:** `#FAF7F2` (Marfim acolhedor / Alabastro)
- **Superfície & Cartões:** `#FFFFFF` com sombras suaves e bordas delicadas
- **Cor Primária:** `#C58B79` (Rosa Antigo / Terracota Suave)
- **Acento Elegante:** `#C2A267` (Dourado Champanhe)
- **Textos:** `#2C2623` (Carvão de alto contraste e legibilidade)
- **Tipografia:** Google Fonts (*Playfair Display*, *Plus Jakarta Sans* e *Alex Brush*)

---

## 🔌 Integração com Back-End (API)
Os módulos `js/guestbook.js` e `js/photo-share.js` já contêm marcações e exemplos de código detalhados em comentários para plugar facilmente serviços como:
- **Upload de Fotos:** AWS S3 Pre-signed URLs, Cloudinary, Firebase Storage ou Endpoint REST `multipart/form-data`.
- **Mural em Tempo Real:** Supabase Realtime, Firebase Firestore ou WebSockets (Socket.io).
