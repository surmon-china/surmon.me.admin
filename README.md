# surmon.me.admin

[![nodepress](https://raw.githubusercontent.com/surmon-china/nodepress/main/branding/badge.svg)](https://github.com/surmon-china/nodepress)
&nbsp;
[![veact](https://img.shields.io/badge/WITH-VEACT-42a97a?style=for-the-badge&labelColor=35495d)](https://github.com/veactjs/veact)
&nbsp;
[![GitHub stars](https://img.shields.io/github/stars/surmon-china/surmon.me.admin.svg?style=for-the-badge)](https://github.com/surmon-china/surmon.me.admin/stargazers)
&nbsp;
[![GitHub issues](https://img.shields.io/github/issues/surmon-china/surmon.me.admin.svg?style=for-the-badge)](https://github.com/surmon-china/surmon.me.admin/issues)
&nbsp;
[![GitHub license](https://img.shields.io/github/license/surmon-china/surmon.me.admin.svg?style=for-the-badge)](/LICENSE)

**Admin panel for [surmon.me](https://github.com/surmon-china/surmon.me), built with [React](https://github.com/facebook/react) and [Veact](https://github.com/veactjs/veact).**

**适用于 [surmon.me](https://github.com/surmon-china/surmon.me) 的博客后台管理系统，使用 [React](https://github.com/facebook/react) 和 [Veact](https://github.com/veactjs/veact) 进行开发。**

**在线预览：[Online Demo](https://github.surmon.me/surmon.me.admin)**

**Related projects:**

- **[NodePress](https://github.com/surmon-china/nodepress)** - RESTful API service (CMS core).
- **[surmon.me](https://github.com/surmon-china/surmon.me)** - SSR blog website.
- **[surmon.me.ai](https://github.com/surmon-china/surmon.me.ai)** - Blog AI agent.
- **[surmon.me.native](https://github.com/surmon-china/surmon.me.native)** - Blog native app.

## Screenshot

[![](/screenshots/dashboard.png)](https://raw.githubusercontent.com/surmon-china/surmon.me.admin/refs/heads/main/screenshots/dashboard.png)

## Development setup

```bash
# install dependencies
pnpm i

# serve with hot reload at localhost:4200
pnpm run dev

# lint
pnpm run lint

# build
pnpm run build

# local preview
pnpm run serve
```

## Actions setup

**Rule:**

- Any PR opend → [`CI:Build test`](.github/workflows/test.yml)
- New tag `v*` → [`CI:Create Release`](.github/workflows/create-release.yml)
- New release created → [`CI:Release demo branch`](/.github/workflows/release-demo-branch.yml) → [GitHub Pages](http://docs.github.com/en/pages)
- New release created → [`CI:Release prod branch`](/.github/workflows/release-prod-branch.yml) → [Cloudflare Pages](https://developers.cloudflare.com/pages/)
