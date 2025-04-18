// import { createContext, useContext, useEffect, useState } from 'react';
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
// import { auth } from '../firebase';

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   function signUp(email, password, userType) {
//     localStorage.setItem("userType", userType); // store userType
//     return createUserWithEmailAndPassword(auth, email, password).then((res) => {
//       return { ...res.user, userType }; // return userType for redirection logic
//     });
//   }
  
//   function logIn(email, password, userType) {
//     localStorage.setItem("userType", userType); // store userType
//     return signInWithEmailAndPassword(auth, email, password).then((res) => {
//       return { ...res.user, userType }; // return userType for redirection
//     });
//   }
  
  
//   function logOut() {
//     return signOut(auth);
//   }

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ signUp, logIn, logOut, user, loading }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }


import { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function signUp(email, password, userType) {
    localStorage.setItem("userType", userType);
    return createUserWithEmailAndPassword(auth, email, password).then((res) => {
      return { ...res.user, userType };
    });
  }

  function logIn(email, password, userType) {
    localStorage.setItem("userType", userType);
    return signInWithEmailAndPassword(auth, email, password).then((res) => {
      return { ...res.user, userType };
    });
  }

  function logOut() {
    localStorage.removeItem("userType");
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userType = localStorage.getItem("userType") || "candidate";
        setCurrentUser({ ...user, userType });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, signUp, logIn, logOut, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
