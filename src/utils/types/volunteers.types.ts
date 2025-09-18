export interface TGetAllVolunteers {
    _id: string
    name: string
    address: Address
    bloodGroup: string
    birthdate: string
    occupation: string
    skills: string[]
    phoneNo: string
    image: Image
    isActive: boolean
}

export interface TCreateVolunteerPayload {
    image?: string
    name: string
    address: Address
    phoneNo: string
    bloodGroup: string
    birthdate: Date | undefined
    occupation: string
    skills: string[]
}

export interface Address {
    city: string
    state: string
    postalCode: string
}

export interface Image {
    _id: string
    url: string
}
