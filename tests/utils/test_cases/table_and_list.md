# _Question_

I'm learning Javascript.  Can you summarize the difference between const, var, and let in a table?

# _Answer_

Certainly! Here's a table summarizing the differences between `const`, `var`, and `let` in JavaScript:

| Keyword | Scope | Mutability | Hoisting |
| --- | --- | --- | --- |
| `const` | Block-scoped | Immutable | Not hoisted |
| `var` | Function-scoped | Mutable | Hoisted |
| `let` | Block-scoped | Mutable | Not hoisted |

Here's a brief explanation of each term:

- **Scope**: Refers to the part of the program where a variable can be accessed. `const` and `let` are block-scoped, which means they are only accessible within the block of code where they are defined. `var` is function-scoped, which means it can be accessed throughout the entire function in which it is defined.
- **Mutability**: Refers to whether a variable can be reassigned after it has been declared. `const` variables cannot be reassigned, while `var` and `let` variables can be.
- **Hoisting**: Refers to the behavior where variable declarations are moved to the top of their scope during compilation. `var` variables are hoisted, meaning they can be used before they are declared. `const` and `let` variables are not hoisted, so they must be declared before they are used.

I hope this helps clarify the differences between `const`, `var`, and `let` in JavaScript!
