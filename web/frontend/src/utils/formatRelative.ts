import { enCA } from 'date-fns/esm/locale';

export const formatRelativeLocale = {
  lastWeek: "eeee 'at' hh:mm aaa",
  yesterday: "'Yesterday at' hh:mm aaa",
  today: "'Today at' hh:mm aaa",
  tomorrow: "'Tomorrow at' hh:mm aaa",
  nextWeek: "eeee 'at' hh:mm aaa",
  other: 'MMM d, y',
};

type Token = keyof typeof formatRelativeLocale;

export default function formatRelative(token: Token) {
  return formatRelativeLocale[token];
}

export const locale = {
  ...enCA,
  formatRelative,
};
