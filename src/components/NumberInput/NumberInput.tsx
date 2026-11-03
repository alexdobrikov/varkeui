import {
  forwardRef,
  useId,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { MinusIcon, PlusIcon } from '../../icons';
import { cx } from '../../utils/cx';
import type { InputSize, InputVariant } from '../Input';

export interface NumberInputProps {
  /** Текущее число. */
  value: number;
  /** Новое число — уже в пределах `min`…`max` и кратное `step`. */
  onValueChange: (value: number) => void;
  /** @default 0 */
  min?: number;
  /** @default Infinity */
  max?: number;
  /**
   * Шаг кнопок «−» и «+», стрелок клавиатуры и округления.
   * @default 1
   */
  step?: number;
  /** Как показать число в поле: «1,5 ч», «1 500 ₽». Ввод разбирается обратно как число. */
  format?: (value: number) => string;
  /**
   * Высота поля: 40, 48 или 56 px — как у Input.
   * @default md
   */
  size?: InputSize;
  /**
   * `filled` — с фоном, `outlined` — с обводкой, как у Input.
   * @default filled
   */
  variant?: InputVariant;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  disabled?: boolean;
  /** Растянуть на ширину контейнера. */
  block?: boolean;
  /** @default Decrease */
  decrementLabel?: string;
  /** @default Increase */
  incrementLabel?: string;
  /** Подпись поля для скринридеров, если нет `label`. */
  'aria-label'?: string;
  id?: string;
  name?: string;
  className?: string;
  style?: CSSProperties;
}

const parse = (raw: string) => Number(raw.replace(/[^\d.,-]/g, '').replace(',', '.'));

/** Поле для числа с кнопками «−» и «+»: количество, длительность, цена. Число можно и вписать. */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  {
    value,
    onValueChange,
    min = 0,
    max = Number.POSITIVE_INFINITY,
    step = 1,
    format = String,
    size = 'md',
    variant = 'filled',
    label,
    hint,
    error,
    disabled,
    block,
    decrementLabel = 'Decrease',
    incrementLabel = 'Increase',
    'aria-label': ariaLabel,
    id,
    name,
    className,
    style,
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = useId();
  // Пока пишут — это текст; число применяется на blur или Enter.
  const [draft, setDraft] = useState<string | null>(null);
  const message = error ?? hint;

  const clamp = (v: number) => {
    const stepped = Math.round((v - min) / step) * step + min;
    // Округление шага не должно давать хвосты вроде 1.5000000002.
    const clean = Number(stepped.toFixed(10));
    return Math.min(max, Math.max(min, clean));
  };
  const set = (v: number) => {
    const next = clamp(v);
    if (next !== value) onValueChange(next);
  };
  const commit = () => {
    if (draft === null) return;
    const v = parse(draft);
    if (draft.trim() !== '' && !Number.isNaN(v)) set(v);
    setDraft(null);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      setDraft(null);
      set(value + (event.key === 'ArrowUp' ? step : -step));
    } else if (event.key === 'Enter') {
      commit();
    }
  };

  return (
    <div
      className={cx(
        'vui-input',
        `vui-input--${size}`,
        `vui-input--${variant}`,
        'vui-number-input',
        block && 'vui-input--block',
        error != null && 'vui-input--invalid',
        disabled && 'vui-input--disabled',
        className,
      )}
      style={style}
    >
      {label != null && (
        <label className="vui-input__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className="vui-input__field vui-number-input__field">
        <button
          type="button"
          className="vui-number-input__step"
          aria-label={decrementLabel}
          aria-controls={inputId}
          disabled={disabled || value <= min}
          onClick={() => set(value - step)}
        >
          <MinusIcon />
        </button>
        <input
          ref={ref}
          id={inputId}
          name={name}
          className="vui-input__control vui-number-input__control"
          role="spinbutton"
          inputMode="decimal"
          aria-label={label == null ? ariaLabel : undefined}
          aria-valuenow={value}
          aria-valuemin={Number.isFinite(min) ? min : undefined}
          aria-valuemax={Number.isFinite(max) ? max : undefined}
          aria-valuetext={format(value)}
          aria-invalid={error != null || undefined}
          aria-describedby={message != null ? hintId : undefined}
          disabled={disabled}
          value={draft ?? format(value)}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={onKeyDown}
        />
        <button
          type="button"
          className="vui-number-input__step"
          aria-label={incrementLabel}
          aria-controls={inputId}
          disabled={disabled || value >= max}
          onClick={() => set(value + step)}
        >
          <PlusIcon />
        </button>
      </div>
      {message != null && (
        <div className="vui-input__hint" id={hintId}>
          {message}
        </div>
      )}
    </div>
  );
});
