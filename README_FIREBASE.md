# AUTO WORLD - Vehicle Marketplace Backend Setup Guide

Welcome to AUTO WORLD! This guide will help you set up Firebase backend integration for your vehicle marketplace application.

## 📁 Project Structure

```
lib/
├── firebase/
│   ├── config.ts           # Firebase configuration and constants
│   ├── init.ts             # Firebase initialization
│   ├── index.ts            # Services export index
│   ├── auth.ts             # Authentication functions
│   ├── vehicles.ts         # Vehicle listing functions
│   ├── messaging.ts        # Messaging and notifications
│   └── storage.ts          # File upload utilities
├── validation.ts           # Form validation utilities
└── utils.ts                # General utilities

store/
└── app-store.ts            # Zustand global state management

FIREBASE_SETUP.md            # Comprehensive Firebase setup guide
```

## 🚀 Quick Start

### 1. Firebase Configuration

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Get your Firebase config credentials
3. Create `.env.local` file in project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2. Install Firebase

```bash
npm install firebase zustand
```

### 3. Enable Firebase Services

- Authentication (Email/Password)
- Firestore Database
- Cloud Storage
- Real-time Database (optional)

See `FIREBASE_SETUP.md` for detailed instructions.

## 📚 Available Services

### Authentication (`lib/firebase/auth.ts`)
```typescript
import { signUpUser, signInUser, signOutUser } from '@/lib/firebase';

// Sign up new user
const user = await signUpUser({
  email: 'user@example.com',
  password: 'SecurePass123',
  name: 'John Doe',
  phone: '+233244567890',
  location: 'Accra, Ghana'
});

// Sign in user
const loggedIn = await signInUser('user@example.com', 'SecurePass123');

// Sign out
await signOutUser();
```

### Vehicle Listings (`lib/firebase/vehicles.ts`)
```typescript
import { postVehicle, getAllVehicles, searchVehicles } from '@/lib/firebase';

// Post new vehicle
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
  images: imageFiles // File[]
});

// Get all vehicles
const vehicles = await getAllVehicles();

// Search with filters
const results = await searchVehicles({
  minPrice: 10000,
  maxPrice: 50000,
  location: 'Accra',
  condition: 'pre-owned',
  fuelType: 'petrol'
});
```

### Messaging (`lib/firebase/messaging.ts`)
```typescript
import { 
  sendMessage, 
  getOrCreateChat, 
  getUserChats,
  createNotification 
} from '@/lib/firebase';

// Create or get chat
const chatId = await getOrCreateChat(userId1, 'John', userId2, 'Jane');

// Send message
await sendMessage(userId1, 'John', userId2, chatId, 'Hello!');

// Get chats
const chats = await getUserChats(userId);

// Send notification
await createNotification(userId, 'message', 'New Message', 'You have a new message');
```

### File Storage (`lib/firebase/storage.ts`)
```typescript
import { uploadVehicleImages, uploadUserAvatar, compressImage } from '@/lib/firebase';

// Upload vehicle images
const imageUrls = await uploadVehicleImages(userId, imageFiles);

// Upload user avatar
const avatarUrl = await uploadUserAvatar(userId, avatarFile);

// Compress image before upload
const compressedBlob = await compressImage(imageFile, 0.7, 1920, 1440);
```

### Form Validation (`lib/validation.ts`)
```typescript
import { validateSignUp, validateVehiclePosting, getFieldError } from '@/lib/validation';

// Validate sign up form
const result = validateSignUp({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'SecurePass123',
  confirmPassword: 'SecurePass123'
});

if (!result.isValid) {
  result.errors.forEach(error => {
    console.error(`${error.field}: ${error.message}`);
  });
}

// Get specific field error
const emailError = getFieldError(result.errors, 'email');
```

## 🔧 Global State Management (Zustand)

```typescript
import { useAppStore } from '@/store/app-store';

export default function MyComponent() {
  const { 
    // Auth
    isAuthenticated, 
    user, 
    setAuth, 
    clearAuth,
    
    // UI
    isMenuOpen, 
    setIsMenuOpen,
    isFilterOpen, 
    setIsFilterOpen,
    
    // Search/Filter
    searchQuery, 
    setSearchQuery,
    filters, 
    setFilters,
    
    // Vehicles
    likedCars, 
    toggleLike
  } = useAppStore();

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.name}!</p>
      ) : (
        <p>Please sign in</p>
      )}
    </div>
  );
}
```

## 📋 Database Collections

### users
```
{
  uid: string,
  email: string,
  name: string,
  phone: string,
  location: string,
  avatar: string,
  bio: string,
  rating: number,
  reviews: number,
  sold: number,
  listings: number,
  joined: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### vehicles
```
{
  uid: string,
  title: string,
  brand: string,
  model: string,
  year: number,
  price: number,
  mileage: string,
  location: string,
  condition: string,
  transmission: string,
  fuelType: string,
  images: string[],
  views: number,
  likes: number,
  status: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### chats
```
{
  participants: string[],
  participantNames: string[],
  lastMessage: string,
  lastMessageTime: timestamp,
  unreadCount: {userId: number},
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### messages
```
{
  senderId: string,
  senderName: string,
  receiverId: string,
  chatId: string,
  text: string,
  read: boolean,
  createdAt: timestamp
}
```

## ⚠️ Important Security Notes

1. **Environment Variables**: Never commit `.env.local` to version control
2. **Firebase Rules**: Update security rules in Firebase Console for production
3. **Authentication**: Always validate user input before database operations
4. **Storage**: Implement proper access controls for file uploads
5. **Validation**: Use provided validation functions before sending data to Firebase

## 🐛 Troubleshooting

### "Firebase app not initialized"
- Ensure all env variables are set correctly
- Check that `.env.local` is in the project root
- Restart dev server after adding env variables

### "Permission denied" errors
- Check Firestore security rules
- Verify user is authenticated
- Ensure user ID matches document permissions

### "Storage bucket not found"
- Verify `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` is set
- Check Firebase Storage is enabled in Console

## 📖 Next Steps

1. Read `FIREBASE_SETUP.md` for detailed setup instructions
2. Test Firebase connection in development
3. Implement authentication pages
4. Integrate vehicle posting with storage
5. Deploy to production with environment variables

## 💡 Tips

- Use Zustand store for global state instead of prop drilling
- Always validate forms before sending to Firebase
- Compress images before uploading to save storage space
- Implement proper error handling in production
- Monitor Firebase usage and costs in Console

---

For detailed Firebase setup instructions, see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
