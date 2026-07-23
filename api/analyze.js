const PROMPT = "Eres un nutricionista. Observa la foto de comida e identifica cada ingrediente por separado. Responde SOLO con un objeto JSON, sin texto adicional ni backticks, con esta forma exacta: {\"platillo_nombre\":\"string breve del platillo completo\",\"confianza\":\"alta\" o \"media\" o \"baja\",\"nota\":\"string breve, maximo 15 palabras, recordando que es una estimacion\",\"items\":[{\"nombre\":\"nombre corto en español del ingrediente\",\"busqueda_en\":\"nombre corto en ingles adecuado para buscarlo en una base de datos nutricional, ej. 'grilled chicken breast'\",\"gramos\":numero,\"calorias_ia\":numero,\"proteina_g_ia\":numero,\"carbohidratos_g_ia\":numero,\"grasas_g_ia\":numero,\"azucares_g_ia\":numero}]}. El campo *_ia de cada item debe ser tu mejor estimación PARA LA PORCION completa de ese ingrediente (no por 100g). Separa el platillo en 2-5 ingredientes principales.";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  const { image, mediaType } = req.body || {};
  if (!image || !mediaType) {
    res.status(400).json({ error: 'Falta la imagen (image) o el tipo (mediaType)' });
    return;
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(500).json({ error: 'El servidor no tiene configurada ANTHROPIC_API_KEY' });
    return;
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1200,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: image } },
            { type: 'text', text: PROMPT }
          ]
        }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json({ error: data?.error?.message || 'Error al llamar a la API de Anthropic' });
      return;
    }

    const textBlock = (data.content || []).find(c => c.type === 'text');
    if (!textBlock) {
      res.status(502).json({ error: 'La respuesta de la IA no incluyó texto' });
      return;
    }

    const clean = textBlock.text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    res.status(200).json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error inesperado analizando la imagen' });
  }
}

export const config = {
  api: {
    bodyParser: { sizeLimit: '10mb' }
  }
};
