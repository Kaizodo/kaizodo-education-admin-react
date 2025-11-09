export type Student = {
    id: string
    name: string
    email: string
    phone: string
    created_on: string
}

export function getDefaultStudent(): Student {
    return {
        id: '',
        name: '',
        email: '',
        phone: '',
        created_on: ''
    }
}
