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

### [Button и IconButton](https://alexdobrikov.github.io/varkeui/?path=/docs/components-button--docs)

Кнопки действий: primary, secondary, outline, ghost и danger, с иконками, загрузкой и вариантом-ссылкой.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/alexdobrikov/varkeui/main/docs/images/button-dark.png" />
  <img src="https://raw.githubusercontent.com/alexdobrikov/varkeui/main/docs/images/button-light.png" alt="Button и IconButton" width="640" />
</picture>

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

### [SectionHeader](https://alexdobrikov.github.io/varkeui/?path=/docs/components-sectionheader--docs) и [Scroller](https://alexdobrikov.github.io/varkeui/?path=/docs/components-scroller--docs)

Заголовки секций со стрелкой-ссылкой и горизонтальные ленты: листаются пальцем с прилипанием, на десктопе — стрелками и клавиатурой.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/alexdobrikov/varkeui/main/docs/images/hub-dark.png" />
  <img src="https://raw.githubusercontent.com/alexdobrikov/varkeui/main/docs/images/hub-light.png" alt="SectionHeader и Scroller" width="640" />
</picture>

### [Switch](https://alexdobrikov.github.io/varkeui/?path=/docs/components-switch--docs) и [Badge](https://alexdobrikov.github.io/varkeui/?path=/docs/components-badge--docs)

Переключатели для настроек — в том числе целой строкой списка — и счётчики.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/alexdobrikov/varkeui/main/docs/images/settings-dark.png" />
  <img src="https://raw.githubusercontent.com/alexdobrikov/varkeui/main/docs/images/settings-light.png" alt="Switch и Badge в списке настроек" width="480" />
</picture>

### Формы

[SegmentedControl](https://alexdobrikov.github.io/varkeui/?path=/docs/components-segmentedcontrol--docs), [CodeInput](https://alexdobrikov.github.io/varkeui/?path=/docs/components-codeinput--docs), [Radio](https://alexdobrikov.github.io/varkeui/?path=/docs/components-radio--docs), [Checkbox](https://alexdobrikov.github.io/varkeui/?path=/docs/components-checkbox--docs) и [Textarea](https://alexdobrikov.github.io/varkeui/?path=/docs/components-textarea--docs) — на нативных элементах форм, поэтому работают клавиатура, автозаполнение и react-hook-form.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/alexdobrikov/varkeui/main/docs/images/form-dark.png" />
  <img src="https://raw.githubusercontent.com/alexdobrikov/varkeui/main/docs/images/form-light.png" alt="Элементы форм varkeui" width="480" />
</picture>

### Обратная связь

[Banner](https://alexdobrikov.github.io/varkeui/?path=/docs/components-banner--docs), [Toast](https://alexdobrikov.github.io/varkeui/?path=/docs/components-toast--docs) с вызовом `toast()` из любого места кода, [Chip](https://alexdobrikov.github.io/varkeui/?path=/docs/components-chip--docs) для фильтров и тегов, [Skeleton](https://alexdobrikov.github.io/varkeui/?path=/docs/components-skeleton--docs) на время загрузки.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/alexdobrikov/varkeui/main/docs/images/feedback-dark.png" />
  <img src="https://raw.githubusercontent.com/alexdobrikov/varkeui/main/docs/images/feedback-light.png" alt="Banner, Chip, Skeleton и Toast" width="500" />
</picture>

### [PromoCard](https://alexdobrikov.github.io/varkeui/?path=/docs/components-promocard--docs) и [PromoCarousel](https://alexdobrikov.github.io/varkeui/?path=/docs/components-promocarousel--docs)

Промо-карточки с крупным заголовком, иллюстрацией и кнопкой, а также карусель, которая листает их по таймеру. На телефоне — свайп, на компьютере — стрелки.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/alexdobrikov/varkeui/main/docs/images/promo-dark.png" />
  <img src="https://raw.githubusercontent.com/alexdobrikov/varkeui/main/docs/images/promo-light.png" alt="PromoCard и PromoCarousel" width="640" />
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
