# Angular Application Implementation Plan

This document presents a detailed implementation plan for a post management application in Angular. The plan outlines the architecture, directory structure, list of components and services, and state management approach, taking into account all project requirements and a feature-first organization.

## Directory Structure

The application is structured for clarity and scalability, with separate core, shared, and features areas. The final, implemented structure is as follows:

```
.
├── src/
│   ├── app/
│   │   ├── app.config.ts
│   │   ├── app.css
│   │   ├── app.html
│   │   ├── app.routes.ts
│   │   ├── app.spec.ts
│   │   ├── app.ts
│   │   │
│   │   ├── core/
│   │   │   └── services/
│   │   │       └── posts-store.service.ts
│   │   │
│   │   ├── features/
│   │   │   └── posts/
│   │   │       ├── post-details/
│   │   │       │   ├── post-details.html
│   │   │       │   └── post-details.ts
│   │   │       │
│   │   │       ├── posts-list/
│   │   │       │   ├── posts-list.css
│   │   │       │   ├── posts-list.html
│   │   │       │   └── posts-list.ts
│   │   │       │
│   │   │       ├── posts.model.ts
│   │   │       ├── posts.routes.ts
│   │   │       └── posts.service.ts
│   │   │
│   │   └── shared/
│   │       └── components/
│   │           └── loader/
│   │               ├── loader.html
│   │               └── loader.ts
│   │
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
└── README.md
```

## Component List

AppComponent: The main component containing the router outlet.

PostsListComponent (features/posts/posts-list): Displays a list of posts with titles and content excerpts. It implements client-side filtering and uses the Loader component.

PostDetailsComponent (features/posts/post-details): Displays the full post content, author data, and a list of comments.

LoaderComponent (shared/components/loader): Displays a spinner while loading data from the API.

## Services

PostsService: This service is responsible for direct communication with the external API https://jsonplaceholder.typicode.com. It contains methods for fetching posts, users, and comments using HttpClient and RxJS.

PostsStoreService (Singleton): This is the central cache of the application. It stores post data and favorite post IDs in signals. This service provides logic to check if data is already in memory before making an API call, optimizing performance. Data is refreshed only when filters change or the page is reloaded. It also manages the state of favorite posts, ensuring they are preserved across sessions.

## State Management Approach

The application's state management is based on a modern, reactive approach:

Signals: Signals are used to manage state within components (e.g., loading state, UI element visibility) and to store data in the singleton PostsStoreService. Components automatically react to state changes, ensuring efficient UI rendering.

Singleton Service (PostsStoreService): All data that needs to be available in multiple components and cached is stored here. Components retrieve data from this service rather than making direct API calls. The service utilizes localStorage to save and load favorite post IDs, ensuring persistence across browser sessions.

Zoneless Change Detection: The application utilizes provideZonelessChangeDetection() in app.config.ts for optimized and efficient UI rendering based on signals.

Asynchronicity: RxJS is used to handle HTTP requests and data streams, while HttpClient is used for API requests.

## Additional Notes

Filtering: Filtering by post content is implemented on the frontend. Filtering by user uses the userId parameter in the API request, and filtering by favorites is based on the state stored in PostsStoreService.

Animations: A slide-in animation is applied to the post list items, which re-triggers upon initial load and every time a filter is applied.

Responsiveness: The application is fully responsive, using Flexbox and Tailwind CSS to ensure correct display on all devices.
