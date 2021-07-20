import dotenv from 'dotenv'

dotenv.config()

const port = process.env.APP_PORT || 3000
const host = process.env.APP_HOST || '0.0.0.0'
const name = process.env.APP_NAME || 'websockets-service'
const dashboard = process.env.DASHBOARD_URI || 'www.example.com'
const jwtsecret =
  process.env.JWT_SECRET ||
  'mK&nWKX*Zy8=PePf2AC8jA5Y9HYf2xgJj!@kLac8mdVru!V3GJAK9tMa!8e!NPHwpWzzr6y^Pzqv&R$37kuVh^Mc@JudrwW&-QT@=GSvfwQEArRfN&%hm+-5RHsx2^csar!%UwWBNygXezrWn8CbY4XNvX9!D6e6_W&CeBWF@==TPT_MsP#AsQb!KqG8tkbNFVVS!f_MG@mM4CRB3w+*ebnu&Rzf7z!bttCD=V7uMQ5$T6EJrPUV&HQW?rSP5HH$'


const mobileService = process.env.MOBILEAPIGTW_URI || 'http.0.1:8081'


const app = {
  host,
  name,
  port,
  dashboard,
  jwtsecret,
  services: {
    mobile: mobileService,
  }
}
// tslint:disable-next-line: no-console
console.log(app)

export { app }
