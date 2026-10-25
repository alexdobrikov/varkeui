import {
  forwardRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type InputHTMLAttributes,
} from 'react';
import { cx } from '../../utils/cx';

export interface CodeInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'value' | 'defaultValue' | 'maxLength'
> {
  /**
   * Количество символов.
   * @default 6
   */
  length?: number;
  /** Значение — для контролируемого режима. */
  value?: string;
  /** Начальное значение. */
  defaultValue?: string;
  /** Вызывается с новым значением после каждого ввода. */
  onValueChange?: (value: string) => void;
  /** Вызывается, когда введены все символы. Удобно, чтобы сразу отправить код. */
  onComplete?: (value: string) => void;
  /**
   * `numeric` — только цифры и цифровая клавиатура на телефоне, `text` — буквы и цифры.
   * @default numeric
   */
  mode?: 'numeric' | 'text';
  /** Скрывать введённые символы точками. */
  mask?: boolean;
  /** Подсветить ячейки как ошибочные — например, после неверного кода. */
  invalid?: boolean;
  /**
   * Размер ячеек: 48 или 56 px.
   * @default md
   */
  size?: 'md' | 'lg';
  /** Класс корневого элемента. */
  className?: string;
  /** Стили корневого элемента. */
  style?: CSSProperties;
}

export const CodeInput = forwardRef<HTMLInputElement, CodeInputProps>(function CodeInput(
  {
    length = 6,
    value,
    defaultValue = '',
    onValueChange,
    onComplete,
    onChange,
    onFocus,
    onBlur,
    mode = 'numeric',
    mask,
    invalid,
    size = 'md',
    disabled,
    className,
    style,
    ...rest
  },
  ref,
) {
  const [inner, setInner] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const current = (value !== undefined ? value : inner).slice(0, length);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    const next = (mode === 'numeric' ? raw.replace(/\D/g, '') : raw.replace(/[\s-]/g, '')).slice(
      0,
      length,
    );
    onChange?.(event);
    if (value === undefined) setInner(next);
    onValueChange?.(next);
    if (next.length === length && next !== current) onComplete?.(next);
  };

  const active = Math.min(current.length, length - 1);

  return (
    <div
      className={cx(
        'vui-code',
        `vui-code--${size}`,
        invalid && 'vui-code--invalid',
        disabled && 'vui-code--disabled',
        className,
      )}
      style={{ '--vui-code-length': length, ...style } as CSSProperties}
    >
      <input
        ref={ref}
        className="vui-code__input"
        type="text"
        inputMode={mode === 'numeric' ? 'numeric' : 'text'}
        autoComplete="one-time-code"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        value={current}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        onChange={handleChange}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        onSelect={(event) => {
          const input = event.currentTarget;
          input.setSelectionRange(input.value.length, input.value.length);
        }}
        {...rest}
      />
      {Array.from({ length }, (_, index) => {
        const char = current[index];
        return (
          <span
            key={index}
            aria-hidden="true"
            className={cx(
              'vui-code__cell',
              char !== undefined && 'vui-code__cell--filled',
              focused && index === active && 'vui-code__cell--active',
            )}
          >
            {char !== undefined && (mask ? <span className="vui-code__dot" /> : char)}
            {focused && index === current.length && <span className="vui-code__caret" />}
          </span>
        );
      })}
    </div>
  );
});
