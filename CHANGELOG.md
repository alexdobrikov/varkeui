# varkeui

## 0.14.0

### Minor Changes

- ImageInput: optional size limits, local WebP resizing, clipboard/keyboard paste, URL input, async upload state and recoverable errors. Export prepareImage for shared upload pipelines.

## 0.13.0

### Minor Changes

- Add a 72px xs TileButton size, keeping the corner badge at the same 28px size as sm.

## 0.12.0

### Minor Changes

- Add a native Select using Input sizes, tokens, states and accessible labels.

## 0.11.1

### Patch Changes

- 5bf46a8: Input: подсветка автозаполненного поля при наведении больше не распадается на прямоугольник и скруглённую часть — тень автозаполнения меняет цвет вместе с фоном поля.

## 0.11.0

### Minor Changes

- 1a348b6: NumberInput: вариант `outlined` — с обводкой и без фона, как у Input.

## 0.10.0

### Minor Changes

- d9f8e9b: Новые компоненты: NumberInput — поле для числа с кнопками «−» и «+» (шаг, границы, формат, стрелки клавиатуры) и Avatar/AvatarGroup — аватар с фото или инициалами на цветном круге и группа аватаров с наездом и «+N». Иконка MinusIcon.

## 0.9.0

### Minor Changes

- 034db93: Новые компоненты: Modal — модальное окно на нативном `<dialog>` (заголовок, описание, иконка, кнопки равной ширины, Esc и клик по фону) и ImageInput — поле для картинки с превью, загрузкой и перетаскиванием файла. Иконка ImageIcon.

  SegmentedControl с `block`: сегменты растягиваются от ширины своей подписи, а не делят ширину поровну — длинные подписи больше не обрезаются, когда места хватает.

### Patch Changes

- f20f0d1: Toaster: уведомления показываются поверх открытого Modal — область уведомлений стала поповером в верхнем слое браузера и поднимается на каждое новое уведомление.

## 0.8.2

### Patch Changes

- 133f563: SectionHeader: кнопка в `action` выравнивается по центру строки заголовка, а не всего блока — с подзаголовком она больше не съезжает вниз. Подзаголовок идёт под заголовком на всю ширину.

## 0.8.1

### Patch Changes

- 02f22a9: Input: browser autofill no longer paints a mismatched rectangle inside the rounded field

## 0.8.0

### Minor Changes

- fd2334a: Add Sidebar: collapsible app menu with a slide-out panel on phones
- fd2334a: Add StatCard and StatRow

## 0.7.0

### Minor Changes

- 350a017: Новые компоненты `PromoCard` и `PromoCarousel`. `PromoCard` — промо-карточка с крупным заголовком, иллюстрацией, кнопкой и крестиком. Тоны `dark`, `light` и `neutral` или свой фон, картинка может выходить за верхний край, раскладка подстраивается под ширину карточки. `PromoCarousel` листает карточки по таймеру с полоской прогресса на точках и ставит таймер на паузу при наведении и фокусе. На телефоне листается свайпом, на компьютере — стрелками и клавиатурой.
- 7f995bc: `SectionHeader`: проп `count` — число рядом с заголовком приглушённым цветом, например «Notifications 30». Работает и с заголовком-ссылкой.

## 0.6.0

### Minor Changes

- 97cab89: Новые компоненты: `Banner` для сообщений на странице, `Toast` с функцией `toast()` и `Toaster`, `Chip` для фильтров и тегов, `Skeleton` для загрузки. Иконки `InfoIcon`, `CheckCircleIcon`, `WarningIcon`, `ErrorIcon`, токены `--vui-color-info`, `--vui-color-success`, `--vui-color-warning`.
- 21012d3: Единая шкала размеров. `Button`, `IconButton` и `SegmentedControl` теперь 40 / 48 / 56 px со скруглением 12 / 16 / 20 px — как `Input`, поэтому поле и кнопка одного размера стоят в ряд ровно. Раньше кнопка `md` была 44 px, переключатель — 40 px. Ячейки `CodeInput` — 56 и 64 px в высоту, мелкий вторичный текст поднят до 14–15 px, скругление `Skeleton` по умолчанию — 16 px.

### Patch Changes

- 72d0a94: `Banner`: иконка увеличена до 28 px и выровнена по первой строке. Размер можно поменять переменной `--vui-banner-icon-size`.
- 1fc0e13: `Chip`, `Badge`, `TileButton`, кликабельные `ListItem` и `BentoCard` больше не выделяют текст при клике и не показывают текстовый курсор: это цельные элементы, а не текст.
- 1aecc66: `Banner` и `Toast` стали просторнее, в ритме остальных компонентов: больше отступы и скругления, текст 16 px, иконки 24 px.

## 0.5.0

### Minor Changes

- ed2c66c: Новые компоненты форм: `SegmentedControl`, `CodeInput` для кодов подтверждения со вставкой и автоподстановкой из СМС, `Checkbox`, `Radio` с `RadioGroup` и `Textarea`, которая растёт с текстом. Токен `--vui-color-surface-raised`.

## 0.4.0

### Minor Changes

- d01ed68: Новые компоненты: `SectionHeader` — заголовок секции со стрелкой-ссылкой, `Scroller` — горизонтальная лента со стрелками на десктопе, `Switch` и `Badge`. `ListItem` получил `as`, чтобы строка могла быть `label` или ссылкой роутера. Иконка `ChevronLeftIcon`, токен `--vui-color-success-solid`.

### Patch Changes

- e359236: `TileButton`: выемка вокруг `Badge` в углу теперь обтягивает счётчик тонким кольцом и растягивается под двузначные числа, а не рисует круг на 40 px.
- 695d83e: Сборка помечена `"use client"`: компоненты с хуками (`Input`, `Scroller`, `Switch`) больше не ломают серверные компоненты Next.js.

## 0.3.0

### Minor Changes

- 75bc821: Новые компоненты `Button` и `IconButton`: варианты primary, secondary, outline, ghost и danger, три размера, иконки, состояние загрузки, ссылки через `href` и `as`. Иконка `TrashIcon`, токены `--vui-color-danger-solid*`.

### Patch Changes

- 9c871e6: README: скриншот бенто-сетки перенесён в раздел компонента.

## 0.2.0

### Minor Changes

- 904d8c2: Новые компоненты `BentoGrid` и `BentoCard` для бенто-сеток. Колонки, высота строк и размеры карточек задаются числом или по брейкпоинтам, брейкпоинты считаются от ширины самой сетки. Карточка — ссылка с `href`, кнопка с `onClick` или любой компонент через `as`, например `Link` из роутера.

### Patch Changes

- 94016a2: Разделитель над неактивным `ListItem` больше не бледнеет вместе с пунктом.
- 96d50e0: Ссылка на документацию, ключевые слова и описание пакета для поиска в npm.

## 0.1.0

### Minor Changes

- 4648bf3: Новые компоненты `Input` и `InputButton`: поле с подписью, подсказкой и ошибкой, иконками слева и справа и кнопкой внутри. Иконки `SearchIcon`, `CloseIcon`, `EyeIcon`, `EyeOffIcon`, `ArrowRightIcon`. В токены добавлены `--vui-color-accent*` и `--vui-color-danger`.
- d7960d6: Новые компоненты `List` и `ListItem` — пункт списка с иконкой, заголовком, подзаголовком и правым слотом. Добавлена иконка `ChevronRightIcon`.
- 5d91d1f: Первый компонент — `TileButton`: плитка с картинкой и подписью, варианты filled/outlined, бейдж с выемкой, произвольные размеры и соотношение сторон.

### Patch Changes

- 3255df5: `Input` прячет нативную кнопку очистки у `type="search"` и кнопку показа пароля в Edge, чтобы они не дублировали свои кнопки в `action`.
