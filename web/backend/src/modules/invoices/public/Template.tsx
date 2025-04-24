import { I18nContext, I18nManager } from '@shopify/react-i18n';
import { type PropsWithChildren } from 'react';

export default function I18Template({ children }: PropsWithChildren) {
  const i18nManager = new I18nManager({
    locale: 'en',
  });

  return (
    <I18nContext.Provider value={i18nManager}>{children}</I18nContext.Provider>
  );
}
