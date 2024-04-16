export class MenuItem {
    enum!: string;
    title!: string;
    icon!: string;
    icon_invert?: string;
    link!: string;
    target?: string;
    onClick?: () => void;
}

export const MenuList: Array<MenuItem> = [
    {   
        enum: 'OPEN',
        title: 'Open',
        icon: 'https://svgshare.com/i/15Rg.svg',
        icon_invert: 'https://svgshare.com/i/15Sm.svg',
        link: 'open',
        onClick: () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.cocanvas';
            input.click();
            input.addEventListener('change', async (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            const text = await file?.text();
            const { shapes, canvasState } = JSON.parse(text as string);
            localStorage.setItem('cocanvas_shapes', JSON.stringify(shapes));
            window.location.reload();
    });
        }
    },
    {   
        enum: 'DOWNLOAD',
        title: 'Download',
        icon: 'https://svgshare.com/i/15Ru.svg',
        icon_invert: 'https://svgshare.com/i/15St.svg',
        link: 'save-to',
        onClick: () => {
            const shapes = JSON.parse(localStorage.getItem('cocanvas_shapes') as string);
            const canvasState = JSON.parse(localStorage.getItem('cocanvas_state') as string);
            if(!shapes || !shapes.objects) return;
            const blob = new Blob([JSON.stringify({shapes, canvasState})], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const name = prompt('Enter file name', 'canvas');
            a.download = name ? `${name}.cocanvas` : 'canvas.cocanvas';
            a.click();
            URL.revokeObjectURL(url);
        }
    },
    {   
        enum: 'LIVE_COLLAB',
        title: 'Live collab',
        icon: 'https://svgshare.com/i/15SR.svg',
        icon_invert: 'https://svgshare.com/i/15Qn.svg',
        link: 'live-collab',
        onClick: () => {}
    },
    {   
        enum: 'RESET_CANVAS',
        title: 'Reset canvas',
        icon: 'https://svgshare.com/i/15Sc.svg',
        icon_invert: 'https://svgshare.com/i/15S4.svg',
        link: 'reset-canvas',
        onClick: () => {
            localStorage.removeItem('cocanvas_shapes');
            localStorage.removeItem('cocanvas_state');
            window.location.reload();
        }
    }
]