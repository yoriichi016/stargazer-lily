# A Little Lily Surprise 🌸

A responsive, pixel-art inspired mini surprise built with React + Vite. The original black-cat character has been replaced with an original pixel-art Stargazer lily.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to Vercel

1. Create a GitHub repository and upload this project.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Vercel should detect Vite automatically.
4. Keep the build command as `npm run build` and output directory as `dist`.
5. Click **Deploy**.

No environment variables are required.

## Customize the message

Open `src/main.jsx` and edit the text in the `.question` paragraph and the `.accepted` message.

The lily is an inline SVG made from crisp-edged pixel shapes, so it stays sharp at different screen sizes. You can adjust its petal colors in the `PixelLily` component.
