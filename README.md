Angular Application Implementation Plan
This document presents a detailed implementation plan for a post management application in Angular 20. The plan includes the architecture, directory structure, list of components, services, and state management approach, taking into account all project requirements.

1. Directory Structure
   The application will be organized according to the feature-first convention, with separate core, shared, and features areas for better clarity and scalability.

```
src/
├── app/
│   ├── core/                  # Services and logic that operate globally in the application
│   │   ├── services/
│   │   │   └── posts-store.service.ts  # Singleton for storing post data
│   │   └── core.routes.ts
│   ├── features/              # Lazy-loaded module
│   │   ├── posts/
│   │   │   ├── posts-list/
│   │   │   │   └── posts-list.component.ts
│   │   │   ├── post-details/
│   │   │   │   └── post-details.component.ts
│   │   │   ├── posts.routes.ts
│   │   │   └── posts.service.ts  # HTTP request handling
│   ├── shared/                # Reusable components, pipes, and directives
│   │   ├── components/
│   │   │   ├── loader/
│   │   │   │   └── loader.component.ts
│   │   │   └── filter/
│   │   │       └── filter.component.ts
│   │   └── pipes/
│   │       └── content-excerpt.pipe.ts
│   ├── app.component.ts
│   └── app.routes.ts
├── index.html
├── styles.css
└── main.ts

```

2. Component List
   AppComponent: The main component containing the router outlet.

   PostsListComponent (features/posts/posts-list): Displays a list of posts with titles and content excerpts. It will use PostCardComponent. It will implement filtering.

   PostDetailsComponent (features/posts/post-details): Displays the full post content, author data, and comments list. It will use UserDetailsComponent.

   FavoritesComponent (features/favorites): A component for displaying a list of favorite posts.

   PostCardComponent (shared/components/post-card): A reusable component for displaying a single post on the list. It will contain a button to mark a post as a favorite (toggle).

   UserDetailsComponent (shared/components/user-details): A component for displaying information about the post's author.

   FilterComponent (shared/components/filter): A UI component for handling post filtering (by content and by user).

   LoaderComponent (shared/components/loader): Will display a spinner or skeleton while loading data from the API.

3. Services
   PostsService:

   Used for direct communication with the external API https://jsonplaceholder.typicode.com.

   Will contain methods for fetching posts, users, and comments, using HttpClient and RxJS.

   Methods: getPosts(userId?: number): Observable<Post[]>, getPost(id: number): Observable<Post>, getUser(id: number): Observable<User>, getComments(postId: number): Observable<Comment[]>.

   PostsStoreService (Singleton):

   The central cache of the application.

   Stores post data in signals (posts: WritableSignal<Post[]>, favorites: WritableSignal<number[]>).

   Provides logic to check if post data is already available in memory. If so, it returns it from the signal. If not, it calls a method from PostsService and updates the signal.

   Data refresh only occurs when filters change or the page is reloaded.

   It will also manage the state of favorite posts.

4. State Management Approach
   State management will be based on two pillars:

   Signals: Used to manage state within components (e.g., loading state, UI element visibility) and to store data in the singleton PostsStoreService. Thanks to signals, components will automatically react to state changes.

   Singleton Service (PostsStoreService):

   All data that needs to be available in multiple places and that needs to be cached will be stored in this service.

   Components, instead of fetching data directly from the API, will retrieve it from PostsStoreService.

   This service will decide whether a new API request is needed.

   Favorite posts will be stored in a signal favorites: WritableSignal<number[]> within this service.

   zoneless Architecture: Using provideZonelessChangeDetection() in main.ts will ensure optimization and efficient UI rendering based on signals.

   Additional Notes:
   Asynchronicity: We will use RxJS to handle HTTP requests and data streams, and HttpClient for API requests.

   Filtering:

   Filtering by post content (filter by content) will be implemented on the frontend side.

   Filtering by user (filter by user) will use the userId parameter in the API request.

   Filtering by favorites will be based on the state stored in PostsStoreService.

   Animations: At least one transition animation (enter/leave) will be applied, e.g., for the post list container or the details view.

   Responsiveness: The application will be fully responsive, using flexbox and responsive classes provided by TailwindCSS to ensure correct display on mobile and desktop devices.
