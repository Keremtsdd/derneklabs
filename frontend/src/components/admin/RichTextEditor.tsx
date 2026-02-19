import { useEffect, useRef, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $getRoot } from 'lexical';

import {
    FORMAT_TEXT_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    UNDO_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    $getSelection,
    $isRangeSelection,
    COMMAND_PRIORITY_CRITICAL,
} from 'lexical';

import {
    FaBold,
    FaItalic,
    FaUnderline,
    FaStrikethrough,
    FaAlignLeft,
    FaAlignCenter,
    FaAlignRight,
    FaAlignJustify,
    FaUndo,
    FaRedo,
} from 'react-icons/fa';

const theme = {
    ltr: 'ltr',
    rtl: 'rtl',
    placeholder: 'editor-placeholder',
    paragraph: 'editor-paragraph mb-2',
    quote: 'editor-quote border-l-4 border-gray-300 pl-4 py-2 italic text-gray-600 bg-gray-50 my-2',
    heading: {
        h1: 'editor-heading-h1 text-3xl font-bold mb-4 mt-6',
        h2: 'editor-heading-h2 text-2xl font-bold mb-3 mt-5',
        h3: 'editor-heading-h3 text-xl font-bold mb-2 mt-4',
    },
    list: {
        nested: {
            listitem: 'editor-nested-listitem ml-4 list-none',
        },
        ol: 'editor-list-ol list-decimal ml-5 mb-2',
        ul: 'editor-list-ul list-disc ml-5 mb-2',
        listitem: 'editor-listitem mb-1',
    },
    image: 'editor-image',
    link: 'editor-link text-blue-600 underline cursor-pointer hover:text-blue-800',
    text: {
        bold: 'editor-text-bold font-bold',
        italic: 'editor-text-italic italic',
        overflowed: 'editor-text-overflowed',
        hashtag: 'editor-text-hashtag',
        underline: 'editor-text-underline underline',
        strikethrough: 'editor-text-strikethrough line-through',
        underlineStrikethrough: 'editor-text-underlineStrikethrough underline line-through',
        code: 'editor-text-code font-mono bg-gray-100 p-1 rounded text-sm text-red-600',
    },
};

function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);

    useEffect(() => {
        return editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            (_payload) => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    setIsBold(selection.hasFormat('bold'));
                    setIsItalic(selection.hasFormat('italic'));
                    setIsUnderline(selection.hasFormat('underline'));
                    setIsStrikethrough(selection.hasFormat('strikethrough'));
                }
                return false;
            },
            COMMAND_PRIORITY_CRITICAL
        );
    }, [editor]);

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <button
                type="button"
                onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
                className="p-2 rounded hover:bg-gray-200 text-gray-700"
                title="Geri Al"
            >
                <FaUndo size={14} />
            </button>
            <button
                type="button"
                onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
                className="p-2 rounded hover:bg-gray-200 text-gray-700"
                title="İleri Al"
            >
                <FaRedo size={14} />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            <button
                type="button"
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
                className={`p-2 rounded hover:bg-gray-200 text-gray-700 ${isBold ? 'bg-gray-200 text-black' : ''}`}
                title="Kalın"
            >
                <FaBold size={14} />
            </button>
            <button
                type="button"
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
                className={`p-2 rounded hover:bg-gray-200 text-gray-700 ${isItalic ? 'bg-gray-200 text-black' : ''}`}
                title="İtalik"
            >
                <FaItalic size={14} />
            </button>
            <button
                type="button"
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
                className={`p-2 rounded hover:bg-gray-200 text-gray-700 ${isUnderline ? 'bg-gray-200 text-black' : ''}`}
                title="Altı Çizili"
            >
                <FaUnderline size={14} />
            </button>
            <button
                type="button"
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
                className={`p-2 rounded hover:bg-gray-200 text-gray-700 ${isStrikethrough ? 'bg-gray-200 text-black' : ''}`}
                title="Üstü Çizili"
            >
                <FaStrikethrough size={14} />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            <button
                type="button"
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
                className="p-2 rounded hover:bg-gray-200 text-gray-700"
                title="Sola Hizala"
            >
                <FaAlignLeft size={14} />
            </button>
            <button
                type="button"
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
                className="p-2 rounded hover:bg-gray-200 text-gray-700"
                title="Ortala"
            >
                <FaAlignCenter size={14} />
            </button>
            <button
                type="button"
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
                className="p-2 rounded hover:bg-gray-200 text-gray-700"
                title="Sağa Hizala"
            >
                <FaAlignRight size={14} />
            </button>
            <button
                type="button"
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}
                className="p-2 rounded hover:bg-gray-200 text-gray-700"
                title="İki Yana Yasla"
            >
                <FaAlignJustify size={14} />
            </button>
        </div>
    );
}

// Initial State Plugin: Loads HTML into Lexical specific nodes
function InitialStatePlugin({ html }: { html: string }) {
    const [editor] = useLexicalComposerContext();
    const loadedRef = useRef(false);

    useEffect(() => {
        if (!loadedRef.current && html) {
            editor.update(() => {
                const parser = new DOMParser();
                const dom = parser.parseFromString(html, 'text/html');
                const nodes = $generateNodesFromDOM(editor, dom);
                const root = $getRoot();
                root.clear();
                root.append(...nodes);
            });
            loadedRef.current = true;
        }
    }, [editor, html]);

    return null;
}

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const initialConfig = {
        namespace: 'RichTextEditor',
        theme,
        onError(error: Error) {
            console.error(error);
        },
        nodes: [
            HeadingNode,
            ListNode,
            ListItemNode,
            QuoteNode,
            LinkNode,
            AutoLinkNode,
        ],
    };

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-shadow">
            <LexicalComposer initialConfig={initialConfig}>
                <div className="editor-container relative bg-white">
                    <ToolbarPlugin />
                    <div className="relative min-h-[300px]">
                        <RichTextPlugin
                            contentEditable={
                                <ContentEditable className="editor-input min-h-[300px] p-4 outline-none prose prose-sm max-w-none" />
                            }
                            placeholder={
                                <div className="editor-placeholder absolute top-[52px] left-4 text-gray-400 pointer-events-none select-none">
                                    {placeholder || 'İçerik giriniz...'}
                                </div>
                            }
                            ErrorBoundary={LexicalErrorBoundary}
                        />
                        <HistoryPlugin />
                        <InitialStatePlugin html={value} />
                        <MyOnChangePlugin onChange={onChange} />
                    </div>
                </div>
            </LexicalComposer>
        </div>
    );
}

function MyOnChangePlugin({ onChange }: { onChange: (html: string) => void }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                const html = $generateHtmlFromNodes(editor, null);
                onChange(html);
            });
        });
    }, [editor, onChange]);

    return null;
}
