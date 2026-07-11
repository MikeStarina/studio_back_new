import { TOtpPurpose } from "../models/otp";

const titleByPurpose: Record<TOtpPurpose, string> = {
  register: "Подтверждение регистрации",
  reset: "Восстановление пароля",
  change: "Смена пароля",
};

const leadTextByPurpose: Record<TOtpPurpose, string> = {
  register:
    "Спасибо за регистрацию в PINHEAD STUDIO! Используйте код ниже, чтобы подтвердить вашу почту.",
  reset:
    "Вы запросили восстановление пароля. Используйте код ниже, чтобы задать новый пароль.",
  change:
    "Вы запросили смену пароля. Используйте код ниже, чтобы подтвердить действие.",
};

export const otpTemplate = (code: string, purpose: TOtpPurpose): string => {
  const title = titleByPurpose[purpose];
  const lead = leadTextByPurpose[purpose];

  return `<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f6f6f6;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f6f6f6;padding:24px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="padding:32px 40px 8px 40px;">
                <span style="font-family:helvetica,arial,sans-serif;font-size:20px;color:#333333;">PINHEAD STUDIO</span>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 40px;">
                <h1 style="margin:0;font-family:helvetica,arial,sans-serif;font-size:24px;font-weight:normal;color:#333333;">${title}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 40px;">
                <p style="margin:0;font-family:arial,sans-serif;font-size:14px;line-height:21px;color:#555555;">${lead}</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:24px 40px;">
                <div style="display:inline-block;background:#99ff00;border-radius:8px;padding:16px 32px;">
                  <span style="font-family:'Courier New',monospace;font-size:34px;letter-spacing:8px;font-weight:bold;color:#111111;">${code}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 24px 40px;">
                <p style="margin:0;font-family:arial,sans-serif;font-size:12px;line-height:18px;color:#999999;">
                  Код действует ограниченное время. Если вы не запрашивали это письмо, просто проигнорируйте его.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 40px;border-top:1px solid #eeeeee;">
                <p style="margin:0;font-family:arial,sans-serif;font-size:12px;color:#999999;">
                  PINHEAD STUDIO | +79313566552 | studio@pnhd.ru
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};
