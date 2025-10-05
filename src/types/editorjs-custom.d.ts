// Raw block
declare module '@editorjs/raw' {
    import { BlockTool } from '@editorjs/editorjs';
    export default class Raw implements BlockTool {
        constructor({ data, config, api }: any);
        static get toolbox(): { title: string; icon: string };
        render(): HTMLElement;
        save(blockContent: HTMLElement): any;
    }
}

// Simple Image block
declare module '@editorjs/simple-image' {
    import { BlockTool } from '@editorjs/editorjs';
    export default class SimpleImage implements BlockTool {
        constructor({ data, config, api }: any);
        static get toolbox(): { title: string; icon: string };
        render(): HTMLElement;
        save(blockContent: HTMLElement): any;
    }
}

// Checklist block
declare module '@editorjs/checklist' {
    import { BlockTool } from '@editorjs/editorjs';
    export default class Checklist implements BlockTool {
        constructor({ data, config, api }: any);
        static get toolbox(): { title: string; icon: string };
        render(): HTMLElement;
        save(blockContent: HTMLElement): any;
    }
}

// Embed block (even if .d.ts exists, force TypeScript to use it)
declare module '@editorjs/embed' {
    import { BlockTool } from '@editorjs/editorjs';
    const Embed: BlockTool;
    export default Embed;
}

// Marker block
declare module '@editorjs/marker' {
    import { BlockTool } from '@editorjs/editorjs';
    const Marker: BlockTool;
    export default Marker;
}

