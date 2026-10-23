# Разработка varkeui

Нужен Node.js 24 (версия лежит в `.nvmrc`).

```bash
npm install
npm run dev   # Storybook на http://localhost:6006
```

## Команды

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

## Структура

```
src/
  components/
    TileButton/
      TileButton.tsx          компонент
      TileButton.css          стили
      TileButton.mdx          страница документации
      TileButton.stories.tsx  примеры для документации и Storybook
      TileButton.test.tsx     тесты
      index.ts
  docs/                       общие страницы документации
  icons/                      иконки
  styles/
    tokens.css                цвета, шрифты, темы
    index.css                 собирает все стили в dist/styles.css
  utils/                      общие хелперы
  index.ts                    публичные экспорты
.storybook/public/demo/       иллюстрации для примеров
scripts/screenshots.mjs       снимает скриншоты сторис для README
docs/images/                  эти скриншоты
```

## Как добавить компонент

1. Создать папку `src/components/Name/` по образцу соседних.
2. Классы — с префиксом `vui-`, цвета — только через переменные из `tokens.css`.
3. Подключить CSS в `src/styles/index.css`, экспорт — в `src/index.ts`.
4. Описать каждый проп JSDoc-комментарием — из них строится таблица пропсов в документации.
5. Написать сторис, тесты и страницу `Name.mdx`: когда использовать, примеры, пропсы, доступность, CSS-переменные.
6. Если компонент стоит показать в README — добавить историю в `scripts/screenshots.mjs` и запустить `npm run screenshots`.
7. `npm run changeset` — `minor` для нового компонента, `patch` для фикса.

## Документация

Storybook собирается и публикуется на GitHub Pages при каждом пуше в `main` (workflow `docs.yml`).

## Релизы

Версионирование через [Changesets](https://github.com/changesets/changesets).

1. Изменения в библиотеке сопровождаются changeset-файлом (`npm run changeset`).
2. После мержа в `main` бот открывает PR «Release» — в нём поднятая версия и CHANGELOG.
3. Мерж этого PR публикует пакет в npm, ставит git-тег и создаёт GitHub Release.

Публикация идёт через [trusted publishing](https://docs.npmjs.com/trusted-publishers): npm доверяет workflow `release.yml` из этого репозитория, токены и секреты не нужны. Право на публикацию (`id-token: write`) есть только у job'а `publish`.
