export const convertToMarkdown = (doc: any): string => {
  let markdown = '';

  const parseContent = (content: any[]) => {
    if (!content) return; // Add this check to prevent errors if content is undefined

    content?.forEach(node => {
      switch (node?.type) {
        case 'heading':
          if (node?.content) {
            // Check if content is defined
            markdown += `${'#'?.repeat(node?.attrs?.level)} ${node?.content
              ?.map((c: any) => c?.text)
              ?.join('')}\n\n`;
          }
          break;
        case 'paragraph':
          if (node?.content) {
            // Check if content is defined
            markdown += `${node?.content
              ?.map((c: any) => {
                if (c?.marks) {
                  if (c?.marks?.find((m: any) => m?.type === 'bold')) {
                    return `**${c?.text}**`;
                  }
                }
                return c?.text;
              })
              ?.join('')}\n\n`;
          }
          break;
        case 'orderedList':
          if (node?.content) {
            // Check if content is defined
            node?.content?.forEach((item: any, index: number) => {
              markdown += `${index + 1}?. ${item?.content
                ?.map((c: any) => parseContent(c?.content))
                ?.join('')}\n`;
            });
            markdown += '\n';
          }
          break;
        case 'bulletList':
          if (node?.content) {
            // Check if content is defined
            node?.content?.forEach((item: any) => {
              markdown += `- ${item?.content
                ?.map((c: any) => parseContent(c?.content))
                ?.join('')}\n`;
            });
            markdown += '\n';
          }
          break;
        default:
          console?.log(`Unhandled node type: ${node?.type}`);
      }
    });
  };

  if (doc && doc?.content) {
    // Ensure doc and doc?.content are defined
    parseContent(doc?.content);
  }
  return markdown;
};
