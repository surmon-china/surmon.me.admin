/**
 * @file Article editor form
 * @author Surmon <https://github.com/surmon-china>
 */

import React, { useEffect } from 'react'
import { onMounted } from 'veact'
import { Card, Row, Col, Form, message, Spin, Button } from 'antd'
import * as Icons from '@ant-design/icons'
import { APP_LAYOUT_GUTTER_SIZE } from '@/config'
import { ImageUploader } from '@/components/common/ImageUploader'
import { FormKeyValueInput } from '@/components/common/FormKeyValueInput'
import { openJSONEditor } from '@/components/common/ModalJsonEditor'
import { ArticleOrigin, ArticleStatus } from '@/constants/article'
import { Article, ArticleLanguage } from '@/constants/article'
import { useLocale } from '@/contexts/Locale'
import { useTheme } from '@/contexts/Theme'
import { useTranslation } from '@/i18n'
import { scrollTo } from '@/utils/scroller'
import { MainForm, MainFormExtraItem } from './MainForm'
import { CategoriesForm } from './CategoriesForm'
import { StatesForm } from './StatesForm'

export type MainFormModel = Partial<
  Pick<Article, 'slug' | 'tags' | 'title' | 'content' | 'keywords' | 'summary'>
>
export type CategoriesFormModel = Pick<Article, 'categories'>
export type ThumbnailFormModel = Pick<Article, 'thumbnail'>
export type ExtrasFormModel = Pick<Article, 'extras'>
export type StatesFormModel = Pick<Article, 'status' | 'origin'>

export type ArticleWithoutId = Omit<Article, 'id' | '_id'>

const DEFAULT_ARTICLE: ArticleWithoutId = Object.freeze({
  slug: null,
  title: '',
  summary: '',
  keywords: [],
  content: '',
  thumbnail: '',
  status: ArticleStatus.Published,
  origin: ArticleOrigin.Original,
  lang: ArticleLanguage.Chinese,
  featured: false,
  disabled_comments: false,
  tags: [],
  categories: [],
  extras: []
})

export interface ArticleEditorProps {
  loading: boolean
  submitting: boolean
  article: Article | null
  editorCacheId?: string
  mainCardExtra?: React.ReactNode
  mainFormExtraItems?: MainFormExtraItem[]
  onSubmit(article: Article): void
  onDelete?(): void
}

export const ArticleEditor: React.FC<ArticleEditorProps> = (props) => {
  const { i18n } = useTranslation()
  const { language } = useLocale()
  const { theme } = useTheme()
  const [mainForm] = Form.useForm<MainFormModel>()
  const [categoriesFormModel] = Form.useForm<CategoriesFormModel>()
  const [thumbnailFormModel] = Form.useForm<ThumbnailFormModel>()
  const [extrasFormModel] = Form.useForm<ExtrasFormModel>()
  const [statesFormModel] = Form.useForm<StatesFormModel>()

  const setFormsValue = (formValue: ArticleWithoutId) => {
    mainForm.setFieldsValue(formValue)
    categoriesFormModel.setFieldsValue(formValue)
    thumbnailFormModel.setFieldsValue(formValue)
    extrasFormModel.setFieldsValue(formValue)
    statesFormModel.setFieldsValue(formValue)
  }

  const handleSubmit = async () => {
    try {
      const data = {
        ...props.article,
        ...(await mainForm.validateFields()),
        ...(await categoriesFormModel.validateFields()),
        ...(await thumbnailFormModel.validateFields()),
        ...(await extrasFormModel.validateFields()),
        ...(await statesFormModel.validateFields())
      }
      data.slug = data.slug || null
      props.onSubmit?.(data as Article)
    } catch (error) {
      console.debug('Article 提交错误：', error)
      message.error('请检查表单中的不合法项')
    }
  }

  const handleEditExtrasAsJSON = () => {
    openJSONEditor({
      title: '以 JSON 编辑自定义扩展',
      initialTheme: theme,
      initLanguage: language,
      initialValue: extrasFormModel.getFieldsValue(),
      callback: (newValue) => extrasFormModel.setFieldsValue(newValue)
    })
  }

  // set article to form when article loaded
  useEffect(() => {
    if (props.article) {
      setFormsValue(props.article)
    }
  }, [props.article])

  // init default form when mounted
  onMounted(() => {
    setFormsValue(DEFAULT_ARTICLE)
    scrollTo(document.body)
  })

  return (
    <Row gutter={[APP_LAYOUT_GUTTER_SIZE, APP_LAYOUT_GUTTER_SIZE]}>
      <Col xs={24} lg={17}>
        <Card
          variant="borderless"
          title={i18n.t('page.article.editor.content')}
          extra={props.mainCardExtra}
        >
          <Spin spinning={props.loading}>
            <MainForm
              form={mainForm}
              extraItems={props.mainFormExtraItems}
              editorCacheId={props.editorCacheId}
            />
          </Spin>
        </Card>
      </Col>
      <Col xs={24} lg={7}>
        <Row gutter={[APP_LAYOUT_GUTTER_SIZE, APP_LAYOUT_GUTTER_SIZE]}>
          <Col span={24}>
            <Card title={i18n.t('page.article.editor.categories')} variant="borderless">
              <Spin spinning={props.loading}>
                <CategoriesForm form={categoriesFormModel} />
              </Spin>
            </Card>
          </Col>
          <Col span={24}>
            <Card title={i18n.t('page.article.editor.thumbnail')} variant="borderless">
              <Spin spinning={props.loading}>
                <Form scrollToFirstError={true} form={thumbnailFormModel}>
                  <Form.Item noStyle={true} name="thumbnail">
                    <ImageUploader directory="thumbnail" />
                  </Form.Item>
                </Form>
              </Spin>
            </Card>
          </Col>
          <Col span={24}>
            <Card
              title={i18n.t('page.article.editor.extras')}
              variant="borderless"
              extra={
                <Button
                  type="link"
                  size="small"
                  icon={<Icons.EditOutlined />}
                  disabled={props.loading}
                  onClick={handleEditExtrasAsJSON}
                >
                  以 JSON 编辑
                </Button>
              }
            >
              <Spin spinning={props.loading}>
                <Form scrollToFirstError={true} form={extrasFormModel}>
                  <Form.Item noStyle={true} shouldUpdate={true}>
                    <FormKeyValueInput formFieldName="extras" />
                  </Form.Item>
                </Form>
              </Spin>
            </Card>
          </Col>
          <Col span={24}>
            <Card title={i18n.t('page.article.editor.states')} variant="borderless">
              <Spin spinning={props.loading}>
                <StatesForm
                  form={statesFormModel}
                  submitting={props.submitting}
                  showDeleteButton={!!props.article}
                  onSubmit={handleSubmit}
                  onDelete={props.onDelete}
                />
              </Spin>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
