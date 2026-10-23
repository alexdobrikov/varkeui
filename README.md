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

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/tile-button-dark.png" />
  <img src="docs/images/tile-button-light.png" alt="TileButton: варианты с фоном и с обводкой" />
</picture>

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

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/tile-button-wide-dark.png" />
  <img src="docs/images/tile-button-wide-light.png" alt="Широкие TileButton" />
</picture>

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

### List и ListItem

Пункт списка: иконка слева, заголовок и подзаголовок, справа — необязательный слот. `List` собирает пункты в `<ul>`.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/list-dark.png" />
  <img src="docs/images/list-light.png" alt="ListItem: иконка, заголовок и подзаголовок" />
</picture>

```tsx
import { List, ListItem } from 'varkeui';

<List>
  <ListItem
    size="lg"
    icon="/img/shield.png"
    title="Protect your data"
    subtitle="Verified accounts with enabled face or fingerprint login can't be stolen"
  />
  <ListItem size="lg" icon="/img/heart.png" title="Add family members" subtitle="…" />
</List>;
```

Без `onClick` и `href` пункт — обычный блок. С `onClick` он становится кнопкой, с `href` — ссылкой, и подсвечивается при наведении:

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/list-interactive-dark.png" />
  <img src="docs/images/list-interactive-light.png" alt="Кликабельные ListItem с разделителями" />
</picture>

```tsx
<List dividers>
  <ListItem
    icon={<UserIcon />}
    title="Personal data"
    subtitle="Name, phone number, email"
    after={<ChevronRightIcon />}
    onClick={openProfile}
  />
  <ListItem icon={<LockIcon />} title="Security" after={<ChevronRightIcon />} href="/security" />
</List>
```

| Проп            | Тип                   | По умолчанию | Описание                                                |
| --------------- | --------------------- | ------------ | ------------------------------------------------------- |
| `title`         | `ReactNode`           | —            | Заголовок                                               |
| `subtitle`      | `ReactNode`           | —            | Подзаголовок, приглушённым цветом                       |
| `icon`          | `string \| ReactNode` | —            | URL картинки или любой элемент                          |
| `iconSize`      | `string \| number`    | по `size`    | Сторона квадрата под иконку                             |
| `after`         | `ReactNode`           | —            | Правый слот: стрелка, переключатель, счётчик            |
| `size`          | `sm \| md \| lg`      | `md`         | Иконка 32 / 48 / 72 px и соответствующие размеры текста |
| `align`         | `center \| start`     | `center`     | Выравнивание иконки и правого слота по вертикали        |
| `titleLines`    | `number`              | `2`          | Максимум строк заголовка                                |
| `subtitleLines` | `number`              | `3`          | Максимум строк подзаголовка                             |
| `onClick`       | `function`            | —            | Делает пункт кнопкой                                    |
| `href`          | `string`              | —            | Делает пункт ссылкой                                    |
| `disabled`      | `boolean`             | `false`      | Для кликабельного пункта                                |

У `List` один собственный проп — `dividers`: тонкие линии между пунктами.

### Иконки

`PlusIcon`, `ChevronRightIcon` — простые SVG, берут цвет из `currentColor`.

## Разработка

Нужен Node.js 24 (версия лежит в `.nvmrc`).

```bash
npm install
npm run dev          # Storybook на http://localhost:6006
```

| Команда                   | Что делает                                       |
| ------------------------- | ------------------------------------------------ |
| `npm run dev`             | Storybook с живой перезагрузкой                  |
| `npm test`                | Тесты (Vitest + Testing Library)                 |
| `npm run test:watch`      | Тесты в watch-режиме                             |
| `npm run lint`            | ESLint                                           |
| `npm run format`          | Prettier по всему проекту                        |
| `npm run typecheck`       | Проверка типов                                   |
| `npm run build`           | Сборка библиотеки в `dist/`                      |
| `npm run build:storybook` | Статическая сборка Storybook                     |
| `npm run screenshots`     | Пересобрать картинки для README в `docs/images/` |
| `npm run check`           | Всё сразу — то же, что гоняет CI                 |
| `npm run changeset`       | Описать изменение для следующего релиза          |

### Структура

```
scripts/screenshots.mjs      снимает скриншоты сторис для README
docs/images/                 эти скриншоты
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
5. Добавить историю в `scripts/screenshots.mjs`, запустить `npm run screenshots` и вставить картинку в README.
6. `npm run changeset` — выбрать `minor` для нового компонента, `patch` для фикса.

### Релизы

Версионирование через [Changesets](https://github.com/changesets/changesets).

1. В каждом PR с изменениями в библиотеке лежит changeset-файл (`npm run changeset`).
2. После мержа в `main` бот открывает PR «Release» — в нём поднятая версия и CHANGELOG.
3. Мерж этого PR публикует пакет в npm.

Для публикации в репозитории должен быть секрет `NPM_TOKEN` (Settings → Secrets and variables → Actions), а в Settings → Actions → General — включена галочка «Allow GitHub Actions to create and approve pull requests». Пока репозиторий приватный, workflow релиза пропускается.

## Лицензия

MIT
