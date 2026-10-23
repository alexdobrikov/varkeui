# varkeui

[![npm](https://img.shields.io/npm/v/varkeui)](https://www.npmjs.com/package/varkeui)
[![CI](https://github.com/alexdobrikov/varkeui/actions/workflows/ci.yml/badge.svg)](https://github.com/alexdobrikov/varkeui/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/varkeui)](LICENSE)

Библиотека React-компонентов: плитки, списки, поля ввода, бенто-сетки. Без рантайм-зависимостей, светлая и тёмная темы на CSS-переменных, React 18 и 19, ESM и CommonJS с типами.

**[Документация и живые примеры →](https://alexdobrikov.github.io/varkeui/)**

## Установка

```bash
npm install varkeui
```

## Быстрый старт

```tsx
import 'varkeui/styles.css';
import { TileButton, PlusIcon } from 'varkeui';

export function Shortcuts() {
  return (
    <TileButton
      label="New playlist"
      image="/img/headphones.png"
      variant="outlined"
      badge={<PlusIcon />}
      onClick={createPlaylist}
    />
  );
}
```

Стили подключаются один раз в корне приложения. Тёмная тема включается атрибутом `data-vui-theme="dark"` на `<html>` или любом контейнере, цвета и шрифт переопределяются CSS-переменными — [подробнее о темах](https://alexdobrikov.github.io/varkeui/?path=/docs/темы--docs).

## Компоненты

### [TileButton](https://alexdobrikov.github.io/varkeui/?path=/docs/components-tilebutton--docs)

Плитка с картинкой и подписью: быстрые действия, разделы, коллекции.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/alexdobrikov/varkeui/main/docs/images/tile-button-dark.png" />
  <img src="https://raw.githubusercontent.com/alexdobrikov/varkeui/main/docs/images/tile-button-light.png" alt="TileButton" />
</picture>

### [List и ListItem](https://alexdobrikov.github.io/varkeui/?path=/docs/components-list--docs)

Пункты списка с иконкой, заголовком и подзаголовком: онбординг, настройки, меню.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/alexdobrikov/varkeui/main/docs/images/list-dark.png" />
  <img src="https://raw.githubusercontent.com/alexdobrikov/varkeui/main/docs/images/list-light.png" alt="List и ListItem" width="560" />
</picture>

### [Input и InputButton](https://alexdobrikov.github.io/varkeui/?path=/docs/components-input--docs)

Текстовое поле с подписью, ошибкой, иконками и кнопкой внутри.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/alexdobrikov/varkeui/main/docs/images/input-button-dark.png" />
  <img src="https://raw.githubusercontent.com/alexdobrikov/varkeui/main/docs/images/input-button-light.png" alt="Input и InputButton" width="440" />
</picture>

### [BentoGrid и BentoCard](https://alexdobrikov.github.io/varkeui/?path=/docs/components-bento--docs)

Бенто-сетка из карточек-ссылок с адаптивной раскладкой и поддержкой `Link` из роутеров.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/alexdobrikov/varkeui/main/docs/images/bento-dark.png" />
  <img src="https://raw.githubusercontent.com/alexdobrikov/varkeui/main/docs/images/bento-light.png" alt="BentoGrid и BentoCard" width="640" />
</picture>

## Разработка

Как запустить проект, добавить компонент и выпустить релиз — в [CONTRIBUTING.md](CONTRIBUTING.md).

## Лицензия

MIT
