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
window.localStorage.setItem('token_expires_in', '3153600000')
window.localStorage.setItem('token_birth_time', String(Math.floor(Date.now() / 1000)))
window.localStorage.setItem(
  'id_token',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjQxMDI0NDQ4MDAsImlhdCI6MTcwNDA2NzIwMCwicm9sZSI6ImFkbWluIn0.mock_signature'
)

const mockHandlers = {
  // --------------------------------
  '/admin/login': {
    post: () => ensureJSON('admin/login')
  },
  '/admin/check-token': {
    post: () => ensureJSON('admin/check-token')
  },
  '/admin/profile': {
    get: () => ensureJSON('admin/profile')
  },
  // --------------------------------
  '/users': {
    get: () => ensureJSON('user-list')
  },
  '/comments': {
    get: () => ensureJSON('comment-list')
  },
  '/announcements': {
    get: () => ensureJSON('announcement-list')
  },
  '/votes': {
    get: () => ensureJSON('vote-list')
  },
  '/feedback': {
    get: () => ensureJSON('feedback-list')
  },
  '/options': {
    get: () => ensureJSON('options')
  },
  '/system/statistics': {
    get: () => ensureJSON('system-statistics')
  },
  '/system/uptoken': {
    get: () => ensureJSON('system-uptoken')
  },
  // --------------------------------
  '/categories/all': {
    get: async () => ({
      status: 'success',
      message: 'Get all categories succeeded',
      result: await ensureJSON('all-categories')
    })
  },
  '/tags/all': {
    get: async () => ({
      status: 'success',
      message: 'Get all tags succeeded',
      result: await ensureJSON('all-tags')
    })
  },
  '/tags': {
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
  '/comments/calendar': {
    get: () => ({
      status: 'success',
      message: 'Get comments calendar succeeded',
      result: generateCalendar({ prob: 0.5, maxCount: 6 })
    })
  },
  '/articles/calendar': {
    get: () => ({
      status: 'success',
      message: 'Get articles calendar succeeded',
      result: generateCalendar({ prob: 0.35, maxCount: 4 })
    })
  },
  // --------------------------------
  '/articles': {
    get: () => ensureJSON('article-list')
  },
  '/articles/2': {
    get: () => ensureJSON('article-detail')
  },
  '/articles/3': {
    get: () => ensureJSON('article-detail')
  },
  '/articles/4': {
    get: () => ensureJSON('article-detail')
  },
  '/articles/5': {
    get: () => ensureJSON('article-detail')
  },
  '/articles/6': {
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
