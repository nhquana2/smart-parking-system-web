---
applyTo: "**"
---

## Summary

You are coding a smart parking system web (frontend + backend) for an IoT project that has this flow:

-   Communication between device (ESP8266 + ESP32CAM) and Node-RED backend, update/get data from Firestore, mostly using MQTT (you don't need to care much about this)
-   The web (this is what you are coding) responsible for: using APIs and frontend to provide a dashboard for the parking system manager.

## General guidelines

-   Please write this with minimal, but robust code. Think step by step about whether there exists a less over-engineered and yet simpler, more elegant and shorter solution to the problem that accords with KISS and DRY principles. Focus on delivering minimum viable functionality. No excessive fail safe checks that we already handled earlier.
-   Precise coding, do not be lengthy, do not add unnecessary comments for code blocks that easily understandable, do not add icons or weird things when printing or debugging.
-   Ask/ clarify when you are unsure with instructions
-   Do not make up things yourself when not asked to, especially adding not needed edge cases check that looks dumb
-   Clean coding, but not strictly have to follow any standards, just be sure that it is easy readable and maintainable.
-   When providing instruction, be clear, but not lengthy, critical thinking and suggest the best method you found, you don't need to suggest other methods when not asked to, it is distracting.
-   Do web-search when you use a libraries, keep up-to-date version and code.
-   It is important that everything produced is operationally sound
-   Only write high-value comments if at all. Avoid talking to the user through comments.
-   I will request you to write code gradually from the start, so do it carefully and steadily.
-   You could/ may want to suggest things that you think benefits my project
-   Remember that this is a small, medium-sized project, not a large-scaled or enterprise project
-   Give me the commands to run the server, you don't need to run it

## Tech-stack

# Backend

-   Using FastAPI (latest version), be sure it is compatiable with current Python version (3.10)
-   Our database is Firestore
-   DB schema will be provided for you, if not, please ask or clarify when I forget or provide missing information
-   For authentication, I'm using Firebase Auth, keep it simple using token-based authentication for endpoints, use built-in FastAPI (e.g Depends) where applicable.
-   Use routers for API endpoints
-   Keep the codebase structure modular, with separate files for models, routers, utils, etc.

# Frontend

-   Employs a dashboard for manager of the parking system, with navbar on the left, with login and permission checking
-   Use Vite as the build tool
-   Main color: Blue
-   Uses React
-   For styling, use TailwindCSS (and also shacdn/ui if necessary)
-   Uses React Query (Tanstack Query) for data fetching, caching, invalidation
-   Do not use Redux, it is overkill
-   Use React Router
-   Keep everything up-to-date, consistent, do web-search for documentation if needed
-   Use latest stable version, but still ensure compatibility
-   Frontend architecture please keep it simple, clean and easily maintainable.

# Frontend (other suggestions)

-   Use functional components with Hooks: Do not generate class components or use old lifecycle methods. Manage state with useState or useReducer, and side effects with useEffect (or related Hooks). Always prefer functions and Hooks for any new component logic.
-   Prefer composition and small components: Break down UI into small, reusable components rather than writing large monolithic components. The code you generate should promote clarity and reusability by composing components together. Similarly, abstract repetitive logic into custom Hooks when appropriate to avoid duplicating code.
-   Optimize to reduce network waterfalls - Use parallel data fetching wherever possible (e.g., start multiple requests at once rather than one after another). Leverage Suspense for data loading and keep requests co-located with the component that needs the data.
-   Design for a good user experience - Provide clear, minimal, and non-blocking UI states. When data is loading, show lightweight placeholders (e.g., skeleton screens) rather than intrusive spinners everywhere. Handle errors gracefully with a dedicated error boundary or a friendly inline message. Where possible, render partial data as it becomes available rather than making the user wait for everything. Suspense allows you to declare the loading states in your component tree in a natural way, preventing “flash” states and improving perceived performance.
-   Follow the Rules of Hooks: Ensure that any Hooks (useState, useEffect, useContext, custom Hooks, etc.) are called unconditionally at the top level of React function components or other Hooks. Do not generate code that calls Hooks inside loops, conditional statements, or nested helper functions. Do not call Hooks in non-component functions or outside the React component rendering context.
