// API工具函数，处理认证请求

export const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`/api${url}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// 快捷方法
export const get = (url, options = {}) => apiRequest(url, { ...options, method: 'GET' });
export const post = (url, data, options = {}) => apiRequest(url, { ...options, method: 'POST', body: JSON.stringify(data) });
export const put = (url, data, options = {}) => apiRequest(url, { ...options, method: 'PUT', body: JSON.stringify(data) });
export const del = (url, options = {}) => apiRequest(url, { ...options, method: 'DELETE' });
