import nodemailer from 'nodemailer';

let cachedTransporter = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error(
      'Configuração SMTP incompleta. Defina SMTP_HOST, SMTP_PORT, SMTP_USER e SMTP_PASS no .env'
    );
  }

  const port = Number(SMTP_PORT);
  const secure = SMTP_SECURE === 'true' || port === 465;

  cachedTransporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });

  return cachedTransporter;
}

function buildDigestText(user, articles) {
  const lines = [];
  lines.push('Olá!');
  lines.push('');
  lines.push('Este é o resumo das principais notícias dos seus tópicos favoritos:');
  lines.push('');

  articles.forEach((article, index) => {
    lines.push(`${index + 1}. ${article.title || 'Sem título'}`);
    if (article.source) {
      lines.push(`   Fonte: ${article.source}`);
    }
    if (article.url) {
      lines.push(`   Link: ${article.url}`);
    }
    lines.push('');
  });

  lines.push('Se quiser ajustar seus tópicos ou a frequência de envio, acesse seu perfil no app.');
  lines.push('');
  lines.push('— News App');

  return lines.join('\n');
}

function buildDigestHtml(user, articles) {
  const items = articles
    .map(
      (article) => `
      <li style="margin-bottom: 12px;">
        <a href="${article.url}" target="_blank" rel="noopener noreferrer">
          <strong>${article.title || 'Sem título'}</strong>
        </a>
        ${article.source ? `<div style="font-size: 12px; color: #555;">Fonte: ${article.source}</div>` : ''}
      </li>
    `
    )
    .join('');

  return `
    <p>Olá!</p>
    <p>Este é o resumo das principais notícias dos seus tópicos favoritos:</p>
    <ul>
      ${items}
    </ul>
    <p style="font-size: 13px; color: #555;">
      Para ajustar seus tópicos favoritos ou a frequência de envio,
      acesse a área de perfil no aplicativo.
    </p>
    <p>— News App</p>
  `;
}

export async function sendFavoritesDigestEmail(user, articles) {
  if (!user?.email) {
    throw new Error('Usuário sem e-mail válido para envio');
  }

  if (!Array.isArray(articles) || articles.length === 0) {
    throw new Error('Nenhum artigo disponível para montar o resumo de notícias');
  }

  const transporter = getTransporter();

  const from = process.env.SMTP_FROM || `"News App" <${process.env.SMTP_USER}>`;
  const subject = 'Resumo de notícias dos seus tópicos favoritos';

  const text = buildDigestText(user, articles);
  const html = buildDigestHtml(user, articles);

  const info = await transporter.sendMail({
    from,
    to: user.email,
    subject,
    text,
    html
  });

  return info;
}

