import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	vscode.commands.registerCommand('dart-file-name-fixer.fix', () => {
		renameFiles();
	});

}

// this regex will match all captial letters and numbers
const capitalLettersOrNumbersRegex = /[A-Z0-9]/g;

async function renameFiles() {
	const filesUris = await vscode.workspace.findFiles('lib/**/**.dart');

	filesUris.forEach(
		async (uri) => {
			const currentFilePath = vscode.workspace.asRelativePath(uri);
			const absoluteFilePath = uri.path.split("lib")[0];
			if (capitalLettersOrNumbersRegex.test(currentFilePath)) {

				// replace all uppercase letters with lowercase
				const middleFilePath = currentFilePath.replace(
					capitalLettersOrNumbersRegex, (letter) => "_" + letter.toLowerCase()
				);

				// remove the first underscore
				const fileName = middleFilePath.split("/")[middleFilePath.split("/").length - 1];
				const finalPath =
					fileName.startsWith("_")
						? middleFilePath.replace(fileName, fileName.substring(1))
						: middleFilePath;

				const newUri = vscode.Uri.file(absoluteFilePath + finalPath);
				vscode.workspace.fs.rename(uri, newUri);
			}
		},
	);
	if (filesUris.length === 0) {
		vscode.window.showInformationMessage('No dart files found!');
	} else {
		vscode.window.showInformationMessage('Now All is Done!');
	}
}