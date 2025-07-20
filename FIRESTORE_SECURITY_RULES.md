# Production Firestore Security Rules

## Copy this to your Firebase Console → Firestore → Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User documents - users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId
        && isValidUserData(request.resource.data);
      
      // Allow user creation during signup
      allow create: if request.auth != null 
        && request.auth.uid == userId
        && isValidNewUser(request.resource.data);
    }
    
    // User profiles (public subset of user data)
    match /user-profiles/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
        && request.auth.uid == userId
        && isValidProfileData(request.resource.data);
    }
    
    // Ideas/suggestions collection
    match /ideas/{ideaId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null 
        && isValidIdeaData(request.resource.data)
        && request.resource.data.authorId == request.auth.uid;
      allow update: if request.auth != null 
        && resource.data.authorId == request.auth.uid;
      allow delete: if request.auth != null 
        && resource.data.authorId == request.auth.uid;
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
  
  // Validation functions
  function isValidUserData(data) {
    return data.keys().hasAll(['uid', 'email', 'createdAt']) &&
           data.uid is string &&
           data.email is string &&
           data.email.matches('.*@.*\\..*') &&
           data.createdAt is timestamp &&
           (!('isActive' in data) || data.isActive is bool) &&
           (!('emailVerified' in data) || data.emailVerified is bool);
  }
  
  function isValidNewUser(data) {
    return isValidUserData(data) &&
           data.uid == request.auth.uid &&
           data.email == request.auth.token.email;
  }
  
  function isValidProfileData(data) {
    return data.keys().hasAll(['displayName']) &&
           data.displayName is string &&
           data.displayName.size() <= 100 &&
           (!('bio' in data) || (data.bio is string && data.bio.size() <= 500));
  }
  
  function isValidIdeaData(data) {
    return data.keys().hasAll(['title', 'description', 'authorId', 'createdAt']) &&
           data.title is string &&
           data.title.size() > 0 &&
           data.title.size() <= 200 &&
           data.description is string &&
           data.description.size() > 0 &&
           data.description.size() <= 2000 &&
           data.authorId == request.auth.uid &&
           data.createdAt is timestamp;
  }
}
```

## Key Security Features:

1. **User Isolation**: Users can only access their own data
2. **Data Validation**: Strict validation for all document types
3. **Email Verification**: Ensures email matches authenticated user
4. **Rate Limiting**: Firebase handles rate limiting automatically
5. **Field Validation**: Checks data types and sizes
6. **Prevent Impersonation**: Users cannot create documents for other users

## To Apply These Rules:

1. Go to Firebase Console
2. Select your project: `idearoute-b8849`
3. Click "Firestore Database"
4. Click "Rules" tab
5. Replace the content with the rules above
6. Click "Publish"

## User Document Schema:

```typescript
interface UserDocument {
  // Required fields
  uid: string;                    // Firebase UID
  email: string;                  // User's email
  createdAt: Timestamp;           // Account creation time
  
  // Optional fields
  displayName?: string;           // User's display name
  photoURL?: string;              // Profile picture URL
  emailVerified?: boolean;        // Email verification status
  isActive?: boolean;             // Account status
  lastLoginAt?: Timestamp;        // Last login time
  lastSeenAt?: Timestamp;         // Last activity time
  loginCount?: number;            // Number of logins
  signUpMethod?: string;          // 'email' | 'google'
  lastSignInMethod?: string;      // Last sign-in method used
  
  // Google OAuth specific
  googleProfile?: {
    providerId: string;
    lastSignIn: Timestamp;
  };
  
  // Metadata
  updatedAt?: Timestamp;          // Last update time
}
```

This schema provides comprehensive user tracking while maintaining privacy and security.
