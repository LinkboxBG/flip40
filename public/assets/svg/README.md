# FLIP40 — Web Assets (растер, без векторизация)

## Лого (WEBP, прозрачен фон)
| Файл | Употреба |
|------|----------|
| `logo/flip40-logo.webp` | Пълно лого + слоган (hero, footer) — 1308×382 |
| `logo/flip40-logo-horizontal.webp` | Без слоган — за **хедър** |
| `logo/flip40-logo-horizontal-640.webp` | По-малък хедър вариант (640px) |
| `logo/flip40-logo-on-dark.webp` | Плътен тъмен фон (имейл/без прозрачност) |

Фонът е извлечен с алфа маска — сиянието е запазено, фоновата „матрица" е премахната.
Прозрачните варианти пасват директно върху тъмния фон на сайта (`#0a0c10`).

```html
<img src="/flip40-logo-horizontal.webp" alt="FLIP40" height="40">
```

## Фавикон
| Файл | Употреба |
|------|----------|
| `favicon/favicon.ico` | 16/32/48 — основен фавикон |
| `favicon/favicon-32x32.png`, `favicon-16x16.png` | PNG fallback |
| `favicon/apple-touch-icon.png` | 180×180 (iOS) |
| `favicon/icon-192.png`, `icon-512.png` | PWA икони |
| `favicon/site.webmanifest` | PWA манифест |
| `favicon/head-snippet.html` | готов `<head>` код |

Знакът „40" е поставен върху тъмна заоблена плочка, за да се чете и на светли табове.
Качи файловете от `favicon/` в root (`/`) и пейстни `head-snippet.html` в `<head>`.

> Цвят на марката: lime `#C2F305` · тъмен фон `#0a0c10`.
