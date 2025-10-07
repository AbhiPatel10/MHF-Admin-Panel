// utils/editorTextExtractor.ts
export const extractEditorText = (content?: any, limit = 200): string => {
    if (!content?.blocks || !Array.isArray(content.blocks)) return "No description available.";

    const plainText = content.blocks
        .map((block: any) => {
            if (block.type === "paragraph" || block.type === "header") {
                return block.data.text
                    ?.replace(/<[^>]*>/g, "") // remove HTML tags
                    ?.trim();
            }
            return "";
        })
        .filter(Boolean)
        .join(" ");

    return plainText.length > limit ? plainText.substring(0, limit) + "..." : plainText;
};
