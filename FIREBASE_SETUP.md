# Firebase Backend Setup Guide

This guide explains how to configure Firebase for your AUTO WORLD application.

## Prerequisites

1. A Firebase account (https://firebase.google.com)
2. Node.js and npm installed
3. Basic understanding of Firebase services

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" or "Create a project"
3. Enter project name: "AUTO WORLD" (or your preferred name)
4. Uncheck "Enable Google Analytics" (optional)
5. Click "Create project" and wait for completion

## Step 2: Set Up Firebase Services

### Authentication
1. In Firebase Console, go to **Authentication** in the left sidebar
2. Click **Get Started**
3. Enable **Email/Password** authentication:
   - Click on **Email/Password**
   - Toggle ON "Enable"
   - Click **Save**

### Firestore Database
1. Go to **Firestore Database**
2. Click **Create Database**
3. Start in **Production mode**
4. Select your database location (closest to your users)
5. Click **Create**
6. After creation, go to **Rules** tab and update with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      allow read: if true; // Allow others to view public profiles
    }
    
    // Allow users to read all vehicles
    match /vehicles/{vehicleId} {
      allow read: if true;
      allow create, update, delete: if request.auth.uid == resource.data.uid || request.auth.uid == request.resource.data.uid;
    }
    
    // Allow messaging
    match /chats/{chatId} {
      allow read, write: if request.auth.uid in resource.data.participants;
    }
    
    match /messages/{messageId} {
      allow read: if request.auth.uid in [resource.data.senderId, resource.data.receiverId];
      allow create: if request.auth.uid == request.resource.data.senderId;
    }
    
    // Allow notifications
    match /notifications/{notificationId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
    
    // Default: deny all access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Cloud Storage
1. Go to **Storage**
2. Click **Get Started**
3. Accept security rules (we'll update them later)
4. Select default storage location
5. Click **Done**
6. Go to **Rules** tab and update with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow users to upload and read their own files
    match /vehicle-images/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }
    
    match /user-avatars/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }
    
    match /chat-attachments/{userId}/{allPaths=**} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

## Step 3: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Select your app or create a new web app
3. Copy the config object containing:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

## Step 4: Set Up Environment Variables

1. Open `.env.local` file in your project root
2. Add the following environment variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

3. Restart your development server for changes to take effect

## Step 5: Install Firebase Package

Make sure Firebase is installed:

```bash
npm install firebase
```

## Step 6: Test the Connection

Create a test file to verify Firebase is connected:

```typescript
import { auth } from '@/lib/firebase/init';

export default function TestPage() {
  console.log('Firebase Auth:', auth);
  return <div>Firebase Connected!</div>;
}
```

## Using Firebase Services

### Authentication Example

```typescript
import { signUpUser, signInUser } from '@/lib/firebase/auth';

// Sign up
const user = await signUpUser({
  email: 'user@example.com',
  password: 'SecurePass123',
  name: 'John Doe',
  phone: '+233244567890',
  location: 'Accra, Ghana'
});

// Sign in
const signedInUser = await signInUser('user@example.com', 'SecurePass123');
```

### Posting Vehicles Example

```typescript
import { postVehicle } from '@/lib/firebase/vehicles';

const vehicleId = await postVehicle(userId, {
  title: 'Honda CR-V (2019)',
  brand: 'Honda',
  model: 'CR-V',
  year: 2019,
  price: 23500,
  mileage: '22,000 km',
  location: 'Accra',
  condition: 'pre-owned',
  transmission: 'automatic',
  fuelType: 'petrol',
  engine: '2.0L Petrol',
  seats: 5,
  description: 'Beautiful vehicle in excellent condition',
  features: ['Air Conditioning', 'Power Windows'],
  images: imageFiles
});
```

### Messaging Example

```typescript
import { sendMessage, getOrCreateChat } from '@/lib/firebase/messaging';

// Create or get chat
const chatId = await getOrCreateChat(
  userId1, 
  'John Doe', 
  userId2, 
  'Jane Smith'
);

// Send message
await sendMessage(
  userId1,
  'John Doe',
  userId2,
  chatId,
  'Hello, is this vehicle still available?'
);
```

### Form Validation Example

```typescript
import { validateVehiclePosting, getFieldError } from '@/lib/validation';

const result = validateVehiclePosting(formData);

if (!result.isValid) {
  result.errors.forEach(error => {
    console.error(`${error.field}: ${error.message}`);
  });
}
```

## Database Schema

### Users Collection
```
{
  uid: string (document ID)
  email: string
  name: string
  phone: string
  location: string
  avatar: string (URL)
  bio: string
  rating: number
  reviews: number
  sold: number
  listings: number
  totalViews: number
  avgResponseTime: string
  totalRevenue: string
  joined: string
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Vehicles Collection
```
{
  uid: string (seller ID)
  title: string
  brand: string
  model: string
  year: number
  price: number
  mileage: string
  location: string
  condition: string
  transmission: string
  fuelType: string
  engine: string
  seats: number
  description: string
  features: array<string>
  images: array<string> (URLs)
  views: number
  likes: number
  featured: boolean
  status: string (active/sold/archived)
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Messages Collection
```
{
  senderId: string
  senderName: string
  receiverId: string
  chatId: string (reference to chats)
  text: string
  attachments: array<string> (URLs)
  read: boolean
  createdAt: timestamp
}
```

### Chats Collection
```
{
  participants: array<string> (user IDs)
  participantNames: array<string>
  lastMessage: string
  lastMessageTime: timestamp
  lastMessageSenderId: string
  unreadCount: object {userId: number}
  createdAt: timestamp
  updatedAt: timestamp
}
```

## Available Functions

### Authentication
- `signUpUser(data)` - Create new user account
- `signInUser(email, password)` - Sign in existing user
- `signOutUser()` - Sign out current user
- `resetPassword(email)` - Send password reset email
- `getUserProfile(uid)` - Get user profile data
- `updateUserProfile(uid, updates)` - Update user information

### Vehicles
- `postVehicle(uid, data)` - Create new vehicle listing
- `getAllVehicles(constraints)` - Get all vehicles
- `getUserVehicles(uid)` - Get user's listings
- `getVehicle(vehicleId)` - Get single vehicle
- `updateVehicle(vehicleId, updates)` - Update listing
- `deleteVehicle(vehicleId, uid)` - Delete listing
- `searchVehicles(filters)` - Search with filters
- `incrementVehicleViews(vehicleId)` - Track views

### Messaging
- `sendMessage(senderId, senderName, receiverId, chatId, text)` - Send message
- `getOrCreateChat(user1Id, user1Name, user2Id, user2Name)` - Get or create chat
- `getUserChats(userId)` - Get user's conversations
- `getChatMessages(chatId)` - Get chat messages
- `createNotification(userId, type, title, message)` - Send notification
- `getUserNotifications(userId)` - Get notifications

### Storage
- `uploadVehicleImages(uid, files)` - Upload vehicle images
- `uploadUserAvatar(uid, file)` - Upload avatar
- `uploadChatAttachment(uid, chatId, file)` - Upload attachment
- `compressImage(file)` - Compress before upload
- `deleteStorageFile(fileUrl)` - Delete file

## Deployment Considerations

1. **Environment Variables**: Ensure all Firebase credentials are set in your production environment (Vercel, etc.)
2. **Security Rules**: Review and update security rules based on your requirements
3. **Database Indexes**: Firebase will suggest indexes as you use queries
4. **Monitoring**: Use Firebase Console to monitor usage and performance
5. **Backups**: Enable Cloud Firestore backups in the Firebase Console

## Troubleshooting

### "Firebase app not initialized"
- Ensure `.env.local` has correct Firebase credentials
- Verify `NEXT_PUBLIC_FIREBASE_PROJECT_ID` is set

### "Permission denied" errors
- Check Firestore security rules
- Verify user is authenticated
- Check if user ID matches document permissions

### "Storage bucket not found"
- Ensure `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` is set correctly
- Verify storage bucket exists in Firebase Console

### "Message not sending"
- Check messaging service functions
- Verify chat exists before sending message
- Check user has write permission to messages collection

## Next Steps

1. Test Firebase connection in development
2. Implement authentication pages (sign up, sign in)
3. Integrate vehicle posting with Firebase storage
4. Set up real-time messaging
5. Deploy to production with environment variables
