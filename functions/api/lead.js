/**
 * Cloudflare Pages Function — recebe os leads da landing page.
 * Rota: POST /api/lead
 *
 * Configure no painel do Cloudflare Pages (Settings > Environment variables):
 *   LEAD_WEBHOOK_URL  -> URL do seu n8n / CRM que recebe o lead (opcional, recomendado)
 *   LEAD_WEBHOOK_AUTH -> valor do header Authorization enviado ao webhook (opcional)
 *
 * Sem LEAD_WEBHOOK_URL a função ainda responde 200 e registra o lead no log
 * (Cloudflare > Pages > Functions > Real-time Logs), então nenhum lead é perdido.
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestPost({ request, env }) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: 'Corpo inválido.' }, 400);
  }

  const nome = String(data.nome || '').trim();
  const whatsapp = String(data.whatsapp || '').trim();
  const email = String(data.email || '').trim();

  // Validação básica
  if (!nome || !whatsapp || !email) {
    return json({ error: 'Preencha nome, WhatsApp e e-mail.' }, 400);
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json({ error: 'E-mail inválido.' }, 400);
  }
  // Honeypot anti-bot (campo opcional oculto no form; se vier preenchido, ignora)
  if (data.website) {
    return json({ ok: true });
  }

  const lead = {
    nome,
    whatsapp,
    email,
    origem: String(data.origem || 'landing-page'),
    url: String(data.url || ''),
    enviadoEm: data.enviadoEm || new Date().toISOString(),
    ip: request.headers.get('CF-Connecting-IP') || null,
    pais: request.headers.get('CF-IPCountry') || null,
    userAgent: request.headers.get('User-Agent') || null,
  };

  // Sempre registra no log (fallback garantido)
  console.log('NOVO LEAD zavy:', JSON.stringify(lead));

  // Encaminha para o webhook, se configurado
  if (env && env.LEAD_WEBHOOK_URL) {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (env.LEAD_WEBHOOK_AUTH) headers['Authorization'] = env.LEAD_WEBHOOK_AUTH;

      const resp = await fetch(env.LEAD_WEBHOOK_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(lead),
      });

      if (!resp.ok) {
        console.error('Webhook respondeu', resp.status);
        // Não falha para o usuário: o lead já está no log.
      }
    } catch (err) {
      console.error('Erro ao enviar ao webhook:', err && err.message);
      // Não falha para o usuário: o lead já está no log.
    }
  }

  return json({ ok: true });
}

// GET no endpoint só para health-check
export async function onRequestGet() {
  return json({ status: 'ok', service: 'zavy-lead-capture' });
}
