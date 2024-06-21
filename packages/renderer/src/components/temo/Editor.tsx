import {SpecRegistry, PluginKey, Plugin} from '@bangle.dev/core';
import {BangleEditor, useEditorState} from '@bangle.dev/react';
import {floatingMenu, FloatingMenu} from '@bangle.dev/react-menu';
import {markdownParser, markdownSerializer} from '@bangle.dev/markdown';
import {
  blockquote,
  bold,
  bulletList,
  code,
  codeBlock,
  hardBreak,
  heading,
  horizontalRule,
  image,
  italic,
  link,
  listItem,
  orderedList,
  paragraph,
  strike,
  underline,
} from '@bangle.dev/base-components';

import '@bangle.dev/react-menu/style.css';
import '@bangle.dev/core/style.css';
import '@bangle.dev/tooltip/style.css';

const menuKey = new PluginKey('menuKey');
const specRegistry = new SpecRegistry([
  blockquote.spec(),
  bold.spec(),
  bulletList.spec(),
  code.spec(),
  // codeBlock.spec(),
  hardBreak.spec(),
  heading.spec(),
  horizontalRule.spec(),
  image.spec(),
  italic.spec(),
  link.spec(),
  listItem.spec(),
  orderedList.spec(),
  paragraph.spec(),
  strike.spec(),
  underline.spec(),
]);
const parser = markdownParser(specRegistry);
const serializer = markdownSerializer(specRegistry);

export default function Editor({
  defaultValue,
  onChange,
}: {
  defaultValue: string;
  onChange: (value: string) => void;
}) {
  const editorState = useEditorState({
    initialValue: parser.parse(defaultValue),
    specRegistry,
    // @ts-ignore
    plugins: () => [
      bold.plugins(),
      italic.plugins(),
      link.plugins(),
      orderedList.plugins(),
      bulletList.plugins(),
      listItem.plugins(),
      paragraph.plugins(),
      heading.plugins(),
      blockquote.plugins(),
      code.plugins(),
      // codeBlock.plugins(),
      horizontalRule.plugins(),
      image.plugins(),
      strike.plugins(),
      underline.plugins(),
      floatingMenu.plugins({
        key: menuKey,
      }),
      new Plugin({
        view: () => ({
          update: (view, prevState) => {
            if (!view.state.doc.eq(prevState.doc)) {
              handleUpdateThrottled(view.state.doc);
            }
          },
        }),
      }),
    ],
  });

  const handleUpdate = (doc: any) => {
    onChange(serializeMarkdown(doc));
  };

  const handleUpdateThrottled = throttle(handleUpdate, 3000);

  return (
    <BangleEditor
      state={editorState}
      style={{
        outline: 'none',
        background: 'var(--background)',
        color: 'var(--foreground)',
        height: 'calc(100vh - 180px)',
        overflow: 'auto',
      }}
    >
      <FloatingMenu menuKey={menuKey} />
    </BangleEditor>
  );
}

export function serializeMarkdown(doc: any) {
  return serializer.serialize(doc);
}

function throttle(func: (...args: any[]) => void, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function (...args: any[]) {
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null;
        func(...args);
      }, wait);
    }
  };
}
