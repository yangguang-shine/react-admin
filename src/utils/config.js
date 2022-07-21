export let baseServerUrl = 'http://dev.jr.jd.com:9999/api'

if (process.env.NODE_ENV === 'development') {
    console.log('开发环境')
    baseServerUrl = 'http://dev.jr.jd.com:7777/api'
} else {
    console.log('线上环境')
}