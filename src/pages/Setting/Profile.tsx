import React from 'react'
import { onMounted } from 'veact'
import { useLoading } from 'veact-use'
import { useNavigate } from 'react-router'
import { Form, Input, Button, Spin, Divider, notification } from 'antd'
import * as Icons from '@ant-design/icons'
import * as api from '@/apis/admin'
import { RoutesKey, getRoutePath } from '@/routes'
import { useAdminProfile } from '@/contexts/AdminProfile'
import { ImageUploader } from '@/components/common/ImageUploader'
import { AdminProfile } from '@/constants/admin'
import { scrollToTop } from '@/utils/scroll'
import tokenService from '@/services/token'

export const ProfileForm: React.FC = () => {
  const navigate = useNavigate()
  const fetching = useLoading()
  const updating = useLoading()
  const globalAdminProfile = useAdminProfile()
  const [form] = Form.useForm<AdminProfile>()

  const fetchProfile = () => {
    return fetching.promise(api.getAdminProfile()).then(form.setFieldsValue)
  }

  const updateProfile = async (adminProfile: AdminProfile) => {
    const result = await updating.promise(api.updateAdminProfile(adminProfile))
    if (adminProfile.new_password) {
      notification.info({ title: '修改了新密码，即将退出登录...' })
      setTimeout(() => {
        api.authLogout(tokenService.getRefreshToken()!).finally(() => {
          tokenService.removeToken()
          navigate(getRoutePath(RoutesKey.Hello))
        })
      }, 1688)
    } else {
      form.setFieldsValue(result)
      globalAdminProfile.refresh()
    }
  }

  const handleFormSubmit = () => {
    form.validateFields().then((newAdminAuth) => {
      Reflect.deleteProperty(newAdminAuth, 'rel_new_password')
      updateProfile({ ...newAdminAuth }).then(() => {
        scrollToTop()
      })
    })
  }

  const validatePassword = async () => {
    const password = form.getFieldValue('password')
    const newPassword = form.getFieldValue('new_password')
    // @ts-ignore
    const reallyNewPassword = form.getFieldValue('rel_new_password')
    if (!password && !newPassword && !reallyNewPassword) {
      return
    }
    if (newPassword !== reallyNewPassword || password === newPassword) {
      throw new Error()
    }
  }

  onMounted(() => fetchProfile())

  return (
    <Spin spinning={fetching.state.value || updating.state.value}>
      <Form layout="vertical" form={form} colon={false} scrollToFirstError={true}>
        <Form.Item
          name="avatar_url"
          label="头像"
          required={true}
          rules={[{ required: true, message: '请上传图片' }]}
        >
          <ImageUploader disabledMarkdown={true} />
        </Form.Item>
        <Form.Item
          name="name"
          label="名称"
          required={true}
          rules={[{ required: true, message: '请输入名称' }]}
        >
          <Input placeholder="名称" />
        </Form.Item>
        <Form.Item
          name="slogan"
          label="签名"
          required={true}
          rules={[{ required: true, message: '请输入签名' }]}
        >
          <Input.TextArea placeholder="签名" />
        </Form.Item>
        <Divider />
        <Form.Item
          name="password"
          label="旧密码"
          rules={[
            {
              message: '确保新旧密码不一致，且有效',
              validator: validatePassword
            }
          ]}
        >
          <Input.Password placeholder="旧密码" autoComplete="password" />
        </Form.Item>
        <Form.Item
          name="new_password"
          label="新密码"
          rules={[
            {
              message: '确保新旧密码不一致，且有效',
              validator: validatePassword
            }
          ]}
        >
          <Input.Password placeholder="新密码" autoComplete="new_password" />
        </Form.Item>
        <Form.Item
          name="rel_new_password"
          label="确认新密码"
          rules={[
            {
              message: '确保新旧密码不一致，且有效',
              validator: validatePassword
            }
          ]}
        >
          <Input.Password placeholder="确认新密码" autoComplete="rel_new_password" />
        </Form.Item>
        <Button
          type="primary"
          block={true}
          icon={<Icons.CheckOutlined />}
          loading={updating.state.value}
          onClick={handleFormSubmit}
        >
          保存
        </Button>
      </Form>
    </Spin>
  )
}
