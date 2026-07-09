# Diretrizes e Lições Aprendidas — Projeto zavy-lp

## Regras de Escopo e Arquitetura
1. **Preservar a Estrutura do Zavy CRM:** Nunca modifique códigos, bancos de dados ou workflows da plataforma principal do Zavy CRM na VPS (n8n, Evolution API, Traefik). Modificações devem ocorrer estritamente na Landing Page local.
2. **Hospedagem Cloudflare Pages:** Este projeto deve ser implantado como Cloudflare Pages (e não como Cloudflare Worker). A pasta `functions/` e o `index.html` devem residir na raiz do diretório de saída do deploy (`/`).
3. **Ponte de Cadastro via URL:** O formulário da Landing Page envia o lead à API local para captura, e depois redireciona o usuário para `https://app.zavycrm.com/cadastrar` carregando os campos `nome`, `email` e `whatsapp` via Query Parameters para preenchimento.

## Diretrizes de UI/UX e Responsividade (Mobile-First)
1. **Menu Mobile:** Sempre implementar o menu mobile na vertical, posicionado de forma absoluta abaixo do cabeçalho, fechando-o automaticamente ao clicar em um link interno. Toggles devem ser feitos via classes CSS (`.active`) e nunca via estilos inline de display direto no JS.
2. **Empilhamento de Mockups:** Em telas móveis (abaixo de 900px), os componentes internos de mockups complexos (como chats de WhatsApp e colunas de CRM) devem ser empilhados verticalmente para evitar distorção de leitura. O mockup visual do produto deve vir abaixo do título H1 e CTA principal no mobile.
3. **Cartas de Planos:** Manter a propriedade `align-items: stretch` nos contêineres flex de planos no mobile para garantir alturas uniformes e simétricas entre os cards.
