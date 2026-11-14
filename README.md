# Xixi's Birthday 2026
otro cumpleaños , creo que ya me deberian que pagar por esto 
Página web de cumpleaños hecha con HTML, CSS y JavaScript puro. Tiene un telón animado de entrada, música de fondo, un mensaje de felicitación y un libro de visitas anónimo donde los amigos dejan sus deseos. Los deseos se guardan en una base de datos de Supabase.

Tema visual inspirado en Lyney (Genshin Impact): rojos, rosas y un toque de espectáculo de magia.

## Qué incluye

- Pantalla de entrada con telón que se abre, confeti y sonido de matasuegras.
- Música de fondo con botón de pausa.
- Mensaje de cumpleaños en una tarjeta tipo boleto.
- Libro de visitas anónimo (máximo 500 caracteres por mensaje) con lista de deseos en tiempo de carga.
- Diseño responsivo y respeto a la preferencia de "reducir movimiento" del sistema.

## Estructura

```
index.html            Estructura de la página
style.css             Estilos y animaciones
script.js             Telón, audio, confeti y conexión con Supabase
supabase.sql          Tabla y permisos de la base de datos
espantasuegras.wav    Sonido al abrir el telón
showtime.mp3          Música de fondo
lyney-chibi.gif       Imagen de la tarjeta
```

## Configuración de Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Abre **SQL Editor → New query**, pega el contenido de `supabase.sql` y dale **Run**. Crea la tabla `wishes` con sus políticas de seguridad (RLS): cualquiera puede leer y enviar deseos, pero nadie puede editarlos ni borrarlos desde la página.
3. En **Project Settings → API** copia el **Project URL** y la llave **anon / publishable**.
4. Pégalos al inicio de `script.js`:

   ```js
   const SUPABASE_URL = "https://TU-PROYECTO.supabase.co";
   const SUPABASE_KEY = "TU_LLAVE_PUBLISHABLE";
   ```

> Usa solo la llave anon o publishable. La `service_role` o secret nunca debe ir en `script.js`, porque ese archivo es público.

## Probar en local

Abre `index.html` en el navegador. Si algo falla, abre las herramientas de desarrollador (F12 → Console) para ver el error. Si cambias archivos, recarga con Ctrl+F5 para evitar la caché.

## Publicarla

Es un sitio estático: sirve cualquier hosting gratuito de archivos estáticos, como Netlify Drop, Cloudflare Pages o GitHub Pages. Basta con subir la carpeta completa.

## Moderación

Los deseos se publican al instante. Para borrar uno, entra a **Table Editor → wishes** en Supabase y elimina la fila, o usa:

```sql
delete from public.wishes where id = 'ID-DEL-DESEO';
```

## Créditos

Hecho por Camote Team Software, 2026. Basado en un proyecto anterior de la misma serie de páginas de cumpleaños con Supabase.
