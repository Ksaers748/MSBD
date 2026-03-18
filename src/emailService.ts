
// ─────────────────────────────────────────────────────────────
// Email сервис — отправка кода верификации через EmailJS
// Настройте переменные ниже из https://emailjs.com
// ─────────────────────────────────────────────────────────────

const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // ← вставьте сюда
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // ← вставьте сюда
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // ← вставьте сюда

const CONFIGURED =
  EMAILJS_SERVICE_ID  !== 'YOUR_SERVICE_ID' &&
  EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
  EMAILJS_PUBLIC_KEY  !== 'YOUR_PUBLIC_KEY';

export async function sendVerificationCode(
  toEmail: string,
  toName: string,
  code: string,
): Promise<void> {
  if (!CONFIGURED) {
    // Режим разработки: показать код в alert
    console.log(`[DEV] Код верификации для ${toEmail}: ${code}`);
    alert(`[Код верификации]\n\nДля ${toEmail}:\n\n${code}\n\n(В продакшне код придёт на почту)`);
    return;
  }

  const params = {
    service_id:  EMAILJS_SERVICE_ID,
    template_id: EMAILJS_TEMPLATE_ID,
    user_id:     EMAILJS_PUBLIC_KEY,
    template_params: {
      to_email: toEmail,
      to_name:  toName || toEmail.split('@')[0],
      code,
    },
  };

  const resp = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(params),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error('EmailJS error: ' + text);
  }
}
