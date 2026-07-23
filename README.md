# Plato — despliegue como PWA instalable

Esta carpeta es un proyecto completo y listo para desplegar en Vercel. Incluye:

- `index.html` — la app (frontend)
- `api/analyze.js` — backend que llama a la IA sin exponer tu clave
- `manifest.json`, `icon-192.png`, `icon-512.png` — para que se pueda instalar como app

Los datos (perfil, historial) se guardan en el propio navegador de tu iPhone (localStorage),
no en un servidor. Si borras datos de Safari o cambias de teléfono, se pierden.

## 1. Consigue tu clave de la API de Anthropic

Esto es distinto a tu cuenta de Claude.ai — es una clave de desarrollador con costo por uso
(muy bajo para uso personal, unos centavos de dólar por foto analizada).

1. Ve a https://console.anthropic.com
2. Crea una cuenta / inicia sesión
3. Ve a "API Keys" y crea una nueva clave
4. Guárdala, la vas a necesitar en el paso 3

## 2. Sube este proyecto a GitHub

1. Crea un repositorio nuevo en https://github.com/new
2. Sube todos los archivos de esta carpeta a ese repositorio
   (puedes arrastrar los archivos directo en la web de GitHub si no usas git en terminal)

## 3. Despliega en Vercel

1. Ve a https://vercel.com y crea una cuenta (puedes entrar con tu cuenta de GitHub)
2. Clic en "Add New… → Project"
3. Importa el repositorio que acabas de subir
4. Antes de darle "Deploy", abre la sección "Environment Variables" y agrega:
   - Nombre: `ANTHROPIC_API_KEY`
   - Valor: la clave que copiaste en el paso 1
5. Dale "Deploy". En 1-2 minutos te da una URL tipo `https://plato-app-tuusuario.vercel.app`

## 4. Instálala en tu iPhone

1. Abre esa URL en **Safari** (tiene que ser Safari, no Chrome, para que funcione el instalador de iOS)
2. Toca el botón de compartir (el cuadro con la flecha hacia arriba)
3. Baja y toca "Agregar a pantalla de inicio" ("Add to Home Screen")
4. Confirma el nombre y toca "Agregar"

Ya tienes un ícono de Plato en tu pantalla de inicio que abre la app en pantalla completa,
como cualquier otra app.

## 5. (Opcional) La clave de USDA FoodData Central

Dentro de la app, en el ⚙ de ajustes, puedes pegar tu clave gratuita de
https://fdc.nal.usda.gov/api-key-signup para que los macros se verifiquen contra su
base de datos real en vez de solo la estimación de la IA. Esta clave se guarda también
en tu teléfono (localStorage), nunca sale de tu navegador salvo para consultar a USDA.

## Notas honestas

- Cada foto analizada consume tokens de tu clave de Anthropic (costo real, aunque pequeño).
- Si en algún momento quieres que el historial se sincronice entre varios dispositivos
  (no solo tu iPhone), habría que agregar una base de datos real (por ejemplo Supabase)
  en vez de localStorage — es un paso aparte si llegas a necesitarlo.
