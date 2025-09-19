'use client';

import React, { useEffect, useRef } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Quote from '@editorjs/quote';
import RawTool from '@editorjs/raw';
import SimpleImage from '@editorjs/simple-image';
import Table from '@editorjs/table';
import Checklist from '@editorjs/checklist';
import CodeTool from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import Embed from '@editorjs/embed';
import InlineCode from '@editorjs/inline-code';
import Marker from '@editorjs/marker';
import Warning from '@editorjs/warning';

interface EditorClientProps {
  value?: OutputData;
  onChange?: (data: OutputData) => void;
  isEdited?: boolean
}

export function EditorClient({ value, onChange, isEdited }: EditorClientProps) {
  const editorRef = useRef<EditorJS | null>(null);
  const editorContainerId = 'editorjs-container';

  useEffect(() => {
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: editorContainerId,
        placeholder: "Let's write an awesome story!",
        data: value, // preload if form has existing value
        tools: {
          header: Header,
          list: List,
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
          quote: Quote,
          raw: RawTool,
          image: SimpleImage,
          table: Table,
          checklist: Checklist,
          code: CodeTool,
          delimiter: Delimiter,
          embed: Embed,
          inlineCode: InlineCode,
          marker: Marker,
          warning: Warning,
        },
        async onChange(api) {
          const data = await api.saver.save();
          if (onChange) {
            onChange(data); // send to react-hook-form
          }
        },
      });
      editorRef.current = editor;
    }

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [isEdited]);

  return (
    <div
      id={editorContainerId}
      className="prose prose-stone dark:prose-invert min-h-[400px] w-full max-w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
    />
  );
}
