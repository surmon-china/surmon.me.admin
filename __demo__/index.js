// JSON actions
const fetchJSON = (filePath) => {
  const base = (window.DEMO_BASE_URL || '').replace(/\/+$/, '')
  const url = `${base}/__demo__/mock/${filePath}.json`
  return fetch(url).then((response) => response.json())
}

// first fetch cache data map
const _cacheData = new Map()
const ensureJSON = async (filePath) => {
  if (_cacheData.has(filePath)) {
    return _cacheData.get(filePath)
  } else {
    const data = await fetchJSON(filePath)
    _cacheData.set(filePath, data)
    return data
  }
}

// Generate [{ date: "YYYY-MM-DD", count: n }, ...] from 2018-01-01 to today.
function generateCalendar({ start = '2018-01-01', prob = 0.08, maxCount = 4 } = {}) {
  const [sy, sm, sd] = start.split('-').map(Number)
  const d = new Date(sy, sm - 1, sd)
  const end = new Date()
  end.setHours(0, 0, 0, 0)

  const pad2 = (n) => String(n).padStart(2, '0')
  const fmt = (x) => `${x.getFullYear()}-${pad2(x.getMonth() + 1)}-${pad2(x.getDate())}`

  const result = []
  while (d <= end) {
    if (Math.random() < prob) {
      const count = 1 + Math.floor(Math.random() * maxCount) // 1..maxCount
      result.push({ date: fmt(d), count })
    }
    d.setDate(d.getDate() + 1)
  }
  return result
}

// Set a mock token immediately on page load so the dashboard page can be accessed directly.
console.info('mock token')
window.localStorage.setItem('id_token', 'veact_admin.mock.token')

const mockHandlers = {
  // --------------------------------
  '/admin/login': {
    post: () => ensureJSON('admin/login')
  },
  '/admin/check-token': {
    get: () => ensureJSON('admin/check-token')
  },
  '/admin/profile': {
    get: () => ensureJSON('admin/profile')
  },
  // --------------------------------
  '/comment': {
    get: () => ensureJSON('comment-list')
  },
  '/announcement': {
    get: () => ensureJSON('announcement-list')
  },
  '/vote': {
    get: () => ensureJSON('vote-list')
  },
  '/feedback': {
    get: () => ensureJSON('feedback-list')
  },
  '/disqus/config': {
    get: () => ensureJSON('disqus-config')
  },
  '/option': {
    get: () => ensureJSON('option')
  },
  '/extension/statistic': {
    get: () => ensureJSON('extension-statistic')
  },
  '/extension/uptoken': {
    get: () => ensureJSON('extension-uptoken')
  },
  // --------------------------------
  '/category/all': {
    get: async () => ({
      status: 'success',
      message: 'Get all categories succeeded',
      result: await ensureJSON('all-categories')
    })
  },
  '/tag/all': {
    get: async () => ({
      status: 'success',
      message: 'Get all tags succeeded',
      result: await ensureJSON('all-tags')
    })
  },
  '/tag': {
    get: async () => {
      const allTags = await ensureJSON('all-tags')
      return {
        status: 'success',
        message: 'Get tags succeeded',
        result: {
          data: allTags,
          pagination: {
            total: allTags.length,
            current_page: 1,
            total_page: 1,
            per_page: 16
          }
        }
      }
    }
  },
  // --------------------------------
  '/comment/calendar': {
    get: () => ({
      status: 'success',
      message: 'Get comment calendar succeeded',
      result: generateCalendar({ prob: 0.5, maxCount: 6 })
    })
  },
  '/article/calendar': {
    get: () => ({
      status: 'success',
      message: 'Get article calendar succeeded',
      result: generateCalendar({ prob: 0.35, maxCount: 4 })
    })
  },
  // --------------------------------
  '/article': {
    get: () => ensureJSON('article-list')
  },
  '/article/676fa1321a53290533a7f206': {
    get: () => ensureJSON('article-detail')
  },
  '/article/6667b9438a907384c63ff205': {
    get: () => ensureJSON('article-detail')
  },
  '/article/65bd8c1f1a53290533a7f204': {
    get: () => ensureJSON('article-detail')
  },
  '/article/6558e1d11a53290533a7f203': {
    get: () => ensureJSON('article-detail')
  },
  '/article/656f2f5fcf1faa098ee1f202': {
    get: () => ensureJSON('article-detail')
  }
}

// Axios adapter mock for DEMO site.
// - If a request matches a registered mock handler, resolve with a 200 JSON response.
// - Otherwise, reject with an Axios-like error to indicate the demo site does not support this API.
console.info('mock axios')
window.__axiosAdapter = (config) => {
  console.debug('mock request:', config)
  return new Promise(async (resolve, reject) => {
    const handler = mockHandlers?.[config.url]?.[config.method]
    if (handler) {
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
      const [data] = await Promise.all([handler(), delay(268)])
      return resolve({
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        data
      })
    }

    // create a AxiosError
    const axiosLikeError = new Error('API request error')
    axiosLikeError.isAxiosError = true
    axiosLikeError.config = config
    axiosLikeError.name = 'AxiosError'
    axiosLikeError.code = 'ERR_DEMO_UNSUPPORTED'
    axiosLikeError.response = {
      status: 400,
      statusText: 'ERROR',
      headers: { 'content-type': 'application/json' },
      data: {
        status: 'error',
        message: 'Request rejected by demo mock',
        error: 'Not supported in demo',
        result: null
      }
    }

    return reject(axiosLikeError)
  })
}
