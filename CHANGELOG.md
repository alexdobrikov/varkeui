# varkeui

## 0.1.0

### Minor Changes

- 4648bf3: Новые компоненты `Input` и `InputButton`: поле с подписью, подсказкой и ошибкой, иконками слева и справа и кнопкой внутри. Иконки `SearchIcon`, `CloseIcon`, `EyeIcon`, `EyeOffIcon`, `ArrowRightIcon`. В токены добавлены `--vui-color-accent*` и `--vui-color-danger`.
- d7960d6: Новые компоненты `List` и `ListItem` — пункт списка с иконкой, заголовком, подзаголовком и правым слотом. Добавлена иконка `ChevronRightIcon`.
- 5d91d1f: Первый компонент — `TileButton`: плитка с картинкой и подписью, варианты filled/outlined, бейдж с выемкой, произвольные размеры и соотношение сторон.

### Patch Changes

- 3255df5: `Input` прячет нативную кнопку очистки у `type="search"` и кнопку показа пароля в Edge, чтобы они не дублировали свои кнопки в `action`.
