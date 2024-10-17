function path(root: string, sublink: string) {
    return `${root}${sublink}`
}

const ROOTS_DASHBOARD = '/dashboard'
const ROOTS_ASKARIS_REVENUE = '/askaris'
const ROOTS_MANAGE_OWNERS = '/askaris/owners'
const ROOTS_MANAGE_TENANTS = '/askaris/tenants'
const ROOTS_MANAGE_ZONES = '/areas/zones'
const ROOTS_MANAGE_LOCATIONS = '/areas/locations'
const ROOTS_MANAGE_STREETS = '/areas/streets'
const ROOTS_PAGES = '/pages'
const ROOTS_INVOICES = '/invoices'
const ROOTS_AUTH = '/auth'
const ROOTS_ERRORS = ''

export const PATH_DASHBOARD = {
    root: ROOTS_DASHBOARD,
    default: path(ROOTS_DASHBOARD, '/default'),
    analytics: path(ROOTS_DASHBOARD, '/askaris'),
    saas: path(ROOTS_DASHBOARD, '/admin'),
}

export const PATH_ASKARIS_REVENUE = {
    root: ROOTS_ASKARIS_REVENUE,
    businesses: path(ROOTS_ASKARIS_REVENUE, '/businesses'),
    parking: path(ROOTS_ASKARIS_REVENUE, '/revenue/parking'),
    landrates: path(ROOTS_ASKARIS_REVENUE, '/revenue/landrates'),
    rentals: path(ROOTS_ASKARIS_REVENUE, '/revenue/rentals'),
    add: path(ROOTS_ASKARIS_REVENUE, '/revenue/addother'),
}

export const PATH_MANAGE_OWNERS = {
    root: ROOTS_MANAGE_OWNERS,
    all: path(ROOTS_MANAGE_OWNERS, '/'),
}

export const PATH_MANAGE_TENANTS = {
    root: ROOTS_MANAGE_TENANTS,
    all: path(ROOTS_MANAGE_TENANTS, '/'),
}

export const PATH_MANAGE_ZONES = {
    root: ROOTS_MANAGE_ZONES,
    all: path(ROOTS_MANAGE_ZONES, '/'),
}


export const PATH_MANAGE_LOCATIONS = {
    root: ROOTS_MANAGE_LOCATIONS,
    all: path(ROOTS_MANAGE_LOCATIONS, '/'),
}

export const PATH_MANAGE_STREETS = {
    root: ROOTS_MANAGE_STREETS,
    all: path(ROOTS_MANAGE_STREETS, '/'),
}


export const PATH_PAGES = {
    root: ROOTS_PAGES,
    profile: path(ROOTS_PAGES, '/profile'),
    settings: path(ROOTS_PAGES, '/settings'),
}


export const PATH_INVOICES = {
    root: ROOTS_INVOICES,
    invoices: {
        all: path(ROOTS_INVOICES, '/list'),
        sample: path(ROOTS_INVOICES, `/details/`),
        invoice_details: (id: string): string => path(ROOTS_INVOICES, `/details/${id}`),
    }
}


export const PATH_AUTH = {
    root: ROOTS_AUTH,
    signin: path(ROOTS_AUTH, '/signin'),
    signup: path(ROOTS_AUTH, '/signup'),
    passwordReset: path(ROOTS_AUTH, '/password-reset'),
}

export const PATH_ERROR = {
    root: ROOTS_ERRORS,
    error403: path(ROOTS_ERRORS, '/403'),
    error404: path(ROOTS_ERRORS, '/404'),
    error500: path(ROOTS_ERRORS, '/500'),
}

export const PATH_START = {
    root: '',
}

export const PATH_DOCS = {
    root: '',
}

export const PATH_CHANGELOG = {
    root: '',
}

export const PATH_GITHUB = {
    org: "",
}
