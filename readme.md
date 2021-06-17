### Set the relative file paths properly.
-search for avatar.png, avatar-blank.png, admin.js, dd.js, logo.svg in the code (admin.html)

### Change API Keys in Config

    const  firebaseConfig  = {
	    // apiKey:
	    // authDomain:
	    // databaseURL:
	    // projectId:
	    // storageBucket:
	    // messagingSenderId:
	    // appId:
    };

###  Activate Firebase Authentication, Realtime DB, Cloud Storage
### Firebase Security Rules -

 - Firebase Authentication - add Email and Password Auth, add Admin user manually, with valid Email (preferably any official email)
 - Disable Firebase Database (Cloud Firestore) - by below security rule- 
```  
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
} 
```
 - Enable Firebase Realtime Database - by below security rule replacing `registeredmail`- 
```  
{
  "rules": {
    ".read": "true",
    ".write": "auth != null && auth.token.email == 'registeredmail'",
  }
} 
```
 - Enable Firebase Storage - by below security rule replacing `registeredmail`- 
```  
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read; 
      allow write : if request.auth != null && request.auth.token.email == 'registeredmail';
    }
  }
} 
```
