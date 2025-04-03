
import nodemailer from 'nodemailer';

interface SendEmailParams {
  from: string;
  to: string;
  subject: string;
  text: string;
  smtpConfig: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    }
  }
}

/**
 * Функция для отправки электронной почты через SMTP
 */
export const sendEmail = async (params: SendEmailParams) => {
  try {
    // Создаем транспорт nodemailer с указанной конфигурацией SMTP
    const transporter = nodemailer.createTransport(params.smtpConfig);

    // Отправляем письмо
    const info = await transporter.sendMail({
      from: `"Книжный магазин" <${params.from}>`,
      to: params.to,
      subject: params.subject,
      text: params.text,
      html: `<div style="font-family: Arial, sans-serif;">${params.text.replace(/\n/g, '<br>')}</div>`,
    });

    console.log('Сообщение отправлено: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Ошибка отправки письма:', error);
    throw error;
  }
};
