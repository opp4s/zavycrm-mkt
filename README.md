# Landing Page — zavy CRM

Landing page de captação de leads (teste grátis / demo) para o **zavy CRM** — CRM para WhatsApp com Agentes de IA.

- **Página:** `index.html` (100% self-contained: CSS e JS inline, sem imagens externas, ilustração do produto em CSS/SVG). Só depende do Google Fonts.
- **Captura de leads:** `functions/api/lead.js` — Cloudflare Pages Function que recebe `POST /api/lead`, valida e encaminha para um webhook (ex: n8n) via variável de ambiente.

## Estrutura

```
zavy-lp/
├── index.html              # a landing page
├── functions/
│   └── api/
│       └── lead.js         # POST /api/lead  (captura de leads)
└── README.md
```

## Testar localmente

Requer o Wrangler (CLI da Cloudflare):

```bash
npm install -g wrangler        # ou: npx wrangler
cd zavy-lp
npx wrangler pages dev .
```

Abre em `http://localhost:8788`. O endpoint `/api/lead` funciona no modo dev.

## Deploy no Cloudflare Pages

### Opção A — via CLI (mais rápido)

```bash
cd zavy-lp
npx wrangler pages deploy . --project-name zavy-lp
```

Na primeira vez ele cria o projeto e devolve a URL `https://zavy-lp.pages.dev`.

### Opção B — via painel (Git)

1. Suba esta pasta para um repositório (GitHub/GitLab).
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Selecione o repositório.
4. Build settings:
   - **Framework preset:** None
   - **Build command:** *(deixe vazio)*
   - **Build output directory:** `/` (raiz)
5. **Save and Deploy.**

> As Functions em `functions/` são detectadas e publicadas automaticamente pelo Cloudflare Pages nos dois métodos.

## Conectar os leads ao seu sistema (n8n / CRM)

No projeto do Pages → **Settings → Environment variables** adicione:

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `LEAD_WEBHOOK_URL` | Recomendada | URL do webhook (n8n, CRM, etc.) que recebe o lead em JSON |
| `LEAD_WEBHOOK_AUTH` | Opcional | Valor do header `Authorization` enviado ao webhook |

**Sem `LEAD_WEBHOOK_URL`** a página continua funcionando: o lead é registrado nos *Real-time Logs* (Pages → Functions), então nada é perdido durante os testes.

### Formato do lead enviado ao webhook

```json
{
  "nome": "Marina Souza",
  "whatsapp": "(11) 99999-9999",
  "email": "marina@empresa.com",
  "origem": "landing-page",
  "url": "https://zavy-lp.pages.dev/",
  "enviadoEm": "2026-07-09T13:58:00.000Z",
  "ip": "203.0.113.10",
  "pais": "BR",
  "userAgent": "Mozilla/5.0 ..."
}
```

## Domínio próprio

Pages → **Custom domains** → **Set up a custom domain** → aponte um subdomínio (ex: `crm.seudominio.com`). Se o DNS já estiver na Cloudflare, o SSL é automático.

## Personalização rápida

- **Cores/tipografia:** variáveis CSS no topo do `<style>` em `index.html` (`--primary`, `--accent`, etc.).
- **Textos, depoimentos, FAQ:** editar direto no HTML (tudo em português, seções comentadas).
- **Link do WhatsApp flutuante:** o botão verde aponta para `#trial`; troque por `https://wa.me/55SEUNUMERO` se quiser abrir uma conversa real.
- **Métricas/estatísticas:** os números da seção de prova social e do painel azul são exemplos — ajuste para os seus dados reais antes de publicar.

## Observação

Depoimentos e estatísticas são placeholders ilustrativos. Substitua por casos e números reais antes de rodar tráfego/anúncios para a página.
