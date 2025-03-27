// components/RichTextEditor.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Image,
  Type,
  Code,
} from "lucide-react";

// Interface para as props do componente
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  className = "",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");

  // Sincronizar o conteúdo do editor com o estado externo
  useEffect(() => {
    if (editorRef.current && value) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
      }
    }
  }, [value]);

  // Manipular mudanças no editor
  const handleEditorChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Aplicar comandos de formatação
  const execCommand = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    handleEditorChange();
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  // Inserir link
  const insertLink = () => {
    if (linkUrl) {
      const text = linkText || linkUrl;
      execCommand(
        "insertHTML",
        `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${text}</a>`
      );
      setIsLinkDialogOpen(false);
      setLinkUrl("");
      setLinkText("");
    }
  };

  // Manipular mudanças no tamanho da fonte
  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    execCommand("fontSize", e.target.value);
  };

  // Manipular mudanças na cor do texto
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    execCommand("foreColor", e.target.value);
  };

  // Manipular mudanças na cor de fundo
  const handleBgColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    execCommand("hiliteColor", e.target.value);
  };

  return (
    <div className={`border rounded-md overflow-hidden ${className}`}>
      {/* Barra de ferramentas */}
      <div className="bg-gray-800 border-b border-gray-700 p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => execCommand("bold")}
          className="p-1.5 rounded hover:bg-gray-700"
          title="Negrito"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("italic")}
          className="p-1.5 rounded hover:bg-gray-700"
          title="Itálico"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("underline")}
          className="p-1.5 rounded hover:bg-gray-700"
          title="Sublinhado"
        >
          <Underline className="h-4 w-4" />
        </button>
        <div className="h-6 w-px bg-gray-700 mx-1"></div>
        <button
          type="button"
          onClick={() => execCommand("insertUnorderedList")}
          className="p-1.5 rounded hover:bg-gray-700"
          title="Lista com marcadores"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("insertOrderedList")}
          className="p-1.5 rounded hover:bg-gray-700"
          title="Lista numerada"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <div className="h-6 w-px bg-gray-700 mx-1"></div>
        <button
          type="button"
          onClick={() => execCommand("justifyLeft")}
          className="p-1.5 rounded hover:bg-gray-700"
          title="Alinhar à esquerda"
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("justifyCenter")}
          className="p-1.5 rounded hover:bg-gray-700"
          title="Centralizar"
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("justifyRight")}
          className="p-1.5 rounded hover:bg-gray-700"
          title="Alinhar à direita"
        >
          <AlignRight className="h-4 w-4" />
        </button>
        <div className="h-6 w-px bg-gray-700 mx-1"></div>
        <button
          type="button"
          onClick={() => setIsLinkDialogOpen(true)}
          className="p-1.5 rounded hover:bg-gray-700"
          title="Inserir link"
        >
          <Link className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            const url = prompt("Insira a URL da imagem:");
            if (url) execCommand("insertImage", url);
          }}
          className="p-1.5 rounded hover:bg-gray-700"
          title="Inserir imagem"
        >
          <Image className="h-4 w-4" /> {/* No alt needed for decorative SVG */}
        </button>
        <div className="h-6 w-px bg-gray-700 mx-1"></div>
        <select
          onChange={handleFontSizeChange}
          className="p-1 text-xs rounded bg-gray-800 border border-gray-700 hover:bg-gray-700"
          title="Tamanho da fonte"
        >
          <option value="">Tamanho</option>
          <option value="1">Muito pequeno</option>
          <option value="2">Pequeno</option>
          <option value="3">Normal</option>
          <option value="4">Médio</option>
          <option value="5">Grande</option>
          <option value="6">Muito grande</option>
          <option value="7">Enorme</option>
        </select>
        <div className="flex items-center">
          <span className="text-xs mr-1">Cor:</span>
          <input
            type="color"
            onChange={handleColorChange}
            className="w-6 h-6 p-0 border-0 rounded cursor-pointer"
            title="Cor do texto"
          />
        </div>
        <div className="flex items-center">
          <span className="text-xs mr-1">Fundo:</span>
          <input
            type="color"
            onChange={handleBgColorChange}
            className="w-6 h-6 p-0 border-0 rounded cursor-pointer"
            title="Cor de fundo"
          />
        </div>
        <div className="h-6 w-px bg-gray-700 mx-1"></div>
        <button
          type="button"
          onClick={() => execCommand("formatBlock", "<h1>")}
          className="p-1.5 rounded hover:bg-gray-700 font-bold"
          title="Título grande"
        >
          <Type className="h-4 w-4" />
          <span className="text-xs ml-1">H1</span>
        </button>
        <button
          type="button"
          onClick={() => execCommand("formatBlock", "<h2>")}
          className="p-1.5 rounded hover:bg-gray-700 font-bold"
          title="Título médio"
        >
          <Type className="h-4 w-4" />
          <span className="text-xs ml-1">H2</span>
        </button>
        <button
          type="button"
          onClick={() => execCommand("formatBlock", "<p>")}
          className="p-1.5 rounded hover:bg-gray-700"
          title="Parágrafo"
        >
          <Type className="h-4 w-4" />
          <span className="text-xs ml-1">P</span>
        </button>
        <button
          type="button"
          onClick={() => execCommand("formatBlock", "<pre>")}
          className="p-1.5 rounded hover:bg-gray-700"
          title="Código"
        >
          <Code className="h-4 w-4" />
        </button>
      </div>

      {/* Dialog para inserir link */}
      {isLinkDialogOpen && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Inserir Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">URL</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full p-2 rounded bg-gray-900 border border-gray-700"
                  placeholder="https://exemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Texto</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full p-2 rounded bg-gray-900 border border-gray-700"
                  placeholder="Texto do link (opcional)"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsLinkDialogOpen(false)}
                  className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={insertLink}
                  className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700"
                >
                  Inserir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Área editável */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[200px] p-4 focus:outline-none bg-gray-900 text-white"
        onInput={handleEditorChange}
        onBlur={handleEditorChange}
      />
    </div>
  );
};

export default RichTextEditor;
