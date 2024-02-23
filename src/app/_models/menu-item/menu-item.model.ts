export class MenuItem {
    enum!: string;
    title!: string;
    icon!: string;
    link!: string;
    target?: string;
    default?: boolean;
}

export const MenuList: Array<MenuItem> = [
    {   
        enum: 'HOME',
        title: 'Home',
        icon: 'home',
        link: 'home',
        default: true
    },
    {   
        enum: 'TEMPLATES',
        title: 'Templates',
        icon: 'info',
        link: 'templates'
    },
    {   
        enum: 'ALL_BOARDS',
        title: 'All boards',
        icon: 'email',
        link: 'all-boards'
    },
    {   
        enum: 'SHARED_WITH_ME',
        title: 'Shared with me',
        icon: 'email',
        link: 'shared-with-me'
    },
    {
        enum: 'TRASH',
        title: 'Trash',
        icon: 'email',
        link: 'trash'
    }
]