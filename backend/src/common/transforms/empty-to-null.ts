import { Transform } from 'class-transformer';

/**
 * Turns a blank text field into `null` before it reaches the database.
 *
 * A form that clears an input sends `""`, not nothing, and an empty string
 * stored in a nullable column is not the same as an absent value: React
 * Native renders `{value && <Text>…</Text>}` as a bare text node when
 * `value` is `""`, which crashes a `<View>` with "Unexpected text node".
 * Normalising here means every reader gets `null` for "not set".
 */
export function EmptyStringToNull(): PropertyDecorator {
  return Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    return trimmed.length === 0 ? null : trimmed;
  });
}
