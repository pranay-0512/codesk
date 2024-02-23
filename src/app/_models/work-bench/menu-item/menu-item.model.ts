export class MenuItem {
    enum!: string;
    title!: string;
    icon!: string;
    link!: string;
    target?: string;
    onClick?: () => void;
}

export const MenuList: Array<MenuItem> = [
    {   
        enum: 'OPEN',
        title: 'Open',
        icon: 'open',
        link: 'open',
    },
    {   
        enum: 'SAVE',
        title: 'Save to',
        icon: 'save',
        link: 'save-to',
    },
    {   
        enum: 'EXPORT',
        title: 'Export',
        icon: 'export',
        link: 'export',
    },
    {   
        enum: 'LIVE_COLLAB',
        title: 'Live collab',
        icon: 'live-collab',
        link: 'live-collab',
    },
    {   
        enum: 'RESET_CANVAS',
        title: 'Reset canvas',
        icon: 'reset-canvas',
        link: 'reset-canvas',
    }
]