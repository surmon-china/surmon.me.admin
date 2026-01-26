/**
 * @file Article list page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { Link } from 'react-router'
import { useShallowReactive, useRef, useWatch, onMounted } from 'veact'
import { useLoading } from 'veact-use'
import { Button, Card, Divider, Modal } from 'antd'
import * as Icons from '@ant-design/icons'
import { useTranslation } from '@/i18n'
import { scrollTo } from '@/utils/scroller'
import { RoutesKey, RoutesPath } from '@/routes'
import { DropdownMenu } from '@/components/common/DropdownMenu'
import { ResponsePaginationData } from '@/constants/nodepress'
import { ArticleId, Article, ArticleStatus, getArticleStatus } from '@/constants/article'
import { getArticles, GetArticleParams, patchArticlesStatus } from '@/apis/article'
import { ListFilters, DEFAULT_FILTER_PARAMS, FilterParams, getQueryParams } from './ListFilters'
import { TableList } from './TableList'

export const ArticleListPage: React.FC = () => {
  const { i18n } = useTranslation()
  const fetching = useLoading()
  const articles = useShallowReactive<ResponsePaginationData<Article>>({
    data: [],
    pagination: void 0
  })

  // select
  const selectedIds = useRef<string[]>([])

  // filters
  const searchKeyword = useRef('')
  const filterParams = useRef<FilterParams>({ ...DEFAULT_FILTER_PARAMS })

  const resetFiltersToTarget = (target: Partial<FilterParams> = {}) => {
    searchKeyword.value = ''
    filterParams.value = {
      ...DEFAULT_FILTER_PARAMS,
      ...target
    }
  }

  const fetchList = (params?: GetArticleParams) => {
    const getParams: any = {
      ...params,
      ...getQueryParams(filterParams.value),
      keyword: searchKeyword.value || void 0
    }

    fetching.promise(getArticles(getParams)).then((result) => {
      articles.data = result.data
      articles.pagination = result.pagination
      scrollTo(document.body)
    })
  }

  const refreshList = () => {
    fetchList({
      page: articles.pagination?.current_page,
      per_page: articles.pagination?.per_page
    })
  }

  const updateArticleState = (_article: Article, state: ArticleStatus) => {
    const targetState = getArticleStatus(state).name
    Modal.confirm({
      title: `确定要将此文章更新为「${targetState}」状态吗？`,
      content: `《${_article.title}》`,
      centered: true,
      onOk: () => {
        return patchArticlesStatus([_article._id!], state).then(() => {
          refreshList()
        })
      }
    })
  }

  const updateArticlesState = (articleIds: ArticleId[], state: ArticleStatus) => {
    const targetState = getArticleStatus(state).name
    Modal.confirm({
      title: `确定要将 ${articleIds.length} 个文章更新为「${targetState}」状态吗？`,
      content: '请确认操作',
      centered: true,
      onOk: () => {
        return patchArticlesStatus(articleIds, state).then(() => {
          refreshList()
        })
      }
    })
  }

  useWatch(
    () => filterParams.value,
    () => fetchList(),
    { deep: true }
  )

  onMounted(() => {
    fetchList()
  })

  return (
    <Card
      variant="borderless"
      title={i18n.t('page.article.list.title', { total: articles.pagination?.total ?? '-' })}
      extra={
        <Link to={RoutesPath[RoutesKey.ArticlePost]}>
          <Button type="primary" size="small" icon={<Icons.EditOutlined />}>
            {i18n.t('page.article.create')}
          </Button>
        </Link>
      }
    >
      <ListFilters
        loading={fetching.state.value}
        keyword={searchKeyword.value}
        onKeywordChange={(value) => (searchKeyword.value = value)}
        onKeywordSearch={() => fetchList()}
        params={filterParams.value}
        onParamsChange={(value) => Object.assign(filterParams.value, value)}
        onResetRefresh={() => resetFiltersToTarget({})}
        extra={
          <DropdownMenu
            text="批量操作"
            disabled={!selectedIds.value.length}
            options={[
              {
                label: '退为草稿',
                icon: <Icons.RollbackOutlined />,
                onClick: () => updateArticlesState(selectedIds.value, ArticleStatus.Draft)
              },
              {
                label: '直接发布',
                icon: <Icons.CheckOutlined />,
                onClick: () => updateArticlesState(selectedIds.value, ArticleStatus.Published)
              },
              {
                label: '移回收站',
                icon: <Icons.DeleteOutlined />,
                onClick: () => updateArticlesState(selectedIds.value, ArticleStatus.Trash)
              }
            ]}
          />
        }
      />
      <Divider />
      <TableList
        loading={fetching.state.value}
        data={articles.data}
        pagination={articles.pagination!}
        selectedIds={selectedIds.value}
        onSelect={(ids) => (selectedIds.value = ids)}
        onPaginate={(page, pageSize) => fetchList({ page, per_page: pageSize })}
        onUpdateState={(article, state) => updateArticleState(article, state)}
        onClickCategory={({ slug }) => resetFiltersToTarget({ category_slug: slug })}
        onClickTag={({ slug }) => resetFiltersToTarget({ tag_slug: slug })}
      />
    </Card>
  )
}
