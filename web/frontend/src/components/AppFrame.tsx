// AppFrame.js
import { Frame, TopBar } from '@shopify/polaris';
import { type PropsWithChildren } from 'react';

import { LogoImage } from '../assets';

function AppFrame({ children }: PropsWithChildren) {
  const logo = {
    width: 124,
    topBarSource: LogoImage,
    contextualSaveBarSource: LogoImage,
  };

  const topBarMarkup = <TopBar />;

  //   const logo = {
  //     width: 124,
  //     topBarSource:
  //       "https://cdn.shopify.com/s/files/1/0446/6937/files/jaded-pixel-logo-color.svg?6215648040070010999",
  //     url: "http://jadedpixel.com",
  //     accessibilityLabel: "Jaded Pixel",
  //   };

  return (
    <Frame logo={logo} topBar={topBarMarkup}>
      {children}
    </Frame>
  );
}

export default AppFrame;
