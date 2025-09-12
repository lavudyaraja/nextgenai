'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function KeyboardShortcutsPage() {
  const shortcuts = [
    {
      category: 'General',
      items: [
        { keys: ['Ctrl', 'K'], description: 'Open command palette' },
        { keys: ['Ctrl', '/'], description: 'Show keyboard shortcuts' },
        { keys: ['Ctrl', 'N'], description: 'Create new chat' },
        { keys: ['Ctrl', 'Shift', 'N'], description: 'Create new folder' },
        { keys: ['Ctrl', ','], description: 'Open settings' },
        { keys: ['Ctrl', 'Q'], description: 'Quick search' },
      ]
    },
    {
      category: 'Navigation',
      items: [
        { keys: ['Ctrl', 'Shift', 'H'], description: 'Go to home' },
        { keys: ['Ctrl', 'Shift', 'C'], description: 'Go to chat' },
        { keys: ['Ctrl', 'Shift', 'S'], description: 'Go to settings' },
        { keys: ['Ctrl', 'Shift', 'F'], description: 'Go to favorites' },
        { keys: ['Alt', '←'], description: 'Go back' },
        { keys: ['Alt', '→'], description: 'Go forward' },
      ]
    },
    {
      category: 'Chat',
      items: [
        { keys: ['Enter'], description: 'Send message' },
        { keys: ['Shift', 'Enter'], description: 'Add new line' },
        { keys: ['Ctrl', 'Enter'], description: 'Add new paragraph' },
        { keys: ['↑'], description: 'Edit last message' },
        { keys: ['Ctrl', 'Shift', '↑'], description: 'Previous chat' },
        { keys: ['Ctrl', 'Shift', '↓'], description: 'Next chat' },
        { keys: ['Ctrl', 'E'], description: 'Edit message' },
        { keys: ['Ctrl', 'D'], description: 'Delete message' },
        { keys: ['Ctrl', 'R'], description: 'Reply to message' },
      ]
    },
    {
      category: 'Formatting',
      items: [
        { keys: ['Ctrl', 'B'], description: 'Bold text' },
        { keys: ['Ctrl', 'I'], description: 'Italic text' },
        { keys: ['Ctrl', 'U'], description: 'Underline text' },
        { keys: ['Ctrl', 'Shift', 'X'], description: 'Strikethrough text' },
        { keys: ['Ctrl', 'Shift', 'M'], description: 'Insert code' },
        { keys: ['Ctrl', 'Shift', '7'], description: 'Numbered list' },
        { keys: ['Ctrl', 'Shift', '8'], description: 'Bulleted list' },
        { keys: ['Ctrl', 'Shift', '9'], description: 'Quote' },
      ]
    },
    {
      category: 'Media',
      items: [
        { keys: ['Ctrl', 'Shift', 'U'], description: 'Upload file' },
        { keys: ['Ctrl', 'Shift', 'I'], description: 'Insert image' },
        { keys: ['Ctrl', 'Shift', 'V'], description: 'Paste image' },
        { keys: ['Ctrl', 'Shift', 'R'], description: 'Record voice message' },
      ]
    },
    {
      category: 'Windows & Tabs',
      items: [
        { keys: ['Ctrl', 'T'], description: 'Open new tab' },
        { keys: ['Ctrl', 'W'], description: 'Close tab' },
        { keys: ['Ctrl', 'Tab'], description: 'Switch to next tab' },
        { keys: ['Ctrl', 'Shift', 'Tab'], description: 'Switch to previous tab' },
        { keys: ['Ctrl', '1-9'], description: 'Switch to tab 1-9' },
        { keys: ['Ctrl', '0'], description: 'Reset zoom level' },
        { keys: ['Ctrl', '+'], description: 'Zoom in' },
        { keys: ['Ctrl', '-'], description: 'Zoom out' },
      ]
    }
  ]

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Keyboard Shortcuts</h1>
        <p className="text-muted-foreground">
          Speed up your workflow with these helpful keyboard shortcuts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {shortcuts.map((section, index) => (
          <Card key={index} className="h-fit">
            <CardHeader>
              <CardTitle>{section.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center justify-between py-2 border-b last:border-0">
                    <dt className="flex items-center gap-2">
                      {item.keys.map((key, keyIndex) => (
                        <kbd key={keyIndex} className="px-2 py-1 bg-muted rounded text-xs font-medium">
                          {key}
                        </kbd>
                      ))}
                      {item.keys.length > 1 && (
                        <span className="text-muted-foreground text-sm">+</span>
                      )}
                    </dt>
                    <dd className="text-sm text-muted-foreground text-right">
                      {item.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}