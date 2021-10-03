const home = {
    name: 'Home',
    bodyClass: 'home',
    componentPath: 'home/home',
    path: '/'
};

const scrumMaster = {
    name: 'Scrum Master',
    bodyClass: 'stream',
    componentPath: 'stream/scrumMaster',
    path: '/scrummaster'
};

const routeError = {
    name: 'Route Error',
    componentPath: 'routeError/routeError',
    bodyClass: 'route-error'
};

const pages = {
    home,
    scrumMaster,
    routeError
};

const navItems = [
    home,
    scrumMaster
];

export {
    pages,
    navItems
}