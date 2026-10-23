# varkeui

Библиотека React-компонентов. Лёгкая, без рантайм-зависимостей, стилизуется через CSS-переменные.

```bash
npm install varkeui
```

## Подключение

Стили подключаются один раз в корне приложения:

```tsx
import 'varkeui/styles.css';
```

Дальше компоненты импортируются напрямую:

```tsx
import { TileButton, PlusIcon } from 'varkeui';

export function Shortcuts() {
  return (
    <>
      <TileButton label="Credit" image="/img/flamingo.png" imagePosition="bottom" />
      <TileButton
        label="Family card"
        image="/img/card.png"
        imagePosition="bottom"
        variant="outlined"
        badge={<PlusIcon />}
        onClick={() => openFamilyCard()}
      />
    </>
  );
}
```

Работает с React 18 и 19, поставляется в ESM и CommonJS с типами.

## Темы

Из коробки есть светлая и тёмная темы. Тема задаётся атрибутом на любом элементе-предке, обычно на `<html>`:

```html
<html data-vui-theme="dark"></html>
```

Все цвета — CSS-переменные, их можно переопределить глобально или для отдельного блока:

```css
:root {
  --vui-color-bg: #1f1e23; /* фон страницы, им же закрашивается выемка под бейджем */
  --vui-color-surface: #2d2c32; /* фон плиток */
  --vui-color-surface-hover: #36353b;
  --vui-color-border: #3b3a40; /* обводка outlined-варианта */
  --vui-color-text: #ffffff;
  --vui-color-text-muted: #8e8d94;
  --vui-color-focus: #7aa0ff;
  --vui-font-family: Inter, system-ui, sans-serif;
}
```

## Компоненты

### TileButton

Квадратная (или любая другая) плитка с картинкой внутри и подписью снизу. Подходит для быстрых действий, разделов, документов, адресов.

| Проп            | Тип                                                       | По умолчанию | Описание                                                               |
| --------------- | --------------------------------------------------------- | ------------ | ---------------------------------------------------------------------- |
| `label`         | `ReactNode`                                               | —            | Подпись под плиткой                                                    |
| `image`         | `string \| ReactNode`                                     | —            | URL картинки или любой элемент: svg, иконка, `<img>`                   |
| `imageAlt`      | `string`                                                  | `''`         | alt для картинки, если передан URL                                     |
| `imagePosition` | `center`, `top`, `bottom`, `left`, `right`, `top-left`, … | `center`     | Куда прижать картинку внутри плитки                                    |
| `imageSize`     | `string \| number`                                        | `100%`       | Размер картинки: `70%`, `96`, `6rem`                                   |
| `imageFit`      | `contain \| cover`                                        | `contain`    | `cover` растягивает картинку на всю плитку                             |
| `variant`       | `filled \| outlined`                                      | `filled`     | С фоном или с обводкой. Размер у обоих одинаковый — обводка внутренняя |
| `size`          | `sm \| md \| lg`                                          | `lg`         | 96, 128 и 160 px                                                       |
| `width`         | `string \| number`                                        | —            | Своя ширина, перебивает `size`                                         |
| `aspectRatio`   | `string \| number`                                        | `1`          | Соотношение сторон: `2.2`, `'16 / 9'`                                  |
| `radius`        | `string \| number`                                        | по `size`    | Скругление углов                                                       |
| `block`         | `boolean`                                                 | `false`      | Растянуть на ширину контейнера — удобно в гридах                       |
| `badge`         | `ReactNode`                                               | —            | Элемент в правом верхнем углу. Под ним вырезается выемка цвета фона    |
| `labelLines`    | `number`                                                  | `2`          | Сколько строк подписи показывать, остальное обрезается многоточием     |
| `href`          | `string`                                                  | —            | Если передан, плитка рендерится ссылкой `<a>`                          |

Остальные пропсы (`onClick`, `disabled`, `aria-*`, `className`, `style` и т. д.) уходят на корневой `<button>` или `<a>`. `ref` тоже пробрасывается.

Широкие плитки с картинкой на весь фон:

```tsx
<TileButton label="Home" image="/img/home-map.jpg" imageFit="cover" width={352} aspectRatio={2.2} />
```

Резиновая сетка:

```tsx
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
  <TileButton block aspectRatio={2.2} imageFit="cover" label="Home" image={home} />
  <TileButton block aspectRatio={2.2} imageFit="cover" label="Work" image={work} />
  <TileButton block aspectRatio={2.2} imageFit="cover" label="Other" image={other} />
</div>
```

Если под плиткой не однотонный фон, цвет выемки задаётся отдельно:

```css
.my-section .vui-tile {
  --vui-tile-notch-color: #141317;
}
```

## Разработка

Нужен Node.js 24 (версия лежит в `.nvmrc`).

```bash
npm install
npm run dev          # Storybook на http://localhost:6006
```

| Команда                   | Что делает                              |
| ------------------------- | --------------------------------------- |
| `npm run dev`             | Storybook с живой перезагрузкой         |
| `npm test`                | Тесты (Vitest + Testing Library)        |
| `npm run test:watch`      | Тесты в watch-режиме                    |
| `npm run lint`            | ESLint                                  |
| `npm run format`          | Prettier по всему проекту               |
| `npm run typecheck`       | Проверка типов                          |
| `npm run build`           | Сборка библиотеки в `dist/`             |
| `npm run build:storybook` | Статическая сборка Storybook            |
| `npm run check`           | Всё сразу — то же, что гоняет CI        |
| `npm run changeset`       | Описать изменение для следующего релиза |

### Структура

```
src/
  components/
    TileButton/
      TileButton.tsx          компонент
      TileButton.css          стили
      TileButton.stories.tsx  сторисы
      TileButton.test.tsx     тесты
      index.ts
  icons/                      иконки
  styles/
    tokens.css                цвета, шрифты, темы
    index.css                 собирает все стили в dist/styles.css
  index.ts                    публичные экспорты
```

### Как добавить компонент

1. Создать папку `src/components/Name/` по образцу `TileButton`.
2. Классы — с префиксом `vui-`, цвета — только через переменные из `tokens.css`.
3. Подключить CSS в `src/styles/index.css`, экспорт — в `src/index.ts`.
4. Написать сторис и тесты.
5. `npm run changeset` — выбрать `minor` для нового компонента, `patch` для фикса.

### Релизы

Версионирование через [Changesets](https://github.com/changesets/changesets).

1. В каждом PR с изменениями в библиотеке лежит changeset-файл (`npm run changeset`).
2. После мержа в `main` бот открывает PR «Release» — в нём поднятая версия и CHANGELOG.
3. Мерж этого PR публикует пакет в npm.

Для публикации в репозитории должен быть секрет `NPM_TOKEN` (Settings → Secrets and variables → Actions), а в Settings → Actions → General — включена галочка «Allow GitHub Actions to create and approve pull requests». Пока репозиторий приватный, workflow релиза пропускается.

## Лицензия

MIT
