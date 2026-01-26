# Changelog

All notable changes to this project will be documented in this file.

### 3.11.0 (2026-01-26)

- Update all APIs and data structures to match NodePress v6 changes.

### 3.10.0 (2026-01-10)

- Added all article export feature to the Setting page.
- Renamed Setting page `option` field `ad_config` to `app_config`.

### 3.9.0 (2025-12-31)

- Rename project name to `surmon.me.admin`.

### 3.8.0 (2025-12-30)

- Upgraded react to v19.
- Upgraded antd to v6.
- Upgraded echarts to v6.

### 3.4.0 (2025-06-16)

- Upgrade all dependencies to their latest versions.

### 3.0.0 (2024-05-16)

- Added i18n support.
- Added theme switching.
- Upgraded antd to v5.
- Removed unnecessary transition components.
- Refactored `/dashboard` page.
- Refactored the structure of the App component.
- Refactored the layout design of the `/setting` page.
- Refactored global style variables (utilizing CSS3 variables).
- Refactored global state management (utilizing `React.Context` for state management).
- Refactored routing configuration (using unified configuration of `react-router` v6).
- Refactored UniversalEditor (migrated from Monaco to CodeMirror).
  - Monaco resulted in excessive build size (3.8mb).
  - [Monaco only supports a single global theme](https://github.com/Microsoft/monaco-editor/issues/338).
  - [`codesandbox` migrated the editor to CodeMirror](https://github.com/codesandbox/sandpack/issues/305).
  - [Comparison between Monaco and CodeMirror editors](https://blog.replit.com/code-editors).

### 2.6.0 (2023-10-09)

- Add `featured` field in article

### 2.4.0 (2023-09-06)

- Add comment calendar in Dashboard
- Add article new language type `mix`

### 2.2.0 (2023-07-22)

- Remove Google Analytics Card, becauese ['The new GA4 properties can only be used from the Analytics Data API'](https://stackoverflow.com/questions/64571852/does-the-google-analytics-embed-api-support-the-new-ga4-properties)

### 2.1.2 (2023-07-17)

- Rename field `tag.articles_count` to `tag.article_count`
- Rename field `category.articles_count` to `category.article_count`

### 2.1.0 (2023-07-12)

- Improve UX experience
- Rename field `article.thumb` to `article.thumbnail`
- Rename field `article.tag` to `article.tags`
- Rename field `article.category` to `article.categories`
- Rename field `article.disabled_comment` to `article.disabled_comments`

### 2.0.0 (2023-07-10)

**Feature**

- Update various dependencies
- Use `pnpm` instead of `yarn` as a package management tool
- Rename field `create_at` to `created_at` and `update_at` to `updated_at`
- Refactor `UniversalEditor` component

### 1.9.0 (2022-12-22)

**Feature**

- Update various dependencies

### v1.8.2 (2022-09-23)

- Improve sider menu icons
- Improve vote page input and render logic
- Remove vote `site` target type

### v1.8.0 (2022-09-23)

- Add vote list page
- Improve comment page icons
- Improve feedback page names

### v1.7.0 (2022-09-15)

- Add date picker to dashboard analytics

### v1.6.0 (2022-08-08)

- Upgrade deps
- Upgrade Vite to v3
- Upgrade Antd to v4.22
- Fix article page table.state key error
- Fix article page EditModal.Form warn

### v1.5.0 (2022-05-15)

- Remove `ali-oss` & upload to NodePress
- Improve `lazy(UniversalEditor)`

### v1.4.0 (2022-03-01)

- Add feedback module
- New components `Placeholder` `UniversalText` `IPLocation` `SortSelect`
- Improve antd icons
- Rename `Extend` to `KeyValue`

### v1.3.5 (2022-02-16)

- Add articles calendar in Dashboard

### v1.3.2 (2022-01-01)

- Add Comment `reviseCommentIPLocation`

### v1.3.0 (2021-12-26)

- Add `slug` field for Article
- Add Disqus pages

### v1.2.9 (2021-12-21)

- Fix `antd` bundle error
- Improve bundle chunk

### v1.2.5 (2021-12-20)

- Improve Sider slogan text style
- Upgrade Actions CI config

### v1.2.4 (2021-12-10)

- Improve footer link

### v1.2.3 (2021-12-10)

- Add `MultipleImageUploader` component
- Rename `transformers` to `transforms`

### v1.2.2 (2021-12-07)

- Fix `per_page` value to `50`

### v1.2.1 (2021-12-07)

- Improve Table page size

### v1.2.0 (2021-12-06)

- Updrade deps
- Upgrade `react-router` to v6
- Update `profile.archive` biz

### v1.1.4 (2021-09-06)

- Fix Demo site bugs
- Improve resource url

### v1.1.0 (2021-09-01)

- Upgrade deps
- Demo site: Axios `interceptor` > `adapter`
- Add AD for demo site

### v1.0.6 (2021-08-03)

- Add demo site (CI & ENV config & AD)

### v1.0.5 (2021-08-03)

- improve `ImageUploaderModal`
- improve Markdown preview style

### v1.0.4 (2021-07-30)

- fix `ali-oss` error
- `esc` event (exit fullscreen) for universal editor
- `upload image` for universal editor
- markdown coper for image uploader

### v1.0.3 (2021-07-27)

- replace `service/loading` to [`veact-use`](https://github.com/veactjs/veact-use).

### v1.0.0

- Migration from angular-admin.
- By Veact and AntDesign.
