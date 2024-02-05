/* eslint-disable @typescript-eslint/no-shadow */

function part<T>(root: string, producer: (r: string) => T) {
  return { rootPath: root + '*', ...producer(root) };
}

export const routes = {
  home: '/',
  siteMap: '/site-map',
  declarationOfAccessibility: '/declaration-of-accessibility',
  login: part('/login', (root) => ({
    index: root,
  })),
  reports: part('/reports', (root) => ({
    list: root + '/list',
    form: root + '/form',
  })),
  users: part('/users', (root) => ({
    list: root + '/list',
    form: root + '/form',
  })),
};
