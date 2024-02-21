export class MenuItem {
  title!: string;
  icon!: string;
  link!: string;
  target?: string;
  default?: boolean;
}

export const MenuList: Array<MenuItem> = [
    {
        title: 'Home',
        icon: 'home',
        link: '/',
        default: true
    },
    {
        title: 'Templates',
        icon: 'info',
        link: '/templates'
    },
    {
        title: 'All boards',
        icon: 'email',
        link: '/all-boards'
    },
    {
        title: 'Shared with me',
        icon: 'email',
        link: '/shared-with-me'
    },
    {
        title: 'Trash',
        icon: 'email',
        link: '/trash'
    }
]