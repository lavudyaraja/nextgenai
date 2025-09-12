'use client'

import React from 'react'
import { MessageContent } from '@/components/ui/message-content'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CodeBlockDemo() {
  // Sample message content with code blocks
  const sampleMessage = `Here's a simple implementation of the factorial function in C++:

\`\`\`cpp
#include <iostream>

// Function to calculate factorial
long long factorial(int n) {
    if (n == 0 || n == 1)
        return 1;
    else
        return n * factorial(n-1);
}

int main() {
    int num;
    std::cout << "Enter a positive integer: ";
    std::cin >> num;

    if (num < 0) {
        std::cout << "Factorial is not defined for negative numbers.";
    } else if (num > 20) {
        std::cout << "Factorial for numbers larger than 20 can cause overflow.";
    } else {
        std::cout << "Factorial of " << num << " = " << factorial(num);
    }

    return 0;
}
\`\`\`

This program uses a recursive approach to calculate the factorial. However, please note that this approach has a problem with overflow for large numbers because the result grows extremely fast.

A more efficient approach would be to use an iterative method or dynamic programming to calculate the factorial, which can handle larger numbers without overflowing:

\`\`\`cpp
#include <iostream>

// Function to calculate factorial
long long factorial(int n) {
    long long result = 1;
    for (int i = 2; i <= n; i++)
        result *= i;
    return result;
}

int main() {
    int num;
    std::cout << "Enter a positive integer: ";
    std::cin >> num;

    if (num < 0) {
        std::cout << "Factorial is not defined for negative numbers.";
    } else {
        std::cout << "Factorial of " << num << " = " << factorial(num);
    }

    return 0;
}
\`\`\`

This version of the program uses a simple loop to calculate the factorial, and it can handle larger numbers without overflowing.

You can also use Python for a simpler implementation:

\`\`\`python
def factorial(n):
    if n == 0 or n == 1:
        return 1
    else:
        return n * factorial(n-1)

# Get input from user
num = int(input("Enter a positive integer: "))

if num < 0:
    print("Factorial is not defined for negative numbers.")
else:
    print(f"Factorial of {num} = {factorial(num)}")
\`\`\`

Both implementations will give you the same result!`

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Code Block Copy Functionality Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">AI</span>
              </div>
              <span className="font-medium">AI Assistant</span>
            </div>
            <MessageContent content={sampleMessage} />
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold mb-2">✨ Features Implemented:</h3>
            <ul className="space-y-1 text-sm">
              <li>• <strong>Code Block Detection:</strong> Automatically detects ```language code blocks</li>
              <li>• <strong>Copy Code Button:</strong> Each code block has a "Copy code" button in the top-right</li>
              <li>• <strong>Language Labels:</strong> Shows the programming language (cpp, python, etc.)</li>
              <li>• <strong>Visual Feedback:</strong> Button shows "Copied" with checkmark when clicked</li>
              <li>• <strong>Mixed Content:</strong> Handles text and code blocks together seamlessly</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}