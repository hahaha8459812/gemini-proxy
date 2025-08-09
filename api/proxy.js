export default async function handler(req, res) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-goog-api-key')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  try {
    // 构建目标 URL
    const targetUrl = `https://generativelanguage.googleapis.com${req.url}`
    
    // 准备请求参数
    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://aistudio.google.com/',
        ...Object.fromEntries(
          Object.entries(req.headers).filter(([key]) => 
            key.toLowerCase().startsWith('x-goog-') || 
            key.toLowerCase() === 'authorization'
          )
        )
      }
    }
    
    // 如果有请求体，添加到选项中
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      fetchOptions.body = JSON.stringify(req.body)
    }
    
    // 发送请求
    const response = await fetch(targetUrl, fetchOptions)
    const data = await response.text()
    
    // 返回响应
    res.status(response.status)
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json')
    res.send(data)
    
  } catch (error) {
    console.error('代理错误:', error)
    res.status(500).json({ 
      error: '代理请求失败', 
      message: error.message 
    })
  }
}
