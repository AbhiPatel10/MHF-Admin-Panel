declare module '@editorjs/raw' {
    import { BlockTool } from '@editorjs/editorjs';

    export default class Raw implements BlockTool {
        constructor({ data, config, api }: any);
        static get toolbox(): {
            title: string;
            icon: string;
        };
        render(): HTMLElement;
        save(blockContent: HTMLElement): { html: string };
    }
}
