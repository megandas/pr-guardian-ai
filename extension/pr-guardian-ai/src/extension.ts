import * as vscode from "vscode";
import { SidebarProvider } from "./sidebarProvider";

export function activate(context: vscode.ExtensionContext) {
  console.log("PR Guardian AI Activated!");

  const provider = new SidebarProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "prguardianView",
      provider
    )
  );
}

export function deactivate() {}