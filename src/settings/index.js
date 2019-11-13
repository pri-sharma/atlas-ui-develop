export default {
  apiUrl: 'http://yoursite.com/api/',
};

const siteConfig = {
  siteName: 'Atlas',
  siteIcon: 'ion-flash',
  footerText: 'Atlas ©2019',
};
const themeConfig = {
  topbar: 'themedefault',
  sidebar: 'themedefault',
  layout: 'themedefault',
  theme: 'themedefault',
  material: 'materialtheme',
  light: 'lightTheme',
  normal: 'normalTheme',
  dark: 'darkTheme',
};
const language = 'english';

const jwtConfig = {
  fetchUrl: '/api/',
  secretKey: 'secretKey',
};

export { siteConfig, language, themeConfig, jwtConfig };
