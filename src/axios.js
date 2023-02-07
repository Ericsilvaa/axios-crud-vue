import axios from 'axios'
import { reject, resolve } from 'core-js/fn/promise'
import config from './config/config'


const instance = axios.create({})

instance.defaults.baseURL = config.apiURL



instance.interceptors.request.use(config => {
    console.log('interceptando requisicao: ', config)
    config.data = {
      ...config,
      curso: 'VueJS'
    }

    // cabecalho axios globais
    // config.headers.common['authorization'] = `Bearer ${window.localStorage.getItem('token')}`
    config.headers.common['authorization'] = `Bearer token_jwt`

    config.headers.put['Meu-cabecalho']  = 'CRuso VueJS' 

    return config
//     return new Promise((resolve,reject) => {
//       console.log('Fazendo requisicao aguardar...')
//       setTimeout(() => {
//         console.log('Enviando Requisição')
//         resolve(config)
//       }, 2000)
//     })
// }, error => {
//   return Promise.reject(error)
 })



//requisicao foi feita para server
//server enviou alguma resposta
//caso queira modificar antes de devolver p aplicacao
instance.interceptors.response.use(r => {
  if(Array.isArray(r.data)) {
    r.data = r.data.slice(1,3)
  }
  return r
}, error => {
  console.log(error)
  return Promise.reject(error)
})

export default instance