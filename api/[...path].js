export default async function handler(req, res) {
  // 处理 CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-goog-api-key')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  try {
    // 获取完整路径
    const { path } = req.query
    const fullPath = Array.isArray(path) ? path.join('/') : path || ''
    
    // 构建目标 URL
    const targetUrl = `https://generativelanguage.googleapis.com/${fullPath}${req.url.includes('?') ? '?' + req.url.split('?')[1] : ''}`
    
    console.log('代理请求到:', targetUrl)
    
    // 准备请求头
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
    }
    
    // 复制必要的请求头
    if (req.headers['x-goog-api-key']) {
      headers['x-goog-api-key'] = req.headers['x-goog-api-key']
    }
    if (req.headers['authorization']) {
      headers['authorization'] = req.headers['authorization']
    }
    if (req.headers['content-type']) {
      headers['content-type'] = req.headers['content-type']
    }
    
    // 准备请求选项
    const fetchOptions = {
      method: req.method,
      headers: headers,
    }
    
    // 添加请求体（如果有）
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
    }
    
    // 发送请求
    const response = await fetch(targetUrl, fetchOptions)
    const data = await response.text()
    
    // 设置响应头
    const contentType = response.headers.get('content-type') || 'application/json'
    res.setHeader('Content-Type', contentType)
    
    // 返回响应
    res.status(response.status).send(data)
    
  } catch (error) {
    console.error('代理错误:', error)
    res.status(500).json({ 
      error: '代理请求失败', 
      message: error.message,
      timestamp: new Date().toISOString()
    })
  }
}
