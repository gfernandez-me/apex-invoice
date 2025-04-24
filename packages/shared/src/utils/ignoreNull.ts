export function ignoreNull(
  strings: TemplateStringsArray,
  ...values: (string | null | undefined)[]
): string {
  let result = '';
  for (let i = 0; i < values.length; i++) {
    if (values[i] === null) {
      result += strings[i];
    } else {
      result += `${strings[i]}${values[i]}`;
    }
  }
  result += strings[values.length];
  return result;
}
