export async function sendTelegramAlert(message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('Telegram alerts are not configured.');
    return;
  }

  const url = "https://api.telegram.org/bot$botToken/sendMessage";

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      console.error('Failed to send Telegram alert:', await response.text());
    }
  } catch (error) {
    console.error('Error sending Telegram alert:', error);
  }
}
