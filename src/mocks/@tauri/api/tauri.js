import api from './backend-api-mock-functions'


export const invoke = (fn, args) => { 
    return api[fn](args)
}
