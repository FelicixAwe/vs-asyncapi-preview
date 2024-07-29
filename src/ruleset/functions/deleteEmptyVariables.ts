import * as vscode from 'vscode';
import * as yaml from 'js-yaml';
import { JSONPath } from 'jsonpath-plus';
import { off } from 'process';

const emptyCurlyBracesPattern = /\{\}/g;

function deletionHelper(target: string) {
    target = target.replace(emptyCurlyBracesPattern, '');
    console.log("Replace curly braces:", target);
    target = target.replace(/\/\./g, '');
    target = target.replace(/\/\//g, '/');
    target = target.replace(/\.\./g, '.');
    console.log("Replace double slashes", target);
    if (target.endsWith('/')) {
        target = target.replace(/\/+$/, '');
    }
    if (target.startsWith('{')) {
        target = '/' + target;
    }
    if (target.startsWith('.')) {
        target = target.slice(1);
    }

    return target;
}

export default function deleteEmptyVariables(document: vscode.TextDocument, range: vscode.Range, given: string, field: string) {
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
    const splitText = selectedText.split('url: ');
    if (splitText) {
        splitText[splitText.length - 1] = deletionHelper(splitText[splitText.length - 1]);
        const newText = splitText.join('url: ');
        lines[range.start.line] = newText;
    }
    console.log("Selected text: \n", selectedText, range.start.line, range.end.line);
    console.log(selectedText.split(' '));
    return lines.join('\n');
}