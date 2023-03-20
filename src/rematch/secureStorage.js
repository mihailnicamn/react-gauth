import secureStorage from './secure_storage';
const keys = {
	state: {
		isLoaded: false,
	},
	reducers: {
		update : (state, payload) => {
			return {...state, ...payload}
		}
	},
	effects: {
		init(password) {
			return secureStorage.init(password)
		},
		setPassword(password) {
			return secureStorage.setPassword(password)
		},
		isInit() {
			return secureStorage.isInit()
		},
		hasPassword() {
			return secureStorage.hasPassword()
		},
		goodPassword(password) {
			if (secureStorage.goodPassword(password)) return (this.update({isLoaded: true}) && true)
			else return false
		},
		destroyPassword() {
			this.update({isLoaded: false})
			return secureStorage.destroyPassword()
		},
		addData (data) {
			return secureStorage.addData(data)
		},
		removeData (data) {
			return secureStorage.removeData(data)
		},
		updateData ({
			index, key
		}) {
			return secureStorage.updateData(index, key)
		},
		updatePassword (password) {
			return secureStorage.updatePassword(password)
		},
		getKeys () {
			return secureStorage.data()
		}
	}
}


export default keys