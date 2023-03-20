import otp from './hotp'
import secure_storage from './secure_storage'
const keys = {
	state: [],
	reducers: {
		add: (state, payload) => {
			state.push(payload)
		},
		load: (state, payload) => {
			state = [...state, ...payload]
			return state
		},
		parse: (state, payload) => {
			return payload
		},
	},
	effects: {
		async addAsync(payload) {
			await new Promise(resolve => setTimeout(resolve, 1000))
			this.add(payload)
		},
		async list() {
			await new Promise(resolve => setTimeout(resolve, 1000))
			this.load([])
		},
		async reload() {
			const getCode = async (key) => {
				return {
					name : key.name,
					code: await otp.totp(key.secret)
				}
			}
			return this.parse(await Promise.all(secure_storage.data().map(getCode)))
		}
	}
}


export default keys