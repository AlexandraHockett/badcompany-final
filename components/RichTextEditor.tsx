"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import TextAlignExtension from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link,
  Images,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  className = "",
}: RichTextEditorProps) {
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [sourceValue, setSourceValue] = useState(value);

  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({
        openOnClick: false,
        protocols: ["http", "https", "mailto"],
      }),
      ImageExtension,
      TextAlignExtension.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Função para adicionar link
  const addLink = () => {
    if (!editor) return;

    const url = prompt("Digite a URL do link:");
    const linkText = prompt("Texto do link (opcional):");

    if (url) {
      const selectedText = editor.state.selection
        .content()
        .content.textBetween(0, editor.state.selection.content().content.size);

      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .insertContent(linkText || selectedText || url)
        .run();
    }
  };

  // Função para adicionar imagem
  const addImage = () => {
    if (!editor) return;

    const url = prompt("Digite a URL da imagem:");
    const altText = prompt("Descrição da imagem (alt text):");

    if (url) {
      editor
        .chain()
        .focus()
        .setImage({ src: url, alt: altText || "" })
        .run();
    }
  };

  // Renderizar botões de formatação
  const renderFormatButtons = () => {
    if (!editor) return null;

    const buttons = [
      {
        icon: <Bold className="h-4 w-4" />,
        action: () => editor.chain().focus().toggleBold().run(),
        isActive: editor.isActive("bold"),
        title: "Negrito",
      },
      {
        icon: <Italic className="h-4 w-4" />,
        action: () => editor.chain().focus().toggleItalic().run(),
        isActive: editor.isActive("italic"),
        title: "Itálico",
      },
      {
        icon: <List className="h-4 w-4" />,
        action: () => editor.chain().focus().toggleBulletList().run(),
        isActive: editor.isActive("bulletList"),
        title: "Lista com marcadores",
      },
      {
        icon: <ListOrdered className="h-4 w-4" />,
        action: () => editor.chain().focus().toggleOrderedList().run(),
        isActive: editor.isActive("orderedList"),
        title: "Lista numerada",
      },
      {
        icon: <Link className="h-4 w-4" />,
        action: addLink,
        isActive: false,
        title: "Inserir link",
      },
      {
        icon: <Images className="h-4 w-4" />,
        action: addImage,
        isActive: false,
        title: "Inserir imagem",
      },
      {
        icon: <AlignLeft className="h-4 w-4" />,
        action: () => editor.chain().focus().setTextAlign("left").run(),
        isActive: editor.isActive({ textAlign: "left" }),
        title: "Alinhar à esquerda",
      },
      {
        icon: <AlignCenter className="h-4 w-4" />,
        action: () => editor.chain().focus().setTextAlign("center").run(),
        isActive: editor.isActive({ textAlign: "center" }),
        title: "Centralizar",
      },
      {
        icon: <AlignRight className="h-4 w-4" />,
        action: () => editor.chain().focus().setTextAlign("right").run(),
        isActive: editor.isActive({ textAlign: "right" }),
        title: "Alinhar à direita",
      },
    ];

    return buttons.map((button, index) => (
      <Toggle
        key={index}
        pressed={button.isActive}
        onPressedChange={() => button.action()}
        className={`${button.isActive ? "bg-gray-700" : ""}`}
        disabled={isSourceMode}
        title={button.title}
      >
        {button.icon}
      </Toggle>
    ));
  };

  // Renderização condicional baseada no modo
  const renderEditorContent = () => {
    if (isSourceMode) {
      return (
        <textarea
          value={sourceValue}
          onChange={(e) => {
            const newValue = e.target.value;
            setSourceValue(newValue);
            onChange(newValue);
          }}
          className="w-full h-64 p-4 bg-gray-900 text-white font-mono text-sm outline-none resize-y"
          placeholder="Digite ou cole o HTML aqui..."
        />
      );
    }

    return (
      <EditorContent
        editor={editor}
        className="w-full min-h-[250px] max-h-[500px] p-4 bg-gray-900 text-white outline-none overflow-y-auto"
      />
    );
  };

  return (
    <div
      className={`border border-gray-700 rounded-lg overflow-hidden ${className}`}
    >
      <div className="bg-gray-900 p-2 border-b border-gray-700 flex flex-wrap items-center gap-1">
        {renderFormatButtons()}

        <div className="ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (isSourceMode) {
                // Ao voltar do modo fonte, define o conteúdo do editor
                editor?.commands.setContent(sourceValue);
              }
              setIsSourceMode(!isSourceMode);
            }}
            className={isSourceMode ? "bg-purple-700" : ""}
          >
            {isSourceMode ? "Visual" : "HTML"}
          </Button>
        </div>
      </div>

      {renderEditorContent()}
    </div>
  );
}
