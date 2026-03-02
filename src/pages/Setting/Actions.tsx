import React from 'react'
import { useLoading } from 'veact-use'
import { useShallowRef } from 'veact'
import { Button, Row, Divider, Modal } from 'antd'
import * as Icons from '@ant-design/icons'
import * as systemApis from '@/apis/system'
import { getAllArticles } from '@/apis/article'
import { Article } from '@/constants/article'
import { ExportArticles } from './ExportArticles'

export const ActionsForm: React.FC = () => {
  const databaseUpdating = useLoading()

  const updateDatabaseBackup = () => {
    Modal.confirm({
      centered: true,
      title: '更新备份会导致强制覆盖旧的数据库备份，确定要继续吗？',
      onOk: () => databaseUpdating.promise(systemApis.updateDatabaseBackup())
    })
  }

  const articlesFetching = useLoading()
  const articlesData = useShallowRef<Article[]>([])
  const isOpenedExportArticlesModal = useShallowRef(false)

  const openExportArticlesModal = async () => {
    isOpenedExportArticlesModal.value = true
    articlesData.value = await articlesFetching.promise(getAllArticles({ with_detail: true }))
  }

  const closeExportArticlesModal = () => {
    isOpenedExportArticlesModal.value = false
    articlesData.value = []
  }

  return (
    <Row>
      <Button
        type="primary"
        block={true}
        loading={databaseUpdating.state.value}
        onClick={updateDatabaseBackup}
        icon={<Icons.CloudUploadOutlined />}
      >
        立即更新数据库备份
      </Button>
      <Divider />
      <Button
        block={true}
        onClick={openExportArticlesModal}
        icon={<Icons.CloudDownloadOutlined />}
      >
        导出全量文章数据
      </Button>
      <Modal
        title="导出全量文章数据"
        width="80%"
        footer={null}
        maskClosable={false}
        loading={articlesFetching.state.value}
        open={isOpenedExportArticlesModal.value}
        onCancel={closeExportArticlesModal}
      >
        <ExportArticles articles={articlesData.value} />
      </Modal>
    </Row>
  )
}
