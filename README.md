### 1. Clone the repository</span>

git clone <your-repo-url>
cd <your-repo-folder>

### 2. install the dependency

npm install

# or

yarn install

### 3 create .env

# Firebase client-side configuration

NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase server-side (Admin SDK) configuration

FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="your_private_key_with_newlines_escaped"

### 4

npm run dev

# or

yarn run dev

## Assignment questions

### Why did you choose Firebase or Supabase for this assignment?

I chose **Firebase** because it provides a fully managed backend with real-time database capabilities, authentication, and easy integration with frontend frameworks like React or Next.js. Even though I handled data fetching on the server side, Firebase simplified tasks like authentication, user management, and database interactions, allowing me to focus on implementing features like task creation, updates, and secure access without building a full backend from scratch.

### What factors would make you choose the other option in a real production system?

In a larger production system, I might consider **Supabase** if I need more traditional relational database features, such as complex queries with joins, strict SQL structure, or greater control over database indexing. Supabase also makes scaling and migrations more predictable because it’s built on PostgreSQL, which is widely used in enterprise environments.

### If this app suddenly gets 10,000 active users, what are the first 3 problems or bottlenecks you expect, and how would you address them?

1. **Database read/write performance:** High traffic could slow down queries, especially with real-time listeners. I would address this by optimizing indexes, batching writes, and using caching mechanisms for frequently accessed data.
2. **Authentication load:** 10,000 simultaneous login requests could strain the auth system. I’d monitor auth usage and, if needed, implement session caching or token-based strategies to reduce repeated validation overhead.
3. **Frontend performance:** Rendering a large number of tasks or updates could make the app sluggish. I’d implement pagination, lazy loading, and optimize React rendering with memoization or virtualization libraries.

### One design or technical decision you made that you know is not ideal, but accepted due to time constraints

For simplicity, I linked tasks directly to users without creating a separate normalized task collection with references. While this works for the assignment, it’s not ideal for scalability or complex queries. In a production scenario, I would normalize the data structure and use references to improve flexibility and maintainability.

### How would you modify the system if:

**1. Firebase/Supabase is removed**  
I would replace the backend with a RESTful API or GraphQL server using Node.js/Express and a relational database like PostgreSQL or MySQL. Authentication could be handled using JWTs, and real-time updates could be implemented using WebSockets.

**2. Role-based access is introduced**  
I would add a `role` field for users and implement middleware on both the server and client to check permissions before allowing access to certain endpoints or UI elements. This ensures only authorized users can perform sensitive actions.

**3. Activity/audit logs are required**  
I would create a separate `logs` collection or table to store all critical actions (e.g., task creation, edits, deletions) with user ID and timestamp. This allows tracking changes for auditing and debugging, and could later be used for analytics.
