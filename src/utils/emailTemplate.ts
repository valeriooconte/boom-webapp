export const emailTemplate = (username: string) => `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2 style="color: #007bff;">Gentile cliente dell'azienda ${username},</h2>
    <p>In allegato trovi il report richiesto.</p>
    <p>Grazie per aver utilizzato <strong>Boom WebApp</strong> 🚀</p>
    <hr/>
    <small>Questa è una mail automatica, non rispondere.</small>
  </div>
`;