import * as vscode from 'vscode';

export default async function renameRepeatedTag(document: vscode.TextDocument, range: vscode.Range, given: string, field: string) {
    const documentContent = document.getText();

    const start = new vscode.Position(range.start.line, 0);
    const end = new vscode.Position(range.end.line, document.lineAt(range.end.line).text.length);
    const selection = new vscode.Selection(start, end);
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        editor.selections = [selection];
    }
    const selectedText = document.getText(new vscode.Range(start, end));
    const lines = documentContent.split('\n');
    try {
        const paramName = await vscode.window.showInputBox({
            prompt: 'Enter the name for the tag',
            validateInput: (value: string) => {
                if (!value) {
                    return 'Parameter name cannot be empty';
                }
                return null;
            }
        });
        const newText = selectedText.replace(/- name: .*/g, `- name: ${paramName ? paramName : ''}`);
        lines[range.start.line] = paramName ? newText : selectedText;
        return lines.join('\n');
    } catch (error) {
        console.error("Failed to show input box.", error);
    }
}